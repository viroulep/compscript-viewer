"use client";
import type { Competition } from "@wca/helpers";
import TeamsSchedules from "@/components/TeamsSchedules";
import wcif from '@/data/post-assign.json';

const comp = wcif as Competition;

export default function Home() {

  return (
    <main>
      <TeamsSchedules competition={comp} />
    </main>
  );
}
