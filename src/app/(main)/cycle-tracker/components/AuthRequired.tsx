"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, AlertTriangle } from "lucide-react";

type Props = {
  message: string;
  title: string;
  defaultMessage: string;
};

export function AuthRequired({ message, title, defaultMessage }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6 flex items-center justify-center">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center">
            <Calendar className="h-6 w-6 mr-2 text-pink-500" />
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Alert className="border-pink-200 bg-pink-50">
            <AlertTriangle className="h-4 w-4 text-pink-600" />
            <AlertDescription className="text-pink-800 ml-2">
              {message || defaultMessage}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}