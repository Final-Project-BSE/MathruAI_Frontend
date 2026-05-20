"use client";

import { useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Database,
  FileUp,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";
import adminApi from "@/app/api/admin/api";
import type { UploadTarget } from "@/app/api/admin/types";

type Props = {
  token: string;
};

type UploadState = {
  loading: boolean;
  message: string;
  error: string;
};

const initialUploadState: UploadState = {
  loading: false,
  message: "",
  error: "",
};

function resultText(data: unknown) {
  if (!data) return "Upload completed.";

  if (typeof data === "string") return data;

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    return (
      String(obj.message || obj.status || obj.filename || "Upload completed.")
    );
  }

  return "Upload completed.";
}

export default function AdminKnowledgeBasePage({ token }: Props) {
  const chatbotInputRef = useRef<HTMLInputElement | null>(null);
  const dailyInputRef = useRef<HTMLInputElement | null>(null);

  const [chatbotFile, setChatbotFile] = useState<File | null>(null);
  const [dailyFile, setDailyFile] = useState<File | null>(null);

  const [chatbotState, setChatbotState] = useState<UploadState>(initialUploadState);
  const [dailyState, setDailyState] = useState<UploadState>(initialUploadState);

  async function upload(target: UploadTarget) {
    const isChatbot = target === "chatbot";
    const file = isChatbot ? chatbotFile : dailyFile;
    const setState = isChatbot ? setChatbotState : setDailyState;

    if (!file) {
      setState({
        loading: false,
        message: "",
        error: "Choose a PDF file first.",
      });
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setState({
        loading: false,
        message: "",
        error: "Only PDF files are allowed.",
      });
      return;
    }

    try {
      setState({ loading: true, message: "", error: "" });

      const data = isChatbot
        ? await adminApi.uploadChatbotKnowledgeBase(token, file)
        : await adminApi.uploadDailyRecommendationKnowledgeBase(token, file);

      setState({
        loading: false,
        message: resultText(data),
        error: "",
      });

      if (isChatbot) {
        setChatbotFile(null);
        if (chatbotInputRef.current) chatbotInputRef.current.value = "";
      } else {
        setDailyFile(null);
        if (dailyInputRef.current) dailyInputRef.current.value = "";
      }
    } catch (err) {
      setState({
        loading: false,
        message: "",
        error: err instanceof Error ? err.message : "Upload failed.",
      });
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <section className="mb-6 rounded-3xl bg-[#d04f51] p-6 text-white shadow-xl">
        <p className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
          Admin / Knowledge Base
        </p>
        <h1 className="text-2xl font-black md:text-4xl">
          Upload approved PDF knowledge.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85">
          Upload separate PDFs for the chatbot RAG system and the daily recommendation
          RAG system. Do not mix unfinished, duplicated, or unsafe content here.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <UploadCard
          title="Chatbot Knowledge Base"
          description="Used by your chatbot answer retrieval system."
          icon={<Bot className="h-6 w-6" />}
          file={chatbotFile}
          state={chatbotState}
          inputRef={chatbotInputRef}
          onFileChange={setChatbotFile}
          onUpload={() => upload("chatbot")}
          endpointLabel="/upload"
        />

        <UploadCard
          title="Daily Recommendation Knowledge Base"
          description="Used by the pregnancy daily recommendation engine."
          icon={<Sparkles className="h-6 w-6" />}
          file={dailyFile}
          state={dailyState}
          inputRef={dailyInputRef}
          onFileChange={setDailyFile}
          onUpload={() => upload("daily-recommendation")}
          endpointLabel="/upload-pdf"
        />
      </div>

      <section className="mt-6 rounded-3xl border border-[#d04f51]/10 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff2f2] text-[#d04f51]">
            <Database size={20} />
          </div>

          <div>
            <h2 className="text-sm font-black text-zinc-950">Hard warning</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Knowledge-base upload is a high-trust admin action. Your backend should
              reject non-admin tokens on these upload routes. The UI checks admin access,
              but that is not enough. Real authorization must happen in the Flask/Spring
              services too.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function UploadCard({
  title,
  description,
  icon,
  file,
  state,
  inputRef,
  endpointLabel,
  onFileChange,
  onUpload,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  file: File | null;
  state: UploadState;
  inputRef: React.RefObject<HTMLInputElement | null>;
  endpointLabel: string;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
}) {
  return (
    <section className="rounded-3xl border border-[#d04f51]/10 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff2f2] text-[#d04f51]">
            {icon}
          </div>

          <div>
            <h2 className="text-lg font-black text-zinc-950">{title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
          </div>
        </div>

        <span className="rounded-full bg-[#fff2f2] px-3 py-1 text-[10px] font-black text-[#d04f51]">
          {endpointLabel}
        </span>
      </div>

      <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#d04f51]/25 bg-[#fffafa] p-6 text-center transition hover:bg-[#fff2f2]">
        <FileUp className="mb-3 h-10 w-10 text-[#d04f51]" />
        <p className="text-sm font-black text-zinc-950">
          {file ? file.name : "Drop or choose a PDF"}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          PDF only. Keep each upload focused and versioned.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
      </label>

      {file ? (
        <div className="mt-3 rounded-2xl bg-zinc-50 px-4 py-3 text-xs text-zinc-600">
          <strong>Selected:</strong> {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
        </div>
      ) : null}

      {state.error ? (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      {state.message ? (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {state.message}
        </div>
      ) : null}

      <button
        type="button"
        disabled={state.loading || !file}
        onClick={onUpload}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d04f51] px-5 py-3 text-sm font-black text-white transition hover:bg-[#bf4446] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {state.loading ? "Uploading..." : "Upload PDF"}
      </button>
    </section>
  );
}
