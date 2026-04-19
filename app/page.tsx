"use client";

import * as React from "react";
import { Masthead } from "@/components/site/masthead";
import { Hero } from "@/components/site/hero";
import { Dispatch } from "@/components/site/dispatch";
import { Footer } from "@/components/site/footer";
import { DiagnoseShell } from "@/components/diagnose/diagnose-shell";
import { RepairLog } from "@/components/diagnose/repair-log";

export default function Page() {
  const [logVersion, setLogVersion] = React.useState(0);
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Masthead />
      <main id="main" className="bg-eco-grid">
        <Hero refreshKey={logVersion} />
        <DiagnoseShell onNewEntry={() => setLogVersion((v) => v + 1)} />
        <Dispatch />
        <RepairLog refreshKey={logVersion} />
        <Footer />
      </main>
    </>
  );
}
