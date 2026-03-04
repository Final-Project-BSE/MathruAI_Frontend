"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6 flex items-center justify-center">
      <Card className="bg-white/90 backdrop-blur-sm p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />

            <div className="absolute inset-2 rounded-full overflow-hidden bg-white shadow-sm">
              <Image
                src="/images/logo.jpeg"
                alt="Loading"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <span className="text-gray-700">Getting things ready...</span>
        </div>
      </Card>
    </div>
  );
}
