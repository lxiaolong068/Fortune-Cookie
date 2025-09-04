import { FortuneCookie } from "./components/FortuneCookie";
import { DynamicBackgroundEffects } from "./components/DynamicBackgroundEffects";

export default function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      <DynamicBackgroundEffects />
      <div className="relative z-10">
        <FortuneCookie />
      </div>
    </div>
  );
}