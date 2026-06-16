"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import methods from "../../../api/birth-Controler/data/methods";
import { Method } from "../../../../../types/methods";
import { useLanguage } from "@/components/common/useLanguage";
import { getBirthControlMethodTranslation } from "../components/birthControlLang";

export default function DetailsPage() {
  const params = useParams<{ id: string }>();
  const { language, t } = useLanguage();

  const method: Method | undefined = methods.find(
    (item) => item.id === params.id
  );

  if (!method) {
    return (
      <div className="p-10 text-center text-lg font-medium">
        {t.birthControl.notFound}
      </div>
    );
  }

  const translatedMethod = getBirthControlMethodTranslation(
    method.id,
    language
  );

  const title = translatedMethod?.title ?? method.title;
  const description = translatedMethod?.description ?? method.description;

  return (
    <div className="min-h-screen bg-[#fed2cc] p-4 md:p-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-5 shadow-lg md:p-8">
        <div className="relative mx-auto h-72 w-full max-w-xl overflow-hidden rounded-xl md:h-96">
          <Image
            src={method.image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
            priority
          />
        </div>

        <h1 className="mt-5 text-center text-3xl font-bold">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}