import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Brain, CheckCircle } from 'lucide-react';

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
  vitals: any;
  risk_assessment: RiskAssessment;
  health_guidance: HealthGuidance;
  patient_profile: Record<string, any>;
}

interface RiskAssessmentProps {
  predictionResult: PredictionResult | null;
  currentPredictionId: string | null;
}

const RiskAssessmentComponent: React.FC<RiskAssessmentProps> = ({
  predictionResult,
  currentPredictionId
}) => {
  const getRiskColor = (riskLevel: string | undefined): string => {
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

  return (
    <Card className="shadow-md bg-white">
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
              <p className="text-sm text-gray-400 mt-2">
                Enter your vital signs and click "Get Risk Assessment"
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Risk Level */}
            {predictionResult.risk_assessment && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border-2 border-pink-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Risk Level Assessment
                  </h3>
                  <Badge
                    className={`${getRiskColor(
                      predictionResult.risk_assessment.risk_level
                    )} text-lg px-4 py-2`}
                  >
                    {predictionResult.risk_assessment.risk_level}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${(
                          predictionResult.risk_assessment.confidence * 100
                        ).toFixed(0)}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {(predictionResult.risk_assessment.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                {/* All Risk Probabilities */}
                {predictionResult.risk_assessment.all_risk_probabilities && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Risk Probability Breakdown:
                    </p>
                    {Object.entries(
                      predictionResult.risk_assessment.all_risk_probabilities
                    ).map(([level, prob]) => {
                      const probValue =
                        typeof prob === 'number' ? prob : parseFloat(String(prob));
                      return (
                        <div key={level} className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600 w-24">{level}:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full"
                              style={{
                                width: `${(probValue * 100).toFixed(0)}%`
                              }}
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Health Guidance
                    </h3>
                    <p className="text-gray-700 mb-3">
                      {predictionResult.health_guidance.primary_advice}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentComponent;