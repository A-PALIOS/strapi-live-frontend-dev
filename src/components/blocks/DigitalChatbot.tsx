"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bot, Send, User, Sparkles, X } from "lucide-react";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
};

function getBotReply(input: string) {
  const text = input.toLowerCase().trim();

  if (
    text.includes("service") ||
    text.includes("solutions") ||
    text.includes("what do you do")
  ) {
    return "Our Digital Solutions team helps businesses with digital transformation, automation, data-driven workflows, and modern technology strategy.";
  }

  if (
    text.includes("automation") ||
    text.includes("process") ||
    text.includes("workflow")
  ) {
    return "Yes — we can help with process automation, workflow optimization, and reducing repetitive manual work through digital tools.";
  }

  if (text.includes("ai") || text.includes("artificial intelligence")) {
    return "Yes — we explore AI-powered solutions where they create real business value, such as smarter workflows, faster decisions, and improved customer experiences.";
  }

  if (
    text.includes("book") ||
    text.includes("meeting") ||
    text.includes("call") ||
    text.includes("contact")
  ) {
    return "You can get in touch with our team through the contact page to book a call and discuss your digital needs.";
  }

  if (
    text.includes("digital transformation") ||
    text.includes("transformation")
  ) {
    return "Digital transformation means improving the way a business operates by using technology, automation, better data, and more efficient digital processes.";
  }

  if (
    text.includes("data") ||
    text.includes("analytics") ||
    text.includes("reporting")
  ) {
    return "We also support data-oriented initiatives, including better reporting, visibility, and decision-making through more structured digital systems.";
  }

  return "I can help with questions about our Digital Solutions services, automation, AI, data, and how to contact the team.";
}

export default function DigitalChatbot({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
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

  const handleSend = () => {
    const value = input.trim();
    if (!value) return;

    const now = Date.now();

    const userMessage: Message = {
      id: `${now}-user`,
      role: "user",
      text: value,
    };

    const botMessage: Message = {
      id: `${now + 1}-bot`,
      role: "bot",
      text: getBotReply(value),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div
      className={[
        "absolute right-[8%] top-1/2 z-30 w-[340px] max-w-[calc(100vw-2rem)] -translate-y-1/2",
        "transition-all duration-500 ease-out",
        isOpen
          ? "translate-x-0 opacity-100 pointer-events-auto"
          : "translate-x-8 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div
        className="
          overflow-hidden rounded-3xl border border-white/15
          bg-[#07111F]/85 backdrop-blur-xl
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#1E9BFB]/25 bg-[#1E9BFB]/20">
            <Bot className="h-5 w-5 text-[#6EC1FF]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">
                Digital Assistant
              </p>
              <Sparkles className="h-4 w-4 text-[#FF8A00]" />
            </div>
            <p className="text-xs text-white/60">
              Ask about our digital services
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close chatbot"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[360px] space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-[#1E9BFB] text-white"
                    : "border border-white/10 bg-white/8 text-white"
                }`}
              >
                <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/55">
                  {message.role === "user" ? (
                    <>
                      <User className="h-3.5 w-3.5" />
                      You
                    </>
                  ) : (
                    <>
                      <Bot className="h-3.5 w-3.5" />
                      Bot
                    </>
                  )}
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask about services, AI, automation..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/8 px-4 text-sm text-white placeholder:text-white/35 outline-none"
            />
            <button
              type="button"
              onClick={handleSend}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#FF8A00] text-white transition hover:scale-[1.03]"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setInput("What services do you offer?")}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => setInput("Do you do automation?")}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
            >
              Automation
            </button>
            <button
              type="button"
              onClick={() => setInput("Do you work with AI?")}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10"
            >
              AI
            </button>
          </div>

          <Link
            href="/contact-us"
            className="mt-4 inline-flex text-xs text-[#6EC1FF] hover:text-white"
          >
            Contact the team →
          </Link>
        </div>
      </div>
    </div>
  );
}