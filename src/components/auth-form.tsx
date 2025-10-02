"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { createUserInFirestore } from "@/app/actions/auth";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormProps = {
  mode: "login" | "signup";
};

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <title>Google</title>
        <path
          fill="currentColor"
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.83 0-6.95-3.12-6.95-6.95s3.12-6.95 6.95-6.95c2.25 0 3.63.92 4.47 1.7l2.2-2.2C18.63 2.18 15.97 1 12.48 1 5.88 1 1 5.88 1 12.48s4.88 11.48 11.48 11.48c3.47 0 6.04-1.18 8.01-3.15 2.05-2.05 2.72-4.96 2.72-8.15 0-.73-.08-1.42-.22-2.05H12.48z"
        />
      </svg>
    );
  }

export function AuthForm({ mode }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuthSuccess = async (user: FirebaseUser) => {
    if (mode === "signup") {
      await createUserInFirestore(user.uid, user.email, user.displayName, user.photoURL);
    }
    router.push("/chat");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let userCredential;
      if (mode === "signup") {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
      }
      await handleAuthSuccess(userCredential.user);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message.replace("Firebase: ", ""),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleAuthSuccess(result.user);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-In failed",
        description: error.message.replace("Firebase: ", ""),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">
          {mode === "login" ? "Welcome Back" : "Create an Account"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your email below to log in to your account."
            : "Enter your email and password to get started."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "login" ? "Log In" : "Sign Up"}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
      </CardContent>
      <CardFooter className="text-sm text-center block">
        {mode === "login" ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-accent">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link href="/login" className="underline text-accent">
              Log in
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
