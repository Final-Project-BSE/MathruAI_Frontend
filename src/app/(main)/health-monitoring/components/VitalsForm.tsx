'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Loader2, Save } from 'lucide-react';
import type { VitalsState } from '../../../api/healthmonitor/types';

interface VitalsFormProps {
  vitals: VitalsState;
  onVitalChange: (field: keyof VitalsState, value: string) => void;
  onCheckboxChange: (field: keyof VitalsState) => void;
  onSubmit: () => void;
  loading: boolean;
  isUpdate: boolean;
}

const VitalsForm: React.FC<VitalsFormProps> = ({
  vitals,
  onVitalChange,
  onCheckboxChange,
  onSubmit,
  loading,
  isUpdate,
}) => {
  const [useBMICalculator, setUseBMICalculator] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const calculateBMI = (weightKg: number, heightCm: number): string => {
    if (!weightKg || !heightCm) return '';
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const handleWeightChange = (value: string) => {
    setWeight(value);
    if (value && height) {
      const calculatedBMI = calculateBMI(parseFloat(value), parseFloat(height));
      onVitalChange('BMI', calculatedBMI);
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (weight && value) {
      const calculatedBMI = calculateBMI(parseFloat(weight), parseFloat(value));
      onVitalChange('BMI', calculatedBMI);
    }
  };

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Activity className="h-5 w-5 mr-2 text-pink-500" />
          Enter Vital Signs
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="age" className="text-sm font-medium text-gray-700">
            Age (years) *
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            className="mt-1"
            value={vitals.Age}
            onChange={(e) => onVitalChange('Age', e.target.value)}
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">Blood Pressure (mmHg) *</Label>
          <div className="flex space-x-2 mt-1">
            <Input
              placeholder="120"
              type="number"
              value={vitals.SystolicBP}
              onChange={(e) => onVitalChange('SystolicBP', e.target.value)}
            />
            <span className="self-center text-gray-500">/</span>
            <Input
              placeholder="80"
              type="number"
              value={vitals.DiastolicBP}
              onChange={(e) => onVitalChange('DiastolicBP', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bs" className="text-sm font-medium text-gray-700">
            Blood Sugar (mg/dL) *
          </Label>
          <Input
            id="bs"
            type="number"
            placeholder="100"
            className="mt-1"
            value={vitals.BS}
            onChange={(e) => onVitalChange('BS', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="temp" className="text-sm font-medium text-gray-700">
            Body Temperature (°F) *
          </Label>
          <Input
            id="temp"
            type="number"
            step="0.1"
            placeholder="98.6"
            className="mt-1"
            value={vitals.BodyTemp}
            onChange={(e) => onVitalChange('BodyTemp', e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-gray-700">BMI *</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-pink-600 hover:text-pink-700 hover:bg-pink-50"
              onClick={() => setUseBMICalculator(!useBMICalculator)}
            >
              {useBMICalculator ? 'Enter BMI directly' : 'Calculate from weight/height'}
            </Button>
          </div>

          {useBMICalculator ? (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="weight" className="text-xs text-gray-600">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="60"
                    className="mt-1"
                    value={weight}
                    onChange={(e) => handleWeightChange(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="height" className="text-xs text-gray-600">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder="165"
                    className="mt-1"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-pink-50 border border-pink-200 rounded p-2">
                <p className="text-xs text-gray-600">Calculated BMI:</p>
                <p className="text-lg font-semibold text-pink-600">{vitals.BMI || '-'}</p>
              </div>
            </div>
          ) : (
            <Input
              id="bmi"
              type="number"
              step="0.1"
              placeholder="22.5"
              className="mt-1"
              value={vitals.BMI}
              onChange={(e) => onVitalChange('BMI', e.target.value)}
            />
          )}
        </div>

        <div>
          <Label htmlFor="hr" className="text-sm font-medium text-gray-700">
            Heart Rate (bpm) *
          </Label>
          <Input
            id="hr"
            type="number"
            placeholder="72"
            className="mt-1"
            value={vitals.HeartRate}
            onChange={(e) => onVitalChange('HeartRate', e.target.value)}
          />
        </div>

        <div className="space-y-3 pt-2 border-t">
          <Label className="text-sm font-medium text-gray-700">Additional Risk Factors</Label>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="prevComp"
              checked={vitals.PreviousComplications === 1}
              onChange={() => onCheckboxChange('PreviousComplications')}
              className="h-4 w-4 text-pink-600 rounded"
            />
            <Label htmlFor="prevComp" className="text-sm text-gray-600 cursor-pointer">
              Previous Complications
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="preDiab"
              checked={vitals.PreexistingDiabetes === 1}
              onChange={() => onCheckboxChange('PreexistingDiabetes')}
              className="h-4 w-4 text-pink-600 rounded"
            />
            <Label htmlFor="preDiab" className="text-sm text-gray-600 cursor-pointer">
              Preexisting Diabetes
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="gestDiab"
              checked={vitals.GestationalDiabetes === 1}
              onChange={() => onCheckboxChange('GestationalDiabetes')}
              className="h-4 w-4 text-pink-600 rounded"
            />
            <Label htmlFor="gestDiab" className="text-sm text-gray-600 cursor-pointer">
              Gestational Diabetes
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mental"
              checked={vitals.MentalHealth === 1}
              onChange={() => onCheckboxChange('MentalHealth')}
              className="h-4 w-4 text-pink-600 rounded"
            />
            <Label htmlFor="mental" className="text-sm text-gray-600 cursor-pointer">
              Mental Health Concerns
            </Label>
          </div>
        </div>

        <Button
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUpdate ? 'Updating...' : 'Analyzing & Saving...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isUpdate ? 'Update Assessment' : 'Get Risk Assessment'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VitalsForm;
