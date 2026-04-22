"use client";

import { useState } from "react";
import methods from "../../../api/birth-Controler/data/methods";
import BirthControlCard from "./BirthControlCard";

export default function BirthControlPagination() {
  const [page, setPage] = useState(0);

  const itemsPerPage = 3;

  const totalPages = Math.ceil(methods.length / itemsPerPage);

  const start = page * itemsPerPage;
  const currentItems = methods.slice(start, start + itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto py-10">
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentItems.map((method) => (
          <BirthControlCard key={method.id} method={method} />
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-3">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`w-3 h-3 rounded-full transition ${
              page === i ? "bg-blue-900 w-6" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}