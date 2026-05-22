"use client";

import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/components/common/useLanguage";
import { translateText } from "@/components/common/translateText";

interface ErrorAlertProps {
  error: string | null;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  const { language } = useLanguage();
  const [translatedError, setTranslatedError] = useState<string | null>(error);

  useEffect(() => {
    let cancelled = false;

    const translateError = async () => {
      if (!error) {
        setTranslatedError(null);
        return;
      }

      if (language === "en") {
        setTranslatedError(error);
        return;
      }

      const translated = await translateText(error, language);

      if (!cancelled) {
        setTranslatedError(translated);
      }
    };

    void translateError();

    return () => {
      cancelled = true;
    };
  }, [error, language]);

  if (!translatedError) return null;

  return (
    <Alert className="mb-6 border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800 ml-2">
        {translatedError}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;