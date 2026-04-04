import React from "react";
import { MoreHorizontal, Send, Sparkles } from "lucide-react";

export default function AIAssistantCard() {
  return (
    <section className="w-[260px] rounded-[20px] border border-white/10 bg-[#0b0b0f] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-[18px] font-semibold tracking-tight">
            AI Assistant
          </span>
        </div>

        <button className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center pt-6">
        <div className="relative mb-4 h-[90px] w-[90px]">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffd7c2_0%,#ff9b6b_18%,#ef6f3d_45%,#c94d24_72%,#8a2f14_100%)] shadow-[inset_-10px_-12px_20px_rgba(0,0,0,0.28),inset_8px_8px_18px_rgba(255,255,255,0.18),0_10px_24px_rgba(239,111,61,0.22)]" />
          <div className="absolute left-[18%] top-[16%] h-[26%] w-[22%] rounded-full bg-white/35 blur-md" />
          <div className="absolute right-[16%] top-[28%] h-[38%] w-[18%] rounded-full border border-white/20 opacity-70" />
          <div className="absolute left-[20%] bottom-[16%] h-[28%] w-[56%] rounded-[999px] border border-white/10 opacity-60" />
        </div>

        <p className="text-[13px] text-white/65">Hi, Masud</p>
        <h2 className="mt-1 text-center text-[24px] font-semibold leading-[1.1] tracking-tight text-white">
          How can I help you?
        </h2>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full border border-white/8 bg-[#141419] p-1.5 pl-3">
        <input
          type="text"
          placeholder="Ask something..."
          className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/40 focus:outline-none"
        />
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2875b] text-white transition hover:scale-[1.03] hover:bg-[#ff9369]">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}