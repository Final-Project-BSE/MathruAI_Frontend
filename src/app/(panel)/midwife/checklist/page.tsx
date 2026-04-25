"use client";

import { useEffect, useState } from "react";
import ChecklistItem from "./ChecklistItem";
import { getItems, addItem, deleteItem, updateItem } from "@/app/api/checklist/api";
import { ClipboardList } from "lucide-react";



export default function MidwifePage() {
  const [items, setItems] = useState<any[]>([]);
  const [popup, setPopup] = useState<string | null>(null); 

  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    category: "Mother",
    checked: false,
  });

  const load = async () => {
    const data = await getItems();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  //   const handleAdd = async () => {

  //   // 🔴 UPDATED: Validation added here
  //   if (!form.name.trim()) {
  //     alert("⚠️ Item name cannot be empty!");
  //     return;
  //   }

  //   await addItem(form);

  //   // 🟢 UPDATED: success popup
  //   alert("✅ Item added successfully!");

  //   setForm({ name: "", quantity: 1, category: "Mother", checked: false });
  //   load();
  // };

   const handleAdd = async () => {

    // 🟡 REPLACED alert
    if (!form.name.trim()) {
      setPopup("⚠️ Item name cannot be empty!");
      setTimeout(() => setPopup(null), 2000);
      return;
    }

    await addItem(form);

    // 🟢 SUCCESS POPUP
    setPopup("✅ Item added successfully!");
    setTimeout(() => setPopup(null), 2000);

    setForm({ name: "", quantity: 1, category: "Mother", checked: false });
    load();
  };

  const handleDelete = async (id: number) => {
    await deleteItem(id);
    load();
  };

  const handleToggle = async (item: any) => {
    await updateItem(item.id, { ...item, checked: !item.checked });
    load();
  };

  const mother = items.filter(i => i.category === "Mother");
  const baby = items.filter(i => i.category === "Baby");

  return (
        <div className=" p-4 md:p-6   bg-black min-h-screen text-white">

  <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#f17641] to-[#d04f51] p-5 text-white shadow-lg">
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <ClipboardList className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold md:text-2xl">Hospital Bag Checklist</h1>
            <p className="text-sm opacity-90 mt-0.5">
             Be prepared with all the essentials for your big day            </p>
          </div>
                    </div>
          </div>

{popup && (
  <div className="fixed top-5 right-5 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-600 animate-bounce">
    {popup}
  </div>
)}

    {/* FORM */}
    <div className="flex gap-2 mb-5">
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border border-gray-700 bg-gray-700 text-white p-2 flex-1 rounded"
        placeholder="Item"
      />

      <input
        type="number"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
        className="border border-gray-700 bg-gray-700 text-white p-2 w-20 rounded"
      />

      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="border border-gray-700 bg-gray-700 text-white p-2 rounded"
      >
        <option>Mother</option>
        <option>Baby</option>
      </select>

      <button
        onClick={handleAdd}
        className=" bg-[#ef8354] hover: bg-[#f0ae92] text-white px-3 rounded w-32"
      >
        Add
      </button>
    </div>

    <div className="flex gap-6">
      
      {/* Mother Card */}
      <div className="flex-1 border border-gray-700 bg-gray-900 rounded-lg p-4 shadow">
        <h2 className="font-bold mb-3 text-lg text-white">Mother</h2>

        {mother.map(item => (
          <ChecklistItem
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Baby Card */}
      <div className="flex-1 border border-gray-700 bg-gray-900 rounded-lg p-4 shadow">
        <h2 className="font-bold mb-3 text-lg text-white">Baby</h2>

        {baby.map(item => (
          <ChecklistItem
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>

    </div>
  </div>
  );
}