'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Brain,
  TrendingUp,
  Loader2,
  RefreshCw,
  Save,
  Trash2
} from 'lucide-react';

const MaternalHealthDashboard = () => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPredictionId, setCurrentPredictionId] = useState(null);

  // Form state for vital signs
  const [vitals, setVitals] = useState({
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

  const loadSavedData = async (jwtToken) => {
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
        
        // Load vitals into form
        if (data.data.vitals) {
          setVitals(data.data.vitals);
        }

        // Store prediction ID - handle both 'prediction_id' and 'id' for backwards compatibility
        const predId = data.data.prediction_id || data.data.id;
        setCurrentPredictionId(predId);
        console.log('Current prediction ID:', predId);

        // Transform the data structure to match the expected format
        const transformedData = {
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
        // No predictions found - this is OK for new users
        console.log('No previous predictions found');
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to load data');
      }
    } catch (err) {
      console.log('No saved data found or error loading:', err);
      // Don't show error for "no data" case
      if (!err?.message?.includes('No predictions')) {
        // Uncomment if you want to show errors
        // setError(`Failed to load previous data: ${err.message}`);
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleVitalChange = (field, value) => {
    setVitals(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field) => {
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
      // Validate required fields
      const requiredFields = ['Age', 'SystolicBP', 'DiastolicBP', 'BS', 'BodyTemp', 'BMI', 'HeartRate'];
      const missingFields = requiredFields.filter(field => !vitals[field]);

      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Convert string values to numbers
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

      // Decide whether to create new or update existing
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
        
        // Handle both 'prediction_id' and 'id'
        const predId = data.data.prediction_id || data.data.id;
        setCurrentPredictionId(predId);
        console.log('Updated prediction ID:', predId);
        
        setError(null);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(`Failed to get prediction: ${err?.message || 'Please try again.'}`);
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
        // Reset the form and state
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
      setError(err?.message || 'Failed to delete prediction');
      console.error('Delete error:', err);
    }
  };

  const handleRefresh = () => {
    if (token) {
      loadSavedData(token);
    }
  };

  const getRiskColor = (riskLevel) => {
    if (!riskLevel) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    switch (riskLevel.toLowerCase()) {
      case 'low risk':
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'mid risk':
      case 'medium':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high risk':
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const symptoms = [
    { name: "Headache", severity: "mild" },
    { name: "Fatigue", severity: "moderate" },
    { name: "Hot Flashes", severity: "severe" },
    { name: "Nausea", severity: "mild" },
    { name: "Joint Stiffness", severity: "moderate" },
    { name: "Sleep Disorder", severity: "severe" },
    { name: "Appetite Changes", severity: "mild" },
    { name: "Anxiety", severity: "moderate" }
  ];

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Maternal Health Monitoring</h1>
            <p className="text-gray-600">Track your vital signs and get AI-powered risk assessment</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center space-x-2"
              disabled={loading || loadingData}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            {currentPredictionId && (
              <Button
                onClick={handleDelete}
                variant="outline"
                className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 ml-2">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vital Entry Form */}
          <Card className="lg:col-span-1 shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-pink-500" />
                Enter Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age (years) *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  className="mt-1"
                  value={vitals.Age}
                  onChange={(e) => handleVitalChange('Age', e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Blood Pressure (mmHg) *</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    placeholder="120"
                    type="number"
                    value={vitals.SystolicBP}
                    onChange={(e) => handleVitalChange('SystolicBP', e.target.value)}
                  />
                  <span className="self-center text-gray-500">/</span>
                  <Input
                    placeholder="80"
                    type="number"
                    value={vitals.DiastolicBP}
                    onChange={(e) => handleVitalChange('DiastolicBP', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bs" className="text-sm font-medium text-gray-700">Blood Sugar (mg/dL) *</Label>
                <Input
                  id="bs"
                  type="number"
                  placeholder="100"
                  className="mt-1"
                  value={vitals.BS}
                  onChange={(e) => handleVitalChange('BS', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="temp" className="text-sm font-medium text-gray-700">Body Temperature (°F) *</Label>
                <Input
                  id="temp"
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  className="mt-1"
                  value={vitals.BodyTemp}
                  onChange={(e) => handleVitalChange('BodyTemp', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="bmi" className="text-sm font-medium text-gray-700">BMI *</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  placeholder="22.5"
                  className="mt-1"
                  value={vitals.BMI}
                  onChange={(e) => handleVitalChange('BMI', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="hr" className="text-sm font-medium text-gray-700">Heart Rate (bpm) *</Label>
                <Input
                  id="hr"
                  type="number"
                  placeholder="72"
                  className="mt-1"
                  value={vitals.HeartRate}
                  onChange={(e) => handleVitalChange('HeartRate', e.target.value)}
                />
              </div>

              <div className="space-y-3 pt-2 border-t">
                <Label className="text-sm font-medium text-gray-700">Additional Risk Factors</Label>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="prevComp"
                    checked={vitals.PreviousComplications === 1}
                    onChange={() => handleCheckboxChange('PreviousComplications')}
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
                    onChange={() => handleCheckboxChange('PreexistingDiabetes')}
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
                    onChange={() => handleCheckboxChange('GestationalDiabetes')}
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
                    onChange={() => handleCheckboxChange('MentalHealth')}
                    className="h-4 w-4 text-pink-600 rounded"
                  />
                  <Label htmlFor="mental" className="text-sm text-gray-600 cursor-pointer">
                    Mental Health Concerns
                  </Label>
                </div>
              </div>

              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium"
                onClick={handlePrediction}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentPredictionId ? 'Updating...' : 'Analyzing & Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {currentPredictionId ? 'Update Assessment' : 'Get Risk Assessment'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Prediction Results */}
          <Card className="lg:col-span-2 shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-pink-500" />
                Risk Assessment Results
                {predictionResult && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    {currentPredictionId ? `ID: ${currentPredictionId}` : 'New'}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!predictionResult ? (
                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No Assessment Yet</p>
                    <p className="text-sm text-gray-400 mt-2">Enter your vital signs and click "Get Risk Assessment"</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Risk Level */}
                  {predictionResult.risk_assessment && (
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border-2 border-pink-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Risk Level Assessment</h3>
                        <Badge className={`${getRiskColor(predictionResult.risk_assessment.risk_level)} text-lg px-4 py-2`}>
                          {predictionResult.risk_assessment.risk_level}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-600">Confidence:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-pink-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(predictionResult.risk_assessment.confidence * 100).toFixed(0)}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {(predictionResult.risk_assessment.confidence * 100).toFixed(1)}%
                        </span>
                      </div>

                      {/* All Risk Probabilities */}
                      {predictionResult.risk_assessment.all_risk_probabilities && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Risk Probability Breakdown:</p>
                          {Object.entries(predictionResult.risk_assessment.all_risk_probabilities).map(([level, prob]) => {
                            const probValue = typeof prob === 'number' ? prob : parseFloat(String(prob));
                            return (
                              <div key={level} className="flex items-center space-x-2">
                                <span className="text-xs text-gray-600 w-24">{level}:</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full"
                                    style={{ width: `${(probValue * 100).toFixed(0)}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-700 w-12">
                                  {(probValue * 100).toFixed(1)}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Health Guidance */}
                  {predictionResult.health_guidance && (
                    <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Health Guidance</h3>
                          <p className="text-gray-700 mb-3">{predictionResult.health_guidance.primary_advice}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Confidence:</span>
                            <Badge variant="secondary" className="text-xs">
                              {(predictionResult.health_guidance.advice_confidence * 100).toFixed(1)}%
                            </Badge>
                          </div>

                          {/* Alternative Recommendations */}
                          {predictionResult.health_guidance.alternative_recommendations &&
                            predictionResult.health_guidance.alternative_recommendations.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Alternative Recommendations:</p>
                                <div className="space-y-2">
                                  {predictionResult.health_guidance.alternative_recommendations
                                    .slice(0, 3)
                                    .map((alt, idx) => (
                                      <div key={idx} className="bg-white p-3 rounded border border-blue-200">
                                        <p className="text-sm text-gray-700">{alt.advice}</p>
                                        <span className="text-xs text-gray-500">
                                          Confidence: {(alt.confidence * 100).toFixed(1)}%
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Patient Profile Summary */}
                  {predictionResult.patient_profile && Object.keys(predictionResult.patient_profile).length > 0 && (
                    <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Profile Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(predictionResult.patient_profile).map(([key, value]) => (
                          <div key={key} className="bg-white p-3 rounded border border-purple-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              {key.replace(/_/g, ' ')}
                            </p>
                            <p className="text-sm font-medium text-gray-800 mt-1">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Info */}
                  <div className="text-center text-xs text-gray-500 pt-4 border-t">
                    User ID: {predictionResult.user_id || 'N/A'} |
                    Prediction ID: {currentPredictionId || 'N/A'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Symptoms Section */}
        <Card className="mt-8 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Track Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {symptoms.map((symptom, index) => (
                <Button
                  key={index}
                  variant={selectedSymptom === symptom.name ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                    selectedSymptom === symptom.name
                      ? 'bg-pink-500 hover:bg-pink-600 text-white border-pink-500'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => setSelectedSymptom(selectedSymptom === symptom.name ? '' : symptom.name)}
                >
                  <Activity className="h-5 w-5" />
                  <div className="text-center">
                    <p className="text-xs font-medium">{symptom.name}</p>
                    <p className="text-xs opacity-75 capitalize">{symptom.severity}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaternalHealthDashboard;