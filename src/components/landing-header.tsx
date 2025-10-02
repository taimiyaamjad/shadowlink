import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShadowLinkLogo } from "@/components/icons";

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <ShadowLinkLogo className="h-6 w-6 text-accent" />
          <span className="text-lg font-bold font-headline text-foreground">
            ShadowLink
          </span>
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
        <div className="md:hidden">
            <Button variant="outline" asChild>
                <Link href="/login">Get Started</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
