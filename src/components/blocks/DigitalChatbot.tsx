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
        text: "Hi — I’m the Digital Assistant of CMT Prooptiki. Ask me about our consulting services in the health sector, our team, our projects, or how to get in touch.",
      },
    ],
    []
  );

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 1400);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

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

  useEffect(() => {
    if (!isMounted) return;

    const isMobile = window.innerWidth < 640;
    if (!isMobile) return;

    const header = document.querySelector("header") as HTMLElement | null;
    if (!header) return;

    const previousDisplay = header.style.display;

    if (isOpen) {
      header.style.display = "none";
    } else {
      header.style.display = previousDisplay || "";
    }

    return () => {
      header.style.display = previousDisplay || "";
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
                  "You are the official Digital Assistant of CMT Prooptiki. " +
                  "CMT Prooptiki is a consulting company specializing in the Health Sector. " +
                  "Its core expertise includes healthcare consulting, health sector projects, medical services advisory, and related areas — as described on the Services and About Us pages of the website. " +
                  "CMT Prooptiki also has an IT department that offers additional services such as automation, AI solutions, and web development, but these are secondary offerings and not the company's main identity. " +
                  "Your only purpose is to answer questions about CMT Prooptiki — its consulting services, health sector expertise, team, projects, insights, events, and how to get in contact. " +
                  "The primary source of your answers is the CMT Prooptiki website, especially the Services and About Us sections. " +
                  "Rules you must strictly follow:\n" +
                  "1. Only respond to questions directly related to CMT Prooptiki — its identity, services, health sector work, team, insights, or events.\n" +
                  "2. If the user asks anything unrelated to CMT Prooptiki — such as general knowledge, cooking, sports, politics, other companies, medical advice, or any off-topic subject — politely decline and redirect them. Example: 'I'm here specifically to help you learn about CMT Prooptiki. For other topics I'm not able to assist — but feel free to ask me anything about our company and services!'\n" +
                  "3. Never invent or assume company-specific facts not grounded in the website. If you don't know a specific detail, say so honestly and invite the user to contact the team via the Contact page.\n" +
                  "4. Keep answers concise, professional, and friendly.\n" +
                  "5. Always respond in the same language the user writes in (Greek or English).",
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
          "fixed z-[100] transition-all duration-300 ease-out",
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
              relative flex shrink-0 items-center gap-3
              border-b border-white/10
              px-4 py-4
              sm:px-5
              pt-[max(1rem,env(safe-area-inset-top))]
            "
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#1E9BFB]/25 bg-[#1E9BFB]/20 sm:h-11 sm:w-11">
              <Bot className="h-5 w-5 text-[#6EC1FF]" />
            </div>

            <div className="min-w-0 pr-12 sm:pr-0">
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
              className="
                fixed right-4 top-[max(1rem,env(safe-area-inset-top))]
                z-[110]
                grid h-10 w-10 place-items-center
                rounded-xl border border-white/10
                bg-[#07111F]/95 text-white
                shadow-lg transition hover:bg-white/10
                sm:static sm:ml-auto sm:h-9 sm:w-9 sm:bg-white/5 sm:text-white/70 sm:shadow-none
              "
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
                placeholder="Ask about CMT Prooptiki..."
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
                onClick={() => setInput("What consulting services does CMT Prooptiki offer?")}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/75 transition hover:bg-white/10 sm:text-xs"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => setInput("What is CMT Prooptiki's expertise in the health sector?")}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/75 transition hover:bg-white/10 sm:text-xs"
              >
                Health Sector
              </button>
              <button
                type="button"
                onClick={() => setInput("Who is CMT Prooptiki?")}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/75 transition hover:bg-white/10 sm:text-xs"
              >
                About us
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