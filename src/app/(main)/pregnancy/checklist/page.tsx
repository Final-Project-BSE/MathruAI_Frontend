"use client";

import { useEffect, useState } from "react";
import { getItems, updateItem } from "../../../api/checklist/api";
import ChecklistItem from "./ChecklistItem";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import { ClipboardList } from "lucide-react";

;

export default function MotherPage() {
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const data = await getItems();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (item: any) => {
    await updateItem(item.id, {
      ...item,
      checked: !item.checked,
    });
    load();
  };

  const motherItems = items.filter(
    (i) => i.category?.trim().toLowerCase() === "mother"
  );

  const babyItems = items.filter(
    (i) => i.category?.trim().toLowerCase() === "baby"
  );

  const completed = items.filter((i) => i.checked).length;


    
  return (
    <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
          <TopBarFeatures/>
  
      

          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-5 text-white shadow-lg">
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <ClipboardList className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold md:text-2xl">My Hospital Bag Checklist</h1>
            <p className="text-sm opacity-90 mt-0.5">
             Be prepared with all the essentials for your big day            </p>
          </div>
          
        </div>
      </div>
        <div className="bg-gray-100 min-h-screen rounded-lg p-5">

    <div className="max-w-3xl mx-auto p-6">
      

      <p className="mb-4 text-green-600 font-medium">
        {completed} / {items.length} items packed
      </p>

<div className="flex flex-col md:flex-row gap-6">

  {/* 👩 Mother Card */}
  <div className="flex-1 bg-white border rounded-xl p-5 shadow-sm">
    <h2 className="font-semibold mb-4 text-lg text-gray-800">
      Mother Items
    </h2>

    <div className="space-y-3">
      {motherItems.map((item) => (
        <ChecklistItem
          key={item.id}
          item={item}
          onToggle={handleToggle}
        />
      ))}
    </div>
  </div>

  {/* 👶 Baby Card */}
  <div className="flex-1 bg-white border rounded-xl p-5 shadow-sm">
    <h2 className="font-semibold mb-4 text-lg text-gray-800">
      Baby Items
    </h2>

    <div className="space-y-3">
      {babyItems.map((item) => (
        <ChecklistItem
          key={item.id}
          item={item}
          onToggle={handleToggle}
        />
      ))}
    </div>
  </div>

</div>
    
    
    </div>
        </div>

                </div>




  );
}