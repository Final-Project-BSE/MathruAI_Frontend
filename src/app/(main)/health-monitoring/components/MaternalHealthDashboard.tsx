'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, AlertTriangle, Loader2 } from 'lucide-react';

import StatsCards from './StatsCards';
import VitalsForm from './VitalsForm';
import RiskAssessmentComponent from './RiskAssessment';
import DashboardHeader from './DashboardHeader';
import ErrorAlert from './ErrorAlert';
import PatientProfileSummary from './PatientProfileSummary';

import apis, { VitalsPayload } from '../../../api/healthmonitor/api';
import type { PredictionResult, VitalsState } from '../../../api/healthmonitor/types';
import { LoadingState } from '@/components/common/LoadingState';
import TopBarFeatures from '@/components/common/TopBarFeatures';

const MaternalHealthDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPredictionId, setCurrentPredictionId] = useState<string | null>(null);

  const [vitals, setVitals] = useState<VitalsState>({
    Age: '',
    SystolicBP: '',
    DiastolicBP: '',
    BS: '',
    BodyTemp: '',
    BMI: '',
    HeartRate: '',
    PreviousComplications: 0,
    PreexistingDiabetes: 0,
    GestationalDiabetes: 0,
    MentalHealth: 0,
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        const { getSession } = await import('@/lib/authentication');
        const session = await getSession();

        if (session?.user?.token) {
          setToken(session.user.token);
          setIsAuthenticated(true);
          await loadSavedData(session.user.token);
        } else {
          setError('Please log in to access the maternal health dashboard.');
          setIsAuthenticated(false);
        }
      } catch (e) {
        setError('Authentication error. Please log in again.');
        setIsAuthenticated(false);
      } finally {
        setLoadingData(false);
      }
    };

    initialize();
  }, []);

  const loadSavedData = async (jwtToken: string) => {
    setLoadingData(true);
    try {
      const latest = await apis.getLatest(jwtToken);

      if (latest) {
        setVitals(latest.vitals);
        setCurrentPredictionId(latest.prediction_id);
        setPredictionResult(latest);
      } else {
        // no previous predictions
        setPredictionResult(null);
        setCurrentPredictionId(null);
      }

      setError(null);
    } catch (err: any) {
    } finally {
      setLoadingData(false);
    }
  };

  const handleVitalChange = (field: keyof VitalsState, value: string) => {
    setVitals((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof VitalsState) => {
    setVitals((prev) => ({ ...prev, [field]: prev[field] === 0 ? 1 : 0 }));
  };

  const toPayload = (v: VitalsState): VitalsPayload => ({
    Age: parseFloat(v.Age),
    SystolicBP: parseFloat(v.SystolicBP),
    DiastolicBP: parseFloat(v.DiastolicBP),
    BS: parseFloat(v.BS),
    BodyTemp: parseFloat(v.BodyTemp),
    BMI: parseFloat(v.BMI),
    HeartRate: parseFloat(v.HeartRate),
    PreviousComplications: v.PreviousComplications,
    PreexistingDiabetes: v.PreexistingDiabetes,
    GestationalDiabetes: v.GestationalDiabetes,
    MentalHealth: v.MentalHealth,
  });

  const handlePrediction = async () => {
    if (!token || !isAuthenticated) {
      setError('Please log in to save predictions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requiredFields: (keyof VitalsState)[] = [
        'Age',
        'SystolicBP',
        'DiastolicBP',
        'BS',
        'BodyTemp',
        'BMI',
        'HeartRate',
      ];
      const missingFields = requiredFields.filter((field) => !vitals[field]);

      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      const payload = toPayload(vitals);

      const result = currentPredictionId
        ? await apis.update(token, currentPredictionId, payload)
        : await apis.store(token, payload);

      setPredictionResult(result);
      setVitals(result.vitals);
      setCurrentPredictionId(result.prediction_id);
      setError(null);
    } catch (err: any) {
      setError(`Failed to get prediction: ${err?.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !isAuthenticated || !currentPredictionId) return;

    if (!confirm('Are you sure you want to delete this prediction?')) return;

    try {
      await apis.delete(token, currentPredictionId);

      setVitals({
        Age: '',
        SystolicBP: '',
        DiastolicBP: '',
        BS: '',
        BodyTemp: '',
        BMI: '',
        HeartRate: '',
        PreviousComplications: 0,
        PreexistingDiabetes: 0,
        GestationalDiabetes: 0,
        MentalHealth: 0,
      });
      setPredictionResult(null);
      setCurrentPredictionId(null);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete prediction');
    }
  };

  const handleRefresh = () => {
    if (token) loadSavedData(token);
  };

  if (loadingData) {
    return (
      <div>
        <LoadingState />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fed2cc] flex items-center justify-center p-8">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <Heart className="h-6 w-6 mr-2 text-pink-500" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-pink-200 bg-pink-50">
              <AlertTriangle className="h-4 w-4 text-pink-600" />
              <AlertDescription className="text-pink-800 ml-2">
                Please log in to access the Maternal Health Dashboard
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fed2cc] p-8">
      <div className="max-w-7xl mx-auto">
        <TopBarFeatures />
        <DashboardHeader
          onRefresh={handleRefresh}
          onDelete={handleDelete}
          currentPredictionId={currentPredictionId}
          loading={loading}
          loadingData={loadingData}
        />

        <ErrorAlert error={error} />

        <StatsCards vitals={vitals} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
          <div className="lg:col-span-1 h-full">
            <VitalsForm
              vitals={vitals}
              onVitalChange={handleVitalChange}
              onCheckboxChange={handleCheckboxChange}
              onSubmit={handlePrediction}
              loading={loading}
              isUpdate={!!currentPredictionId}
            />
          </div>

            <div className="lg:col-span-2 h-full">
            <RiskAssessmentComponent
              predictionResult={predictionResult}
              currentPredictionId={currentPredictionId}
            />
          </div>
        </div>

        {predictionResult?.patient_profile &&
          Object.keys(predictionResult.patient_profile).length > 0 && (
            <PatientProfileSummary patientProfile={predictionResult.patient_profile} />
          )}
      </div>
    </div>
  );
};

export default MaternalHealthDashboard;
