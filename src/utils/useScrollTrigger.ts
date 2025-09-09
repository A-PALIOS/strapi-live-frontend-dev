// hooks/useScrollTrigger.ts
import { useEffect, useState } from "react";

export function useScrollTrigger(threshold = 150) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setTriggered(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return triggered;
}
