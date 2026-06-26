import LandingPage from "./components/LandingPage";
import { getSanitySiteContent } from "./lib/sanityContent";

export default async function Home() {
  const content = await getSanitySiteContent();

  return <LandingPage content={content} />;
}
