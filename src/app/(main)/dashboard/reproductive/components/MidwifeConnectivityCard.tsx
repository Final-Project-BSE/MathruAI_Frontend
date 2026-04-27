"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, MapPin, Phone, UserRound } from "lucide-react";
import MessagesPopup from "../../../../(connection)/messages/MessagesPopup";
import {
  getAssignedMidwifeAction,
  type AssignedMidwifeResult,
} from "./actions";

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "MW";
}

export default function MidwifeConnectivityCard() {
  const [result, setResult] = useState<AssignedMidwifeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const midwife = result?.status === "SUCCESS" ? result.data : null;

  const fullName = useMemo(() => {
    if (!midwife) return "";
    return `${midwife.firstName ?? ""} ${midwife.lastName ?? ""}`.trim();
  }, [midwife]);

  useEffect(() => {
    let mounted = true;

    async function loadAssignedMidwife() {
      try {
        setLoading(true);
        const response = await getAssignedMidwifeAction();

        if (mounted) {
          setResult(response);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAssignedMidwife();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Card className="bg-white/95 backdrop-blur border-0 shadow-md rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2 text-base md:text-lg">
            <UserRound className="h-5 w-5 text-[#d04f51]" />
            Midwife Connectivity
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-10 text-[#d04f51]">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading assigned midwife...
            </div>
          )}

          {!loading && result?.status === "FAIL" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
              <p className="text-xs text-red-700">{result.message}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.reload()}
                className="text-xs"
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && result?.status === "NO_MIDWIFE" && (
            <div className="rounded-xl border border-pink-100 bg-pink-50 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 md:w-12 md:h-12">
                  <AvatarFallback className="bg-pink-100 text-[#d04f51]">
                    <UserRound className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="font-semibold text-sm text-gray-900">
                    No midwife assigned
                  </div>
                  <div className="text-xs text-gray-600">
                    Connect with a midwife to share health updates.
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                className="bg-[#d04f51] hover:bg-[#d63c3e] text-white text-xs"
              >
                Find Midwife
              </Button>
            </div>
          )}

          {!loading && midwife && (
            <div className="space-y-4">
              <div className="rounded-xl border border-pink-100 bg-pink-50 pl-4 pr-4 pb-3 pt-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 md:w-12 md:h-12">
                    <AvatarFallback className="bg-pink-100 text-[#d04f51] font-semibold">
                      {getInitials(midwife.firstName, midwife.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {fullName || "Assigned Midwife"}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {midwife.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-700">
                {midwife.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#d04f51]" />
                    <span>{midwife.phoneNumber}</span>
                  </div>
                )}

                {midwife.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#d04f51]" />
                    <span className="truncate">{midwife.email}</span>
                  </div>
                )}

                {(midwife.area || midwife.mohArea || midwife.district) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#d04f51] mt-0.5" />
                    <span>
                      {[midwife.area, midwife.mohArea, midwife.district]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {midwife.roles?.map((role: any) => (
                  <Badge
                    key={role}
                    variant="outline"
                    className="text-[10px] bg-pink-50 text-[#d04f51] border-pink-100"
                  >
                    {role.replaceAll("_", " ")}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setMessagesOpen(true)}
                  className="flex-1 bg-transparent text-xs border-pink-100 text-[#d04f51] hover:bg-pink-50"
                >
                  Ask Question
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <MessagesPopup
        open={messagesOpen}
        onClose={() => setMessagesOpen(false)}
        targetUserId={midwife?.id ?? null}
        theme="light"
      />
    </>
  );
}