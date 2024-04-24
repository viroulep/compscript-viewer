"use client";
import type { Competition } from "@wca/helpers";
import InputWCIF from "@/components/InputWCIF";
import TeamsSchedules from "@/components/TeamsSchedules";
import { useState } from "react";

export default function Home() {

  const [wcif, setWcif] = useState<Competition | undefined>(undefined);

  return (
    <main>
      {wcif ? (
        <TeamsSchedules competition={wcif} />
      ) : (
        <InputWCIF setWcif={setWcif} />
      )}
    </main>
  );
}
