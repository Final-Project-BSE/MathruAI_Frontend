"use client";

import { useEffect, useState } from "react";
import ChecklistForm from "@/components/checklist/ChecklistForm";
import ChecklistList from "@/components/checklist/ChecklistList";
import { ChecklistItem } from "@/components/checklist/types";

export default function MidwifeChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);

  async function fetchData() {
    const res = await fetch("http://localhost:8080/api/checklist");
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function addItem(title: string, description: string) {
    await fetch("http://localhost:8080/api/checklist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    fetchData();
  }

  async function deleteItem(id: number) {
    await fetch(`http://localhost:8080/api/checklist/${id}`, {
      method: "DELETE",
    });

    fetchData();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white mb-4">
        Midwife Checklist Management
      </h1>

      <ChecklistForm onAdd={addItem} />

      <ChecklistList items={items} onDelete={deleteItem} />
    </div>
  );
}