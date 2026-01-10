"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6 flex items-center justify-center">
      <Card className="bg-white/90 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
          <span className="text-gray-700">Loading cycle tracker...</span>
        </div>
      </Card>
    </div>
  );
}
