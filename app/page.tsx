"use client";

import Image from "next/image";
import TTS from "./text-to-speech/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TTS />
    </main>
  );
}
