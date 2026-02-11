import Link from "next/link";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface ButtonLinkProps
  extends VariantProps<typeof buttonVariants> {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function ButtonLink({
  href,
  variant = "default",
  size = "default",
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Button variant={variant} size={size} asChild className={cn(className)}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
