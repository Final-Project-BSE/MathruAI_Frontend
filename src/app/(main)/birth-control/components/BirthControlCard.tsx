"use client";

import { useRouter } from "next/navigation";
import { Method } from "../../../../../types/methods";
import { useLanguage } from "@/components/common/useLanguage";
import { getBirthControlMethodTranslation } from "./birthControlLang";

interface Props {
  method: Method;
}

export default function BirthControlCard({ method }: Props) {
  const router = useRouter();
  const { language } = useLanguage();

  const translatedMethod = getBirthControlMethodTranslation(
    method.id,
    language
  );

  const title = translatedMethod?.title ?? method.title;
  const description = translatedMethod?.description ?? method.description;

  return (
    <button
      type="button"
      onClick={() => router.push(`/dashboard/reproductive/birth-control/${method.id}`)}
      className="w-full overflow-hidden rounded-2xl bg-white text-left shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#d04f51] focus:ring-offset-2"
    >
      <img
        src={method.image}
        alt={title}
        className="h-48 w-full object-cover"
      />

      <div className="p-5">
        <h2 className="mb-2 text-lg font-semibold">{title}</h2>

        <p className="mb-4 text-justify text-sm text-gray-600">
          {description}
        </p>
      </div>
    </button>
  );
}