import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import HowItWorks from "@/components/sections/HowItWorks";
import Proof from "@/components/sections/Proof";
import KBCounter from "@/components/sections/KBCounter";
import Pricing from "@/components/sections/Pricing";
import EarlyAccess from "@/components/sections/EarlyAccess";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Proof />
      <KBCounter />
      <Pricing />
      <EarlyAccess />
    </>
  );
}
