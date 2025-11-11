"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Weight,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Brain,
  Droplet,
  TrendingUp,
  Loader2
} from 'lucide-react';

const MaternalHealthDashboard = () => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  
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
    setLoading(true);
    setError(null);
    setPredictionResult(null);

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

      // Make API call - UPDATE THIS URL to your backend URL
      const response = await fetch('http://localhost:5000/maternal/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Prediction failed');
      }

      if (data.status === 'success') {
        setPredictionResult(data.data);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err.message || 'Failed to get prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch(riskLevel?.toLowerCase()) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Maternal Health Monitoring</h1>
          <p className="text-gray-600">Track your vital signs and get AI-powered risk assessment</p>
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Get Risk Assessment
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
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Risk Probability Breakdown:</p>
                      {Object.entries(predictionResult.risk_assessment.all_risk_probabilities).map(([level, prob]) => (
                        <div key={level} className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600 w-24">{level}:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full"
                              style={{ width: `${(prob * 100).toFixed(0)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700 w-12">
                            {(prob * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Health Guidance */}
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
                              {predictionResult.health_guidance.alternative_recommendations.slice(0, 3).map((alt, idx) => (
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

                  {/* Patient Profile Summary */}
                  {predictionResult.patient_profile && (
                    <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Profile Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(predictionResult.patient_profile).map(([key, value]) => (
                          <div key={key} className="bg-white p-3 rounded border border-purple-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              {key.replace(/_/g, ' ')}
                            </p>
                            <p className="text-sm font-medium text-gray-800 mt-1">
                              {Array.isArray(value) ? value.join(', ') : value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Info */}
                  <div className="text-center text-xs text-gray-500 pt-4 border-t">
                    Model Version: {predictionResult.technical_info?.model_version || '2.0'} | 
                    Features Analyzed: {predictionResult.technical_info?.features_analyzed || 'N/A'}
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