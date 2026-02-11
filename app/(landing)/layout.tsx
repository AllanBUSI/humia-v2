import { Navbar, Footer } from "@/components/sections";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#0f172a]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
