

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import VerifyClient from "@/components/verify-client";
import { FileText, ExternalLink, ShieldAlert } from "lucide-react";
import VerifyActions from "@/components/verify-actions";
import { truncateWalletAddress } from "@/lib/utils";
import type { Certificate } from "@/lib/types";
import { MotionDiv } from "@/components/motion-div";
import { sampleCertificates } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";

// In a real app, this would be a database call.
// For the prototype, we just use the sample data.
const getCertificateData = async (id: string): Promise<Certificate | null> => {
  const certificate = sampleCertificates.find((cert) => cert.id === id);
  return certificate || null;
};

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export default async function VerifyPage({ params }: { params: { id: string } }) {
  const certificate = await getCertificateData(params.id);

  if (!certificate) {
    return (
       <div className="bg-muted/40 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <MotionDiv 
          className="container mx-auto px-4 py-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl mx-auto flex flex-col items-center p-8 bg-card rounded-xl shadow-2xl shadow-black/30">
            <div className="p-4 bg-destructive/10 rounded-full mb-6">
              <ShieldAlert className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mt-4">
              Certificate Not Found
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We couldn't find a certificate with the provided ID. It may have been deleted, or the link may be incorrect.
            </p>
            <Button asChild className="mt-8">
              <Link href="/dashboard">
                Return to Dashboard
              </Link>
            </Button>
          </div>
        </MotionDiv>
      </div>
    )
  }

  const isImage = certificate.fileType?.startsWith("image/");

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <MotionDiv 
          className="grid lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <MotionDiv className="lg:col-span-2" variants={itemVariants}>
            <Card className="overflow-hidden border-2 border-primary/20 transition-all duration-300 shadow-2xl shadow-primary/10">
              <CardContent className="p-0">
                <div className="aspect-[1200/848] bg-background flex items-center justify-center">
                    {isImage && certificate.previewUrl ? (
                        <Image
                            src={certificate.previewUrl}
                            alt={`Preview of ${certificate.title} certificate`}
                            width={1200}
                            height={848}
                            className="object-contain w-full h-full"
                            data-ai-hint="certificate document"
                        />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <FileText className="h-24 w-24 mb-4 text-primary/50" />
                        <h3 className="font-headline text-xl font-semibold">PDF Document</h3>
                        <p className="text-sm mt-1">
                          This certificate is a PDF file. A preview is not available.
                        </p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
          
          <div className="space-y-6">
            <MotionDiv variants={itemVariants}>
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                      <FileText className="h-8 w-8 text-primary mt-1"/>
                      <div>
                        <CardTitle className="font-headline text-2xl">{certificate.title}</CardTitle>
                        <CardDescription className="pt-2">Issued By: <span className="font-medium text-foreground">{certificate.issuer}</span></CardDescription>
                      </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recipient</span>
                    <span className="font-medium font-code text-right">{truncateWalletAddress(certificate.userName)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-right">{new Date(certificate.date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </MotionDiv>

            <MotionDiv variants={itemVariants}>
              <Card className="border-accent/30">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <VerifyClient />
                </CardContent>
              </Card>
            </MotionDiv>
            
            <MotionDiv variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">On-Chain Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm break-all">
                    <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wider">IPFS HASH</span>
                        <p className="font-code font-medium text-xs mt-1">{certificate.ipfsHash}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wider">SOLANA TRANSACTION</span>
                        <Link href={`https://explorer.solana.com/tx/${certificate.transactionHash}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="flex items-center font-code font-medium text-primary hover:underline text-xs mt-1">
                            {truncateWalletAddress(certificate.transactionHash)}
                            <ExternalLink className="ml-2 h-3 w-3 flex-shrink-0"/>
                        </Link>
                    </div>
                </CardContent>
              </Card>
            </MotionDiv>

            <MotionDiv variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <VerifyActions certificateId={certificate.id} />
                </CardContent>
              </Card>
            </MotionDiv>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
