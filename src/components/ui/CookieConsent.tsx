"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cmt_cookie_consent";

type ConsentState = "accepted" | "rejected" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState;
    if (!stored) {
      // Small delay so the page settles before the banner slides in
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setConsent("rejected");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className={cn(
            "fixed bottom-4 left-1/2 z-[9999] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2",
            "rounded-2xl border border-white/10",
            "bg-[#0F2633]/95 backdrop-blur-xl backdrop-saturate-150",
            "shadow-[0_8px_40px_rgba(0,0,0,0.45)]",
            "px-6 py-5"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Cookie consent"
        >
          {/* Top row */}
          <div className="flex items-start gap-3">
            {/* Cookie icon */}
            <span className="mt-0.5 shrink-0 text-2xl" aria-hidden="true">
              🍪
            </span>

            <div className="flex-1 min-w-0">
              <p
                className="font-agenda-semibold text-white text-[17px] leading-snug mb-1"
                style={{ fontFamily: "agenda, sans-serif", fontWeight: 600 }}
              >
                We use cookies
              </p>
              <p className="text-white/65 text-[13.5px] leading-relaxed">
                We use cookies to enhance your browsing experience, serve
                personalised content, and analyse our traffic. By clicking{" "}
                <strong className="text-white/85 font-medium">
                  Accept All
                </strong>
                , you consent to our use of cookies.{" "}
                <a
                  href="/privacy-policy"
                  className="underline underline-offset-2 text-[#1E9BFB] hover:text-[#63C0FD] transition-colors duration-200"
                >
                  Learn more
                </a>
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-white/8" />

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:justify-end">
            <button
              onClick={reject}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[13.5px] font-medium",
                "border border-white/15 text-white/70",
                "hover:border-white/30 hover:text-white",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              )}
            >
              Reject Non-Essential
            </button>

            <button
              onClick={accept}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E9BFB]/60"
              )}
              style={{
                background:
                  "linear-gradient(180deg, rgba(30,155,251,0.95) 0%, rgba(15,142,214,0.95) 100%)",
                boxShadow: "0 4px 16px rgba(30,155,251,0.35)",
              }}
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
