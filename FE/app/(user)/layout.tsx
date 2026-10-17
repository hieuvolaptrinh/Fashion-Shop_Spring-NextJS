import Footer from "@/core/components/feature/Footer";
import Header from "@/core/components/feature/Header";
import { ChatFloatingWidget } from "@/core/components/feature/chat";
import type { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ChatFloatingWidget />
    </>
  );
}
