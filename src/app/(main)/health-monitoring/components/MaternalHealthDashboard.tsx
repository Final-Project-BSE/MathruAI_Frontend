'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, AlertTriangle, Loader2 } from 'lucide-react';

// Import components
import StatsCards from './StatsCards';
import VitalsForm from './VitalsForm';
import RiskAssessmentComponent from './RiskAssessment';
import DashboardHeader from './DashboardHeader';
import ErrorAlert from './ErrorAlert';
import PatientProfileSummary from './PatientProfileSummary';

// Type definitions
interface VitalsState {
  Age: string;
  SystolicBP: string;
  DiastolicBP: string;
  BS: string;
  BodyTemp: string;
  BMI: string;
  HeartRate: string;
  PreviousComplications: number;
  PreexistingDiabetes: number;
  GestationalDiabetes: number;
  MentalHealth: number;
}

interface RiskAssessment {
  risk_level: string;
  confidence: number;
  all_risk_probabilities: Record<string, number>;
}

interface HealthGuidance {
  primary_advice: string;
  advice_confidence: number;
  alternative_recommendations: string[];
}

interface PredictionResult {
  prediction_id: string;
  user_id: string;
  vitals: VitalsState;
  risk_assessment: RiskAssessment;
  health_guidance: HealthGuidance;
  patient_profile: Record<string, any>;
}

const MaternalHealthDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPredictionId, setCurrentPredictionId] = useState<string | null>(null);

  // Form state for vital signs
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
    MentalHealth: 0
  });

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Initialize - Get JWT token from session
  useEffect(() => {
    const initialize = async () => {
      try {
        const { getSession } = await import('@/lib/authentication');
        const session = await getSession();

        if (session?.user?.token) {
          setToken(session.user.token);
          setIsAuthenticated(true);
          console.log("✅ JWT token loaded for Maternal Health Dashboard");
          loadSavedData(session.user.token);
        } else {
          console.warn("⚠️ No session found — please log in first.");
          setError("Please log in to access the maternal health dashboard.");
          setIsAuthenticated(false);
          setLoadingData(false);
        }
      } catch (error) {
        console.error("Failed to get session:", error);
        setError("Authentication error. Please log in again.");
        setIsAuthenticated(false);
        setLoadingData(false);
      }
    };

    initialize();
  }, []);

  const loadSavedData = async (jwtToken: string) => {
    setLoadingData(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict/latest`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        console.log('Loaded data:', data.data);

        if (data.data.vitals) {
          setVitals(data.data.vitals);
        }

        const predId = data.data.prediction_id || data.data.id;
        setCurrentPredictionId(predId);
        console.log('Current prediction ID:', predId);

        const transformedData: PredictionResult = {
          prediction_id: predId,
          user_id: data.data.user_id,
          vitals: data.data.vitals,
          risk_assessment: {
            risk_level: data.data.prediction?.risk_level,
            confidence: data.data.prediction?.risk_confidence,
            all_risk_probabilities: data.data.prediction?.risk_probabilities || {}
          },
          health_guidance: {
            primary_advice: data.data.prediction?.health_advice,
            advice_confidence: data.data.prediction?.advice_confidence,
            alternative_recommendations: data.data.prediction?.alternative_advice || []
          },
          patient_profile: data.data.prediction?.patient_profile || {}
        };

        console.log('Transformed data:', transformedData);
        setPredictionResult(transformedData);
        setError(null);
      } else if (response.status === 404) {
        console.log('No previous predictions found');
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to load data');
      }
    } catch (err) {
      console.log('No saved data found or error loading:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (!errorMessage.includes('No predictions')) {
        // setError(`Failed to load previous data: ${errorMessage}`);
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleVitalChange = (field: keyof VitalsState, value: string) => {
    setVitals(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof VitalsState) => {
    setVitals(prev => ({
      ...prev,
      [field]: prev[field] === 0 ? 1 : 0
    }));
  };

  const handlePrediction = async () => {
    if (!token || !isAuthenticated) {
      setError("Please log in to save predictions");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requiredFields: (keyof VitalsState)[] = ['Age', 'SystolicBP', 'DiastolicBP', 'BS', 'BodyTemp', 'BMI', 'HeartRate'];
      const missingFields = requiredFields.filter(field => !vitals[field]);

      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      const payload = {
        Age: parseFloat(vitals.Age),
        SystolicBP: parseFloat(vitals.SystolicBP),
        DiastolicBP: parseFloat(vitals.DiastolicBP),
        BS: parseFloat(vitals.BS),
        BodyTemp: parseFloat(vitals.BodyTemp),
        BMI: parseFloat(vitals.BMI),
        HeartRate: parseFloat(vitals.HeartRate),
        PreviousComplications: vitals.PreviousComplications,
        PreexistingDiabetes: vitals.PreexistingDiabetes,
        GestationalDiabetes: vitals.GestationalDiabetes,
        MentalHealth: vitals.MentalHealth
      };

      const endpoint = currentPredictionId
        ? `${API_BASE_URL}/predict/update/${currentPredictionId}`
        : `${API_BASE_URL}/predict/store`;

      const method = currentPredictionId ? 'PUT' : 'POST';

      console.log(`${method} request to:`, endpoint);
      console.log('Payload:', payload);

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Prediction failed');
      }

      if (data.status === 'success') {
        setPredictionResult(data.data);

        const predId = data.data.prediction_id || data.data.id;
        setCurrentPredictionId(predId);
        console.log('Updated prediction ID:', predId);

        setError(null);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Please try again.';
      setError(`Failed to get prediction: ${errorMessage}`);
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !isAuthenticated || !currentPredictionId) {
      return;
    }

    if (!confirm('Are you sure you want to delete this prediction?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/predict/delete/${currentPredictionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
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
          MentalHealth: 0
        });
        setPredictionResult(null);
        setCurrentPredictionId(null);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to delete prediction');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete prediction';
      setError(errorMessage);
      console.error('Delete error:', err);
    }
  };

  const handleRefresh = () => {
    if (token) {
      loadSavedData(token);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center p-8">
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <DashboardHeader
          onRefresh={handleRefresh}
          onDelete={handleDelete}
          currentPredictionId={currentPredictionId}
          loading={loading}
          loadingData={loadingData}
        />

        {/* Error Alert */}
        <ErrorAlert error={error} />

        {/* Stats Cards */}
        <StatsCards vitals={vitals} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vital Entry Form */}
          <div className="lg:col-span-1">
            <VitalsForm
              vitals={vitals}
              onVitalChange={handleVitalChange}
              onCheckboxChange={handleCheckboxChange}
              onSubmit={handlePrediction}
              loading={loading}
              isUpdate={!!currentPredictionId}
            />
          </div>

          {/* Prediction Results */}
          <div className="lg:col-span-2">
            <RiskAssessmentComponent
              predictionResult={predictionResult}
              currentPredictionId={currentPredictionId}
            />
          </div>
        </div>
        {predictionResult?.patient_profile &&
              Object.keys(predictionResult.patient_profile).length > 0 && (
                <PatientProfileSummary
                  patientProfile={predictionResult.patient_profile}
                />
              )}
      </div>
    </div>
  );
};

export default MaternalHealthDashboard;