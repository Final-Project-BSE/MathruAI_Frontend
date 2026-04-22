"use client";

import { useEffect, useState } from "react";
import ChecklistList from "@/components/checklist/ChecklistList";
import { ChecklistItem } from "@/components/checklist/types";

export default function PregnantChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/checklist")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-4">
        Birth Preparedness Checklist
      </h1>

      <ChecklistList items={items} />
    </div>
  );
}