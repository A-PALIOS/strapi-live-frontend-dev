"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import OpenAI from "openai";
import { Bot, Send, User, Sparkles, X } from "lucide-react";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
};

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function DigitalChatbot({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const initialMessages = useMemo<Message[]>(
    () => [
      {
        id: "welcome",
        role: "bot",
        text: "Hi — I’m your Digital Assistant. Ask me about our services, automation, AI, data, or how to get in touch.",
      },
    ],
    []
  );

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false); 
  useEffect(() => { 
    const checkScreen = () => { 
        setIsSmallScreen(window.innerWidth < 1400); 
        }; 
        
        checkScreen(); 
        window.addEventListener("resize", checkScreen); 
        return () => window.removeEventListener("resize", checkScreen); }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (!isMounted) return;

    const originalOverflow = document.body.style.overflow;

    const isMobile = window.innerWidth < 640;
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isMounted]);

  const handleSend = async () => {
    const value = input.trim();
    if (!value || isLoading) return;

    const now = Date.now();

    const userMessage: Message = {
      id: `${now}-user`,
      role: "user",
      text: value,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const conversationText = nextMessages
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
        .join("\n");

      const response = await openai.responses.create({
        model: "gpt-5.4",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "You are a website assistant for a Digital Solutions team. " +
                  "Answer clearly, briefly, and professionally. " +
                  "Focus only on services, automation, AI, data, digital transformation, and contact options. " +
                  "Do not invent company-specific facts. " +
                  "If the user asks something company-specific that is not provided, say that they should contact the team through the contact page.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: conversationText,
              },
            ],
          },
        ],
      });

      const botMessage: Message = {
        id: `${Date.now()}-bot`,
        role: "bot",
        text:
          response.output_text ||
          "Sorry — I could not generate a response right now.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("OpenAI error:", error);

      const errorMessage: Message = {
        id: `${Date.now()}-bot-error`,
        role: "bot",
        text: "Sorry — something went wrong while contacting the assistant.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && isSmallScreen && (
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open chatbot"
          className="
            fixed bottom-4 right-4 z-40
            grid h-14 w-14 place-items-center rounded-full
            border border-white/15 bg-[#FF8A00] text-white
            shadow-[0_20px_60px_rgba(0,0,0,0.35)]
            transition hover:scale-105
            sm:bottom-6 sm:right-6 sm:h-16 sm:w-16
          "
        >
          <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
      )}

      <div
        className={[
          "fixed z-50 transition-all duration-300 ease-out",
          "sm:bottom-6 sm:right-6",
          "w-full sm:w-[min(92vw,440px)] lg:w-[420px] xl:w-[440px]",
          "h-[100dvh] sm:h-[min(78vh,720px)]",
          isOpen
            ? "pointer-events-auto opacity-100 translate-y-0 sm:translate-x-0"
            : "pointer-events-none opacity-0 translate-y-4 sm:translate-y-0 sm:translate-x-8",
          "inset-0 sm:inset-auto",
        ].join(" ")}
      >
        <div
          className="
            flex h-full min-h-0 flex-col overflow-hidden
            rounded-none sm:rounded-3xl
            border-0 sm:border sm:border-white/15
            bg-[#07111F]/95 sm:bg-[#07111F]/90
            backdrop-blur-xl
            shadow-none sm:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
          "
        >
          <div
            className="
              flex shrink-0 items-center gap-3
              border-b border-white/10
              px-4 py-4
              sm:px-5
              pt-[max(1rem,env(safe-area-inset-top))]
            "
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#1E9BFB]/25 bg-[#1E9BFB]/20 sm:h-11 sm:w-11">
              <Bot className="h-5 w-5 text-[#6EC1FF]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-white sm:text-[15px]">
                  Digital Assistant
                </p>
                <Sparkles className="h-4 w-4 shrink-0 text-[#FF8A00]" />
              </div>
              <p className="truncate text-xs text-white/60 sm:text-[13px]">
                Ask about our digital services
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div
            className="
              flex-1 min-h-0 overflow-y-auto
              px-3 py-4
              sm:px-4
            "
          >
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`w-fit max-w-[92%] rounded-2xl px-3.5 py-3 text-[13px] leading-5 sm:max-w-[85%] sm:px-4 sm:text-sm sm:leading-6 ${
                      message.role === "user"
                        ? "bg-[#1E9BFB] text-white"
                        : "border border-white/10 bg-white/10 text-white"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/55 sm:text-[11px]">
                      {message.role === "user" ? (
                        <>
                          <User className="h-3.5 w-3.5 shrink-0" />
                          You
                        </>
                      ) : (
                        <>
                          <Bot className="h-3.5 w-3.5 shrink-0" />
                          Bot
                        </>
                      )}
                    </div>
                    <p className="break-words whitespace-pre-wrap">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-fit max-w-[92%] rounded-2xl border border-white/10 bg-white/10 px-3.5 py-3 text-[13px] leading-5 text-white sm:max-w-[85%] sm:px-4 sm:text-sm sm:leading-6">
                    <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/55 sm:text-[11px]">
                      <Bot className="h-3.5 w-3.5 shrink-0" />
                      Bot
                    </div>
                    <p>Typing...</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div
            className="
              shrink-0 border-t border-white/10
              p-3 sm:p-4
              pb-[max(0.75rem,env(safe-area-inset-bottom))]
            "
          >
            <div className="flex items-end gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Ask about services, AI, automation..."
                className="
                  h-11 w-full min-w-0
                  rounded-2xl border border-white/10 bg-white/10
                  px-4 text-sm text-white
                  placeholder:text-white/35
                  outline-none
                  sm:h-12
                "
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isLoading}
                className="
                  grid h-11 w-11 shrink-0 place-items-center rounded-2xl
                  bg-[#FF8A00] text-white transition
                  hover:scale-[1.03] disabled:opacity-60
                  sm:h-12 sm:w-12
                "
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setInput("What services do you offer?")}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/75 transition hover:bg-white/10 sm:text-xs"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => setInput("Do you do automation?")}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/75 transition hover:bg-white/10 sm:text-xs"
              >
                Automation
              </button>
              <button
                type="button"
                onClick={() => setInput("Do you work with AI?")}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/75 transition hover:bg-white/10 sm:text-xs"
              >
                AI
              </button>
            </div>

            <Link
              href="/contact-us"
              className="mt-4 inline-flex text-xs text-[#6EC1FF] transition hover:text-white"
            >
              Contact the team →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}