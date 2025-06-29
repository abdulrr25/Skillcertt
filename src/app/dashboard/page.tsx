
"use client";

import * as React from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle2, PlusCircle, Share2, ShieldQuestion } from "lucide-react";
import type { Certificate } from "@/lib/types";
import Image from "next/image";
import { CustomWalletButton } from "@/components/custom-wallet-button";
import { motion } from "framer-motion";
import { CertificateSkeleton } from "@/components/certificate-skeleton";
import { useCertificates } from "@/context/certificate-context";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};


export default function DashboardPage() {
  const { connected } = useWallet();
  const { certificates, isLoading } = useCertificates();

  if (!connected) {
    return (
      <motion.div 
        className="container mx-auto px-4 py-12 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="p-4 bg-primary/10 rounded-full mb-6 shadow-lg shadow-primary/20">
            <Award className="h-16 w-16 text-primary" />
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Welcome to Your SkillCert Dashboard
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect your wallet to manage your on-chain certificates, or mint new ones to build your verifiable professional portfolio.
          </p>
          <div className="mt-8">
            <CustomWalletButton />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-headline text-3xl font-bold">Your Certificates</h1>
        <Button asChild>
          <Link href="/upload">
            <PlusCircle className="mr-2 h-5 w-5" />
            Mint New Certificate
          </Link>
        </Button>
      </motion.div>
      {isLoading ? (
          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
           {Array.from({ length: 3 }).map((_, index) => (
             <motion.div key={index} variants={itemVariants}>
                <CertificateSkeleton />
             </motion.div>
            ))}
          </motion.div>
      ) : certificates.length > 0 ? (
        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {certificates.map((cert) => (
            <motion.div key={cert.id} variants={itemVariants}>
              <Card className="flex flex-col overflow-hidden border border-border/50 bg-card/80 shadow-md shadow-black/20 hover:shadow-primary/20 hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                {cert.previewUrl && cert.fileType?.startsWith('image/') ? (
                  <div className="aspect-[1200/848] bg-muted/50 overflow-hidden">
                    <Image
                      src={cert.previewUrl}
                      alt={`Preview of ${cert.title}`}
                      width={1200}
                      height={848}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      data-ai-hint={cert.dataAiHint}
                    />
                  </div>
                ) : (
                  <div className="aspect-[1200/848] bg-muted/50 overflow-hidden flex items-center justify-center">
                    <ShieldQuestion className="h-24 w-24 text-primary/20"/>
                  </div>
                )}
                <CardHeader className="pt-6">
                  <CardTitle className="font-headline text-xl leading-tight">{cert.title}</CardTitle>
                  <CardDescription className="pt-1">Issued by {cert.issuer}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="text-sm text-muted-foreground">
                    Completed on: {new Date(cert.date).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
                  <div className="flex items-center text-xs text-accent font-medium">
                    <CheckCircle2 className="h-4 w-4 mr-1.5 text-accent" />
                    Verified
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/verify/${cert.id}`}>
                      <Share2 className="h-4 w-4 mr-2" />
                      View & Share
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-16 px-6 border-2 border-dashed border-border rounded-lg bg-card/80"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-4 bg-primary/10 rounded-full mb-6 inline-block">
            <Award className="h-12 w-12 text-primary/80" />
          </div>
          <h2 className="mt-2 text-2xl font-semibold font-headline">Your collection is empty!</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            It looks like you haven't minted any certificates yet. Once you do, they'll appear here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/upload">
              <PlusCircle className="mr-2 h-5 w-5" />
              Mint Your First Certificate
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
