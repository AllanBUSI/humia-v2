import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <a href="/">
            <Image
              src="/logo.png"
              alt="Humia"
              width={400}
              height={400}
              className="h-12 w-auto"
              priority
            />
          </a>
        </div>
        <Card>
          <CardContent>
            {children}
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; 2026 Humia. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
