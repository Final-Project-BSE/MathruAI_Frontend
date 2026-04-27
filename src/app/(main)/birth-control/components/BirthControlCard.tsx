"use client";

import { useRouter } from "next/navigation";
import { Method } from "../../../../../types/methods";



interface Props {
  method: Method;
}

export default function BirthControlCard({ method }: Props) {
  const router = useRouter();

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition"
    >
      <img
        src={method.image}
        alt={method.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-5">
        <h2 className="text-lg font-semibold mb-2">{method.title}</h2>

        <p className="text-gray-600 text-sm mb-4 text-justify ">
          {method.description}
        </p>

     
      </div>
    </div>
  );
}