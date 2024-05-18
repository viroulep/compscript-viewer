"use client";

import "./global.css"

import { Dispatch, SetStateAction, useState } from "react";
import type { Competition } from "@wca/helpers";
import InputWCIF from "@/components/InputWCIF";
import Teams from "@/components/Teams";
import TeamsSchedules from "@/components/TeamsSchedules";
import { WCIFContext } from "@/lib/WCIFContext";

function Nav({ setPage }: { setPage: Dispatch<SetStateAction<string>> }) {
  return (
    <div className="hide-printing">
      <a href="#" onClick={() => setPage("schedule")}>Full schedule</a>
      {' '}-{' '}
      <a href="#" onClick={() => setPage("teams")}>Teams</a>
    </div>
  );
}

function Router({ page } : { page: string }) {
  switch (page) {
  case "schedule":
    return <TeamsSchedules />;
  case "teams":
    return <Teams />;
  default:
    return '';
  }
}

export default function Home() {
  const [wcif, setWcif] = useState<Competition | undefined>(undefined);
  // I don't want to store the wcif anywhere and this is just a one shot SPA,
  // so I went for this cheap and dirty routing solution.
  const [page, setPage] = useState<string>("home");

  return (
    <main>
      {wcif ? (
        <>
          <Nav setPage={setPage} />
          <WCIFContext.Provider value={wcif}>
            <Router page={page} />
          </WCIFContext.Provider>
        </>
      ) : (
        <InputWCIF setWcif={setWcif} />
      )}
    </main>
  );
}
