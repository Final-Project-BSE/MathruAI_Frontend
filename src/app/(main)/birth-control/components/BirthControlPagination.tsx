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
    <div className="mx-auto max-w-5xl py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {currentItems.map((method) => (
          <BirthControlCard key={method.id} method={method} />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="mt-6 flex justify-center gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-3 rounded-full transition ${
                page === i ? "w-6 bg-blue-900" : "w-3 bg-gray-400"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}