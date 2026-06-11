import Hero from "./components/Hero";
import LightRing from "./components/LightRing";
import StorySections from "./components/StorySections";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-void">
      <Hero />
      <LightRing />
      <StorySections />
    </main>
  );
}
