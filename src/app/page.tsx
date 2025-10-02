import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/landing-header";
import { MessageCircle, BrainCircuit, BookCopy, UserPlus, Rocket, Mail, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
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
              <div className="flex flex-col justify-center space-y-4 animate-in slide-in-from-bottom">
                <h1
                  className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                  style={{ animationDelay: '0.1s' }}
                >
                  Your Digital Doppelgänger Awaits
                </h1>
                <p 
                  className="max-w-[600px] text-muted-foreground md:text-xl"
                  style={{ animationDelay: '0.2s' }}
                >
                  ShadowLink uses Gemini AI to learn your personality, creating a digital twin that can chat, write, and think just like you. Train your AI, and unleash your digital self.
                </p>
                <div 
                  className="w-full max-w-sm"
                  style={{ animationDelay: '0.3s' }}
                >
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/signup">Get Started For Free</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <Card className="glass-card w-full max-w-md p-6 rounded-2xl shadow-2xl animate-in" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-start gap-4 animate-in slide-in-from-bottom" style={{ animationDelay: '0.5s' }}>
                        <div className="bg-primary rounded-full p-2">
                            <MessageCircle className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg flex-1">
                            <p className="text-sm text-foreground">Hey, how's it going? I was thinking about our project...</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4 mt-4 justify-end animate-in slide-in-from-bottom" style={{ animationDelay: '0.8s' }}>
                        <div className="bg-accent p-3 rounded-lg flex-1 text-right">
                            <p className="text-sm text-accent-foreground">It's going great! I just pushed the latest updates. I was thinking we could add that new feature we discussed. What do you think?</p>
                        </div>
                         <div className="bg-secondary rounded-full p-2">
                            <BrainCircuit className="h-6 w-6 text-secondary-foreground" />
                        </div>
                    </div>
                     <div className="flex items-start gap-4 mt-4 animate-in slide-in-from-bottom" style={{ animationDelay: '1.1s' }}>
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
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm animate-in" style={{ animationDelay: '0.2s' }}>Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline animate-in" style={{ animationDelay: '0.3s' }}>Forge Your Digital Identity</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-in" style={{ animationDelay: '0.4s' }}>
                  ShadowLink provides a powerful suite of tools to create and refine an AI that is truly yours.
                </p>
              </div>
            </div>
            <div className="grid max-w-5xl mx-auto items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <div className="grid gap-1 text-center animate-in slide-in-from-bottom" style={{ animationDelay: '0.5s' }}>
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">AI Personality Engine</h3>
                <p className="text-sm text-muted-foreground">
                  Our Gemini-powered engine analyzes your conversations to mimic your unique writing style, tone, and response patterns.
                </p>
              </div>
              <div className="grid gap-1 text-center animate-in slide-in-from-bottom" style={{ animationDelay: '0.6s' }}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">Real-time Chat Interface</h3>
                <p className="text-sm text-muted-foreground">
                  Engage in dynamic conversations with your AI. The more you chat, the more it learns and adapts.
                </p>
              </div>
              <div className="grid gap-1 text-center animate-in slide-in-from-bottom" style={{ animationDelay: '0.7s' }}>
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

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Get Started in 3 Easy Steps</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Creating your digital twin is a simple and intuitive process.
                </p>
              </div>
            </div>
            <div className="grid max-w-5xl mx-auto items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <UserPlus className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">1. Sign Up & Describe</h3>
                <p className="text-sm text-muted-foreground">
                  Create your account and give the AI a starting point by describing the personality you want it to adopt.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">2. Chat & Train</h3>
                <p className="text-sm text-muted-foreground">
                  Start chatting with your AI. Every interaction helps it learn your style, making it a more accurate reflection of you.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Rocket className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">3. Unleash Your Twin</h3>
                <p className="text-sm text-muted-foreground">
                  Once trained, your AI is ready to chat on your behalf, answer questions, or even brainstorm ideas, all in your unique voice.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-background/80">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">FAQs</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions? We've got answers. Here are some of the most common questions we get.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl w-full py-12">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is ShadowLink?</AccordionTrigger>
                  <AccordionContent>
                    ShadowLink is an AI-powered platform that creates a digital version of you. By analyzing your communication style, it builds an AI that can interact with others just as you would.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How does the AI learn my personality?</AccordionTrigger>
                  <AccordionContent>
                    The AI learns through your conversations. The more you chat with it, the more data it has to analyze your writing style, tone, common phrases, and response patterns. This data is used to build a model that mimics your personality.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, absolutely. We take data privacy and security very seriously. All your conversations are stored securely and are only used for the purpose of training your personal AI. We do not share your data with third parties.
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-4">
                  <AccordionTrigger>Can I use my AI for anything?</AccordionTrigger>
                  <AccordionContent>
                    You can use your AI for a wide range of tasks, including responding to messages, drafting emails, brainstorming ideas, and more. It's designed to be your personal digital assistant and doppelgänger.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                 <div className="grid gap-10 lg:grid-cols-2">
                    <div className="space-y-4">
                         <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Contact</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Get in Touch</h2>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                            Have a question, feedback, or a partnership inquiry? We'd love to hear from you.
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <Card className="w-full max-w-md glass-card">
                            <CardHeader>
                                <CardTitle>Contact Us</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                     <div className="flex items-center gap-4">
                                        <Mail className="h-6 w-6 text-primary" />
                                        <div className="flex-1">
                                            <p className="font-semibold">Email</p>
                                            <a href="mailto:taimiyaamjad0@gmail.com" className="text-muted-foreground hover:text-foreground">
                                                taimiyaamjad0@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                    <Button asChild className="w-full" variant="outline">
                                        <a href="mailto:taimiyaamjad0@gmail.com">
                                            Send us an email <ChevronRight className="ml-2 h-4 w-4"/>
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 ShadowLink. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#features" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="#how-it-works" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            How It Works
          </Link>
          <Link href="#faq" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            FAQs
          </Link>
          <Link href="#contact" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}
