
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BadgeCheck, Box, Lock } from 'lucide-react';
import Image from 'next/image';
import { MotionDiv } from '@/components/motion-div';

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay,
      duration: 0.5,
    }
  },
});

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 xl:py-48 relative overflow-hidden">
        <MotionDiv 
          className="container px-4 md:px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <MotionDiv variants={fadeIn()}>
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              The Future of Achievement is Verifiable
            </h1>
          </MotionDiv>
          <MotionDiv variants={fadeIn(0.2)}>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-6">
              SkillCert transforms your accomplishments into permanent, tamper-proof digital assets on the Solana blockchain. Mint, manage, and share your skills with undeniable proof.
            </p>
          </MotionDiv>
          <MotionDiv variants={fadeIn(0.4)}>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-primary/40 hover:shadow-[0_0_25px_0]">
                <Link href="/dashboard">Launch App & Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </MotionDiv>
        </MotionDiv>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 md:py-32 bg-background/80">
        <div className="container px-4 md:px-6">
          <MotionDiv 
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
          >
            <MotionDiv variants={fadeIn()}><div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div></MotionDiv>
            <MotionDiv variants={fadeIn(0.1)}><h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Why SkillCert is the Ultimate Platform</h2></MotionDiv>
            <MotionDiv variants={fadeIn(0.2)}>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We leverage cutting-edge blockchain technology to provide a seamless and powerful experience for professionals and issuers.
                </p>
            </MotionDiv>
          </MotionDiv>
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <MotionDiv 
                className="flex flex-col justify-center space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
            >
                <ul className="grid gap-6">
                    <MotionDiv variants={fadeIn()}>
                        <li>
                            <div className="grid gap-2 p-6 rounded-lg border border-border/50 bg-card/50 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1">
                                <h3 className="text-xl font-bold font-headline flex items-center gap-3"><Lock className="text-primary h-7 w-7"/> Immutable & Secure</h3>
                                <p className="text-muted-foreground">Once minted on Solana, your certificate is permanent and cannot be altered or faked, ensuring ultimate trust.</p>
                            </div>
                        </li>
                    </MotionDiv>
                     <MotionDiv variants={fadeIn()}>
                        <li>
                            <div className="grid gap-2 p-6 rounded-lg border border-border/50 bg-card/50 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1">
                                <h3 className="text-xl font-bold font-headline flex items-center gap-3"><Box className="text-primary h-7 w-7"/> Cost-Effective Minting</h3>
                                <p className="text-muted-foreground">Utilizing zk-compressed accounts on Solana, minting is incredibly affordable, making certification accessible to everyone.</p>
                            </div>
                        </li>
                    </MotionDiv>
                     <MotionDiv variants={fadeIn()}>
                         <li>
                             <div className="grid gap-2 p-6 rounded-lg border border-border/50 bg-card/50 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1">
                                 <h3 className="text-xl font-bold font-headline flex items-center gap-3"><BadgeCheck className="text-primary h-7 w-7"/> Trusted Verification</h3>
                                 <p className="text-muted-foreground">Our platform uses Chainlink Functions for decentralized, reliable, and transparent authenticity checks of every certificate.</p>
                            </div>
                        </li>
                    </MotionDiv>
                </ul>
            </MotionDiv>
            <MotionDiv
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
            >
                <Image
                    src="https://placehold.co/600x600.png"
                    width="600"
                    height="600"
                    alt="Abstract representation of blockchain technology"
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    data-ai-hint="dark blockchain futuristic"
                />
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 md:py-32 border-t">
        <MotionDiv 
            className="container grid items-center justify-center gap-4 px-4 text-center md:px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
        >
          <MotionDiv variants={fadeIn()} className="space-y-3">
            <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">Ready to Own Your Achievements?</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don't let your hard work fade away on paper. Mint your skills on the blockchain and take control of your professional identity.
            </p>
          </MotionDiv>
          <MotionDiv variants={fadeIn(0.2)} className="mx-auto w-full max-w-sm space-y-2">
             <Button asChild size="lg" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity">
              <Link href="/dashboard">Mint Your First Certificate</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
                Start for free. Connect your wallet to begin.
            </p>
          </MotionDiv>
        </MotionDiv>
      </section>
      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p className="text-muted-foreground">© {new Date().getFullYear()} SkillCert. Built for the Chainlink Constellation Hackathon.</p>
      </footer>
    </>
  );
}
