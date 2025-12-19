import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border pt-6 text-center text-[10px] text-muted-foreground/60 sm:mt-10">
      <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-xs">
        <Link
          href="/about"
          className="text-muted-foreground hover:text-fuchsia-600 transition-colors"
        >
          About
        </Link>
        <span className="text-muted-foreground/40">·</span>
        <Link
          href="/contact"
          className="text-muted-foreground hover:text-fuchsia-600 transition-colors"
        >
          Contact
        </Link>
        <span className="text-muted-foreground/40">·</span>
        <Link
          href="/privacy"
          className="text-muted-foreground hover:text-fuchsia-600 transition-colors"
        >
          Privacy
        </Link>
        <span className="text-muted-foreground/40">·</span>
        <Link
          href="/terms"
          className="text-muted-foreground hover:text-fuchsia-600 transition-colors"
        >
          Terms
        </Link>
      </div>
      <p>
        ©2025 MBTI Senpai · Open-source · made with
        <span className="text-pink-500"> ♥ </span>
        by <br />
        <Link
          href="https://www.linkedin.com/in/khaing-myel-khant-457b69146/"
          className="font-medium underline underline-offset-2 hover:text-pink-500"
        >
          Khaing Myel Khant
        </Link>
      </p>
    </footer>
  );
}
