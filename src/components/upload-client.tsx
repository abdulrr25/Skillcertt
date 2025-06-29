
"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Copy, FileText, Loader2, Share2, Sparkles, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import MintingPrice from "./minting-price";
import { motion } from "framer-motion";
import { analyzeCertificate } from "@/ai/flows/analyze-certificate-flow";
import { useCertificates } from "@/context/certificate-context";
import { useWallet } from "@solana/wallet-adapter-react";
import { randomBytes } from "crypto";

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  issuer: z.string().min(2, "Issuer must be at least 2 characters"),
  completionDate: z.date({
    required_error: "A completion date is required.",
  }),
  certificateFile: z.any()
    .refine((files) => files?.length === 1, "Certificate file is required.")
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => ["application/pdf", "image/jpeg", "image/png"].includes(files?.[0]?.type),
      ".pdf, .jpg, and .png files are accepted."
    ),
});

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function UploadClient() {
  const [isMinting, setIsMinting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mintingSuccess, setMintingSuccess] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addCertificate } = useCertificates();
  const { publicKey } = useWallet();

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      issuer: "",
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("certificateFile", e.target.files);
      setFileName(file.name);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      form.setValue("certificateFile", files);
      setFileName(file.name);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
      form.trigger("certificateFile");
    }
  };
  
  const onUploadClick = () => {
    inputRef.current?.click();
  };

  const handleAnalyze = async () => {
    const fileList = form.getValues("certificateFile");
    if (!fileList || fileList.length === 0) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload a certificate file first.",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const file = fileList[0];
      const photoDataUri = await fileToDataUri(file);
      const result = await analyzeCertificate({ photoDataUri });
      
      form.setValue("title", result.title, { shouldValidate: true });
      form.setValue("issuer", result.issuer, { shouldValidate: true });
      // Add T00:00:00 to avoid timezone issues making the date off by one.
      form.setValue("completionDate", new Date(result.date + "T00:00:00"), { shouldValidate: true });
      
      toast({
        title: "Analysis Complete!",
        description: "The form has been auto-filled with the extracted data.",
      });
    } catch (error) {
      console.error("AI analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not extract details from the document. Please fill them in manually.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };


  const onSubmit = (values: z.infer<typeof uploadSchema>) => {
    console.log(values);
    setIsMinting(true);

    setTimeout(() => {
      const newId = `cert_${Date.now()}`;
      const newCertificate = {
        id: newId,
        title: values.title,
        issuer: values.issuer,
        date: values.completionDate.toISOString(),
        userName: publicKey?.toBase58() ?? 'Unknown User',
        ipfsHash: "Qm" + randomBytes(22).toString('hex'), // Simulated IPFS hash
        transactionHash: randomBytes(32).toString('hex'), // Simulated transaction hash
        previewUrl: imagePreview ?? undefined,
        fileType: values.certificateFile[0].type,
        dataAiHint: "custom achievement",
      };

      addCertificate(newCertificate);
      setShareableLink(`${window.location.origin}/verify/${newId}`);
      setIsMinting(false);
      setMintingSuccess(true);
      form.reset();
      setImagePreview(null);
      setFileName(null);
    }, 3000);
  };
  
  const copyToClipboard = () => {
    if(!shareableLink) return;
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: "Copied to clipboard!",
      description: "You can now share your certificate link.",
    });
  };

  return (
    <motion.div 
      className="container max-w-2xl mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-border/60">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><UploadCloud className="text-primary"/> Mint a New Certificate</CardTitle>
          <CardDescription>Fill in the details below to mint your achievement on-chain. Upload a file, then use our AI to auto-fill the form!</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="certificateFile"
                render={() => (
                  <FormItem>
                    <FormLabel>Certificate Document</FormLabel>
                    <FormControl>
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={onUploadClick}
                        className={cn(
                          "relative group w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300",
                          "hover:border-primary/80 hover:bg-primary/10",
                          { "border-primary bg-primary/20 shadow-[0_0_25px_hsl(var(--primary)/.25)]": dragActive }
                        )}
                      >
                         <input
                          ref={inputRef}
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="hidden"
                        />
                        {imagePreview ? (
                          <>
                            <Image src={imagePreview} alt="Certificate preview" layout="fill" objectFit="contain" className="rounded-md p-2" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                               <p className="text-white font-semibold">Click to change file</p>
                            </div>
                          </>
                        ) : fileName ? (
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <FileText className="h-10 w-10 mb-2" />
                                <p className="font-semibold">{fileName}</p>
                                <p className="text-xs mt-2">Click to change file</p>
                            </div>
                        ) : (
                           <div className="flex flex-col items-center justify-center">
                              <UploadCloud className="h-10 w-10 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                              <p className="text-muted-foreground">
                                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">PDF, PNG, JPG or JPEG (max. 5MB)</p>
                            </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                 <Button type="button" variant="outline" className="w-full" onClick={handleAnalyze} disabled={!fileName || isAnalyzing}>
                    {isAnalyzing ? (
                       <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                    ) : (
                       <><Sparkles className="mr-2 h-4 w-4 text-accent" /> Auto-fill with AI</>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">Upload a file, then click here to let AI extract the details.</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                    Certificate Details
                    </span>
                </div>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Advanced Solana Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issuer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuer</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Solana University" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="completionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Completion</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
             
            </CardContent>
            <CardFooter className="flex flex-col gap-4 items-start">
              <MintingPrice />
              <Button type="submit" disabled={isMinting || isAnalyzing} className="w-full">
                {isMinting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Minting Certificate...
                  </>
                ) : (
                  "Confirm and Mint Certificate"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Dialog open={mintingSuccess} onOpenChange={setMintingSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-center">Mint Successful!</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your certificate has been securely minted on the Solana blockchain.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <p className="text-sm text-center text-muted-foreground">Share your verified achievement:</p>
            <div className="flex items-center space-x-2">
                <Input value={shareableLink} readOnly className="font-code text-xs" />
                <Button type="button" size="icon" onClick={copyToClipboard} variant="outline">
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            {shareableLink &&
              <div className="flex justify-center bg-white p-4 rounded-md shadow-inner">
                <Image 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareableLink)}`}
                  alt="QR Code for certificate link" 
                  width={150} 
                  height={150}
                  data-ai-hint="QR code"
                />
              </div>
            }
            <Button asChild className="w-full">
              <Link href={shareableLink} target="_blank" rel="noopener noreferrer">
                <Share2 className="mr-2 h-4 w-4" /> View Your Certificate
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
