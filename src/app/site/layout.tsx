import { ReactNode } from "react";
import Navigation from "@/components/site/navigation/index";


export default function layout({ children }: { children: ReactNode }) {
  return (
    <main className="h-full">
      <Navigation />
      {children}
    </main>
  );
}
