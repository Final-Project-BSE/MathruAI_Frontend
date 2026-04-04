import React from "react";
import { MoreHorizontal, Send, Sparkles } from "lucide-react";
import "./ai-assistant-card.css";

export default function AIAssistantCard() {
  return (
    <section className="w-full rounded-[20px] border border-white/10 bg-[#0b0b0f] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.42)] sm:rounded-[24px] sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-[16px] font-semibold tracking-tight sm:text-[18px]">
            AI Assistant
          </span>
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center pt-5 sm:pt-6">
        <div className="orb-scene mb-4 scale-90 sm:scale-100">
          <div className="orb-glow" />
          <div className="orb-aura" />
          <div className="orb-ring orb-ring-1" />
          <div className="orb-ring orb-ring-2" />
          <div className="orb-ring orb-ring-3" />

          <div className="orb-wrapper">
            <div className="orb-core" />
            <div className="orb-highlight" />
          </div>

          <div className="orb-particle orb-particle-1" />
          <div className="orb-particle orb-particle-2" />
          <div className="orb-particle orb-particle-3" />
        </div>

        <div className="assistant-status mb-4">
          <span className="status-dot" />
          <span className="thinking-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </div>

        <p className="text-[12px] text-white/60 sm:text-[13px]">Hi, Masud</p>
        <h2 className="mt-1 text-center text-[22px] font-semibold leading-[1.08] tracking-tight text-white sm:text-[25px]">
          How can I help you?
        </h2>
        <p className="mt-2 text-center text-[11px] text-white/45 sm:text-[12px]">
          Ask anything. I’m ready.
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-full border border-white/8 bg-[#141419] p-1.5 pl-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <input
          type="text"
          placeholder="Ask something..."
          className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-white/40 focus:outline-none"
        />
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2875b] text-white transition duration-200 hover:scale-[1.05] hover:bg-[#ff9369] active:scale-[0.98]">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}