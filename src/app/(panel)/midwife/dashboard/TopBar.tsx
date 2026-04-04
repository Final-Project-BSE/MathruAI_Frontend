import React from "react";
import AssetCard from "./AssetCard";
import { assets } from "./data";
import AIAssistantCard from "./AIAssistantCard";

export default function TopBar() {
  return (
    <main className="min-h-screen text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 py-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {assets.map((asset, index) => (
                <AssetCard key={index} {...asset} />
              ))}
            </div>
          </section>

          <aside className="w-full">
            <AIAssistantCard />
          </aside>
        </div>
      </div>
    </main>
  );
}