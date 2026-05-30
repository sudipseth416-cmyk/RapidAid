import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <Link href="/" className="font-heading text-xl font-bold">
              Rapid<span className="text-primary">Aid</span>
            </Link>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Saving lives across India — one second at a time.
            </p>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/auth/signin" className="hover:text-primary transition-colors">
              Sign in
            </Link>
            <Link href="/auth/signup" className="hover:text-primary transition-colors">
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RapidAid. Built for India&apos;s emergency response network.</p>
        </div>
      </div>
    </footer>
  );
}
