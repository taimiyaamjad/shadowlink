import Link from "next/link";
import { ShadowLinkLogo } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <ShadowLinkLogo className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold font-headline text-foreground">
            ShadowLink
          </span>
        </Link>
      </div>
      {children}
    </div>
  );
}
