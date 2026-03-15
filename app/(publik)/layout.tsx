import { Navbar } from "@/components/bersama/Navbar";
import { Footer } from "@/components/bersama/Footer";

export default function PublikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto pt-24 px-6 md:px-12 flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
