"use client";

import * as React from "react";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Footer } from "@/components/site/footer";
import { DiagnoseShell } from "@/components/diagnose/diagnose-shell";
import { RepairLog } from "@/components/diagnose/repair-log";

export default function Page() {
  const [logVersion, setLogVersion] = React.useState(0);
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main" className="bg-paper-grain">
        <Hero />
        <DiagnoseShell onNewEntry={() => setLogVersion((v) => v + 1)} />
        <RepairLog refreshKey={logVersion} />
        <Footer />
      </main>
    </>
  );
}
