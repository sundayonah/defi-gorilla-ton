"use client"
import Header from "@/components/header";
import Main from "@/components/main";
import SampleComponent from "@/components/sample";
import { TonConnectButton } from "@tonconnect/ui-react";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Header />
      <Main />
      {/* <SampleComponent /> */}
    </div>
  );
}
