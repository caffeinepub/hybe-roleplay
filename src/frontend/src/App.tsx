import { useState } from "react";
import { CinematicIntro } from "./components/CinematicIntro";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {!introComplete && (
        <CinematicIntro onComplete={() => setIntroComplete(true)} />
      )}
      <Dashboard visible={introComplete} />
    </>
  );
}
