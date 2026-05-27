"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, X } from "lucide-react";
import { getSession } from "@/lib/authentication";
import { getcuruser } from "@/app/api/user/api";
import { triposhaApi } from "@/app/api/triposha/api";
import type { TriposhaRecord } from "@/app/api/triposha/types";
import TriposhaCard from "./TriposhaCard";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

type TriposhaPopupProps = {
  open: boolean;
  onClose: () => void;
};

export default function TriposhaPopup({ open, onClose }: TriposhaPopupProps) {
  const [records, setRecords] = useState<TriposhaRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { language, t } = useLanguage();
  const triposhaText = t.triposha;

  useEffect(() => {
    if (!open) return;

    let active = true;

    async function loadTriposha() {
      try {
        setLoading(true);
        setError("");

        const session = await getSession();
        const jwt = session?.user?.token || "";

        if (!jwt) {
          throw new Error(triposhaText.authRequired);
        }

        const currentUser = await getcuruser(jwt);
        const patientId = currentUser.id;

        const data = await triposhaApi.getByPatient(jwt, patientId);

        if (!active) return;

        setRecords(data);
      } catch (err) {
        console.error("Failed to load Triposha:", err);

        if (active) {
          setRecords([]);

          const fallbackMessage =
            err instanceof Error ? err.message : triposhaText.loadFailed;

          const translatedMessage = await translateText(
            fallbackMessage,
            language
          );

          if (active) {
            setError(translatedMessage);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadTriposha();

    return () => {
      active = false;
    };
  }, [open, language, triposhaText.authRequired, triposhaText.loadFailed]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              <Package className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold">{triposhaText.popupTitle}</h2>
              <p className="text-sm text-white/90">
                {triposhaText.popupDescription}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white transition hover:bg-white/20"
            aria-label={triposhaText.closePopup}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-96px)] overflow-y-auto bg-[#fed2cc] p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center py-16 text-[#d04f51]">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {triposhaText.loadingRecords}
            </div>
          ) : (
            <>
              {error ? (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <TriposhaCard records={records} readOnly />
            </>
          )}
        </div>
      </div>
    </div>
  );
}