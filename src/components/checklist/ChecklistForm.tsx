"use client";

import { useState } from "react";

interface Props {
  onAdd: (title: string, description: string) => void;
}

export default function ChecklistForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    if (!title || !description) return;

    onAdd(title, description);
    setTitle("");
    setDescription("");
  }

  return (
    <div className="space-y-2 mb-6">
      <input
        className="p-2 w-full text-black"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="p-2 w-full text-black"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 px-4 py-2 rounded text-white"
      >
        Add Checklist
      </button>
    </div>
  );
}