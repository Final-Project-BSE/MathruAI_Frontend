import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/common/useLanguage";

interface SettingsModalProps {
  currentWeek: number;
  currentPreferences: string;
  onSave: (week: number, preferences: string) => void;
  onClose: () => void;
  loading: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  currentWeek,
  currentPreferences,
  onSave,
  onClose,
  loading,
}) => {
  const { t } = useLanguage();
  const labels = t.dailyRecommendation;

  const [pregnancyWeek, setPregnancyWeek] = useState(currentWeek);
  const [preferences, setPreferences] = useState(currentPreferences);
  const [errors, setErrors] = useState<{ week?: string }>({});

  const validate = (): boolean => {
    const newErrors: { week?: string } = {};
    if (pregnancyWeek < 1 || pregnancyWeek > 42) {
      newErrors.week = labels.weekValidation;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(pregnancyWeek, preferences);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-lg w-full shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-purple-500" />
              {labels.updateSettings}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="week" className="text-sm font-medium text-gray-700">
              {labels.pregnancyWeek}
            </Label>
            <Input
              id="week"
              type="number"
              min="1"
              max="42"
              value={pregnancyWeek}
              onChange={(e) => setPregnancyWeek(parseInt(e.target.value) || 1)}
              className={`mt-1 ${errors.week ? "border-red-500" : ""}`}
            />
            {errors.week && (
              <p className="text-red-500 text-sm mt-1">{errors.week}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="preferences"
              className="text-sm font-medium text-gray-700"
            >
              {labels.preferencesInterests}
            </Label>
            <Textarea
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder={labels.preferencesPlaceholder}
              className="mt-1"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              {labels.preferencesHelp}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              {labels.cancel}
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {labels.saving}
                </>
              ) : (
                labels.saveRegenerate
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsModal;