import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LandingHeader } from "@/components/landing-header";
import { MessageCircle, BrainCircuit, BookCopy } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative w-full h-[80vh] md:h-screen flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background opacity-50 z-0"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-96 h-96 bg-accent rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="w-96 h-96 bg-primary rounded-full blur-3xl opacity-20 animate-pulse animation-delay-4000" />
          </div>
          <div className="container px-4 md:px-6 z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Your Digital Doppelgänger Awaits
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  ShadowLink uses Gemini AI to learn your personality, creating a digital twin that can chat, write, and think just like you. Train your AI, and unleash your digital self.
                </p>
                <div className="w-full max-w-sm">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/signup">Get Started For Free</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <Card className="glass-card w-full max-w-md p-6 rounded-2xl shadow-2xl">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary rounded-full p-2">
                            <MessageCircle className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg flex-1">
                            <p className="text-sm text-foreground">Hey, how's it going? I was thinking about our project...</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4 mt-4 justify-end">
                        <div className="bg-accent p-3 rounded-lg flex-1 text-right">
                            <p className="text-sm text-accent-foreground">It's going great! I just pushed the latest updates. I was thinking we could add that new feature we discussed. What do you think?</p>
                        </div>
                         <div className="bg-secondary rounded-full p-2">
                            <BrainCircuit className="h-6 w-6 text-secondary-foreground" />
                        </div>
                    </div>
                     <div className="flex items-start gap-4 mt-4">
                        <div className="bg-primary rounded-full p-2">
                            <MessageCircle className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg flex-1">
                            <p className="text-sm text-foreground">Awesome! Let's do it. I'll check out the repo now.</p>
                        </div>
                    </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background/80">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Forge Your Digital Identity</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ShadowLink provides a powerful suite of tools to create and refine an AI that is truly yours.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <div className="grid gap-1 text-center">
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">AI Personality Engine</h3>
                <p className="text-sm text-muted-foreground">
                  Our Gemini-powered engine analyzes your conversations to mimic your unique writing style, tone, and response patterns.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">Real-time Chat Interface</h3>
                <p className="text-sm text-muted-foreground">
                  Engage in dynamic conversations with your AI. The more you chat, the more it learns and adapts.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <BookCopy className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">Conversation History</h3>
                <p className="text-sm text-muted-foreground">
                  All your interactions are stored securely, allowing you and your AI to remember past conversations and track its development.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 ShadowLink. All rights reserved.</p>
      </footer>
    </div>
  );
}
