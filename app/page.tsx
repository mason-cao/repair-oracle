"use client";

import * as React from "react";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { EarthDay } from "@/components/site/earth-day";
import { Footer } from "@/components/site/footer";
import { DiagnoseShell } from "@/components/diagnose/diagnose-shell";
import { RepairLog } from "@/components/diagnose/repair-log";

export default function Page() {
  const [logVersion, setLogVersion] = React.useState(0);
  return (
    <main className="bg-paper-grain min-h-screen">
      <Nav />
      <Hero />
      <DiagnoseShell onNewEntry={() => setLogVersion((v) => v + 1)} />
      <HowItWorks />
      <EarthDay />
      <RepairLog refreshKey={logVersion} />
      <Footer />
    </main>
  );
}
