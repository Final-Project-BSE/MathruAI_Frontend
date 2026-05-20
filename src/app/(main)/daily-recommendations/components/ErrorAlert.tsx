import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  error: string | null;
  onDismiss?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <Alert className="mb-6 border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="ml-2 flex items-center justify-between text-red-800">
        <span>{error}</span>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-xl text-red-400 hover:text-red-600"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
