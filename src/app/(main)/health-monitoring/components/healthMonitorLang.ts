import type { LanguageCode } from "@/components/common/useLanguage";

export const healthMonitorTranslations: Record<LanguageCode, {
  pageTitle: string;
  headerSubtitle: string;
  refresh: string;
  delete: string;
  authenticationRequired: string;
  loginAccessDashboard: string;
  loginAccessPage: string;
  authError: string;
  loginSavePredictions: string;
  deleteConfirm: string;
  failedDeletePrediction: string;
  failedPredictionPrefix: string;
  tryAgain: string;
  fillRequiredFields: string;

  stats: {
    bmi: string;
    bloodPressure: string;
    bloodSugar: string;
    heartRate: string;
    noData: string;
    underweight: string;
    normal: string;
    overweight: string;
    obese: string;
    elevated: string;
    highStage1: string;
    highStage2: string;
    low: string;
    prediabetic: string;
    diabetic: string;
    high: string;
  };

  form: {
    title: string;
    age: string;
    bloodPressure: string;
    bloodSugar: string;
    bodyTemperature: string;
    bmi: string;
    calculateFromWeightHeight: string;
    enterBMIDirectly: string;
    weight: string;
    height: string;
    calculatedBMI: string;
    heartRate: string;
    additionalRiskFactors: string;
    previousComplications: string;
    preexistingDiabetes: string;
    gestationalDiabetes: string;
    mentalHealthConcerns: string;
    updating: string;
    analyzingSaving: string;
    updateAssessment: string;
    getRiskAssessment: string;
  };

  risk: {
    title: string;
    noAssessment: string;
    noAssessmentDescription: string;
    riskLevel: string;
    assessmentResult: string;
    confidence: string;
    healthGuidance: string;
    lowRisk: string;
    midRisk: string;
    highRisk: string;
    low: string;
    medium: string;
    moderate: string;
    high: string;
  };

  profile: {
    title: string;
    yes: string;
    no: string;
    empty: string;
    fields: Record<string, string>;
  };
}> = {
  en: {
    pageTitle: "Health Monitoring",
    headerSubtitle: "Track your vital signs and get AI powered risk assessment",
    refresh: "Refresh",
    delete: "Delete",
    authenticationRequired: "Authentication Required",
    loginAccessDashboard: "Please log in to access the Maternal Health Dashboard",
    loginAccessPage: "Please log in to access the maternal health dashboard.",
    authError: "Authentication error. Please log in again.",
    loginSavePredictions: "Please log in to save predictions",
    deleteConfirm: "Are you sure you want to delete this prediction?",
    failedDeletePrediction: "Failed to delete prediction",
    failedPredictionPrefix: "Failed to get prediction:",
    tryAgain: "Please try again.",
    fillRequiredFields: "Please fill in all required fields",

    stats: {
      bmi: "BMI",
      bloodPressure: "Blood Pressure",
      bloodSugar: "Blood Sugar",
      heartRate: "Heart Rate",
      noData: "No data",
      underweight: "Underweight",
      normal: "Normal",
      overweight: "Overweight",
      obese: "Obese",
      elevated: "Elevated",
      highStage1: "High Stage 1",
      highStage2: "High Stage 2",
      low: "Low",
      prediabetic: "Prediabetic",
      diabetic: "Diabetic",
      high: "High",
    },

    form: {
      title: "Enter Vital Signs",
      age: "Age (years) *",
      bloodPressure: "Blood Pressure (mmHg) *",
      bloodSugar: "Blood Sugar (mg/dL) *",
      bodyTemperature: "Body Temperature (°F) *",
      bmi: "BMI *",
      calculateFromWeightHeight: "Calculate from weight/height",
      enterBMIDirectly: "Enter BMI directly",
      weight: "Weight (kg)",
      height: "Height (cm)",
      calculatedBMI: "Calculated BMI:",
      heartRate: "Heart Rate (bpm) *",
      additionalRiskFactors: "Additional Risk Factors",
      previousComplications: "Previous Complications",
      preexistingDiabetes: "Preexisting Diabetes",
      gestationalDiabetes: "Gestational Diabetes",
      mentalHealthConcerns: "Mental Health Concerns",
      updating: "Updating...",
      analyzingSaving: "Analyzing & Saving...",
      updateAssessment: "Update Assessment",
      getRiskAssessment: "Get Risk Assessment",
    },

    risk: {
      title: "Risk Assessment",
      noAssessment: "No assessment available",
      noAssessmentDescription: "Enter vital signs to generate a risk assessment.",
      riskLevel: "Risk level",
      assessmentResult: "Assessment result",
      confidence: "Confidence",
      healthGuidance: "Health guidance",
      lowRisk: "Low Risk",
      midRisk: "Mid Risk",
      highRisk: "High Risk",
      low: "Low",
      medium: "Medium",
      moderate: "Moderate",
      high: "High",
    },

    profile: {
      title: "Patient Profile Summary",
      yes: "Yes",
      no: "No",
      empty: "--",
      fields: {
        Age: "Age",
        SystolicBP: "Systolic BP",
        DiastolicBP: "Diastolic BP",
        BS: "Blood Sugar",
        BodyTemp: "Body Temperature",
        BMI: "BMI",
        HeartRate: "Heart Rate",
        PreviousComplications: "Previous Complications",
        PreexistingDiabetes: "Preexisting Diabetes",
        GestationalDiabetes: "Gestational Diabetes",
        MentalHealth: "Mental Health",
      },
    },
  },

  si: {
    pageTitle: "සෞඛ්‍ය නිරීක්ෂණය",
    headerSubtitle: "ඔබගේ ජීව ලක්ෂණ නිරීක්ෂණය කර AI මත පදනම් වූ අවදානම් ඇගයීමක් ලබා ගන්න",
    refresh: "නැවත පූරණය",
    delete: "මකන්න",
    authenticationRequired: "පිවිසුම අවශ්‍යයි",
    loginAccessDashboard: "මාතෘ සෞඛ්‍ය පුවරුවට පිවිසීමට කරුණාකර ලොග් වන්න",
    loginAccessPage: "මාතෘ සෞඛ්‍ය පුවරුවට පිවිසීමට කරුණාකර ලොග් වන්න.",
    authError: "සත්‍යාපන දෝෂයක්. කරුණාකර නැවත ලොග් වන්න.",
    loginSavePredictions: "පුරෝකථන සුරැකීමට කරුණාකර ලොග් වන්න",
    deleteConfirm: "මෙම පුරෝකථනය මකා දැමීමට ඔබට විශ්වාසද?",
    failedDeletePrediction: "පුරෝකථනය මකා දැමීමට නොහැකි විය",
    failedPredictionPrefix: "පුරෝකථනය ලබා ගැනීමට නොහැකි විය:",
    tryAgain: "කරුණාකර නැවත උත්සාහ කරන්න.",
    fillRequiredFields: "කරුණාකර අවශ්‍ය සියලු ක්ෂේත්‍ර පුරවන්න",

    stats: {
      bmi: "BMI",
      bloodPressure: "රුධිර පීඩනය",
      bloodSugar: "රුධිර සීනි",
      heartRate: "හෘද ස්පන්දන වේගය",
      noData: "දත්ත නැත",
      underweight: "අඩු බර",
      normal: "සාමාන්‍ය",
      overweight: "අධික බර",
      obese: "තරබාරු",
      elevated: "ඉහළ",
      highStage1: "ඉහළ අදියර 1",
      highStage2: "ඉහළ අදියර 2",
      low: "අඩු",
      prediabetic: "පෙර දියවැඩියා",
      diabetic: "දියවැඩියා",
      high: "ඉහළ",
    },

    form: {
      title: "ජීව ලක්ෂණ ඇතුළත් කරන්න",
      age: "වයස (අවුරුදු) *",
      bloodPressure: "රුධිර පීඩනය (mmHg) *",
      bloodSugar: "රුධිර සීනි (mg/dL) *",
      bodyTemperature: "ශරීර උෂ්ණත්වය (°F) *",
      bmi: "BMI *",
      calculateFromWeightHeight: "බර/උසෙන් ගණනය කරන්න",
      enterBMIDirectly: "BMI සෘජුව ඇතුළත් කරන්න",
      weight: "බර (kg)",
      height: "උස (cm)",
      calculatedBMI: "ගණනය කළ BMI:",
      heartRate: "හෘද ස්පන්දන වේගය (bpm) *",
      additionalRiskFactors: "අතිරේක අවදානම් සාධක",
      previousComplications: "පෙර සංකූලතා",
      preexistingDiabetes: "පෙර පැවති දියවැඩියාව",
      gestationalDiabetes: "ගැබිනි දියවැඩියාව",
      mentalHealthConcerns: "මානසික සෞඛ්‍ය ගැටළු",
      updating: "යාවත්කාලීන වෙමින්...",
      analyzingSaving: "විශ්ලේෂණය කර සුරකිමින්...",
      updateAssessment: "ඇගයීම යාවත්කාලීන කරන්න",
      getRiskAssessment: "අවදානම් ඇගයීම ලබා ගන්න",
    },

    risk: {
      title: "අවදානම් ඇගයීම",
      noAssessment: "ඇගයීමක් නොමැත",
      noAssessmentDescription: "අවදානම් ඇගයීමක් ලබා ගැනීමට ජීව ලක්ෂණ ඇතුළත් කරන්න.",
      riskLevel: "අවදානම් මට්ටම",
      assessmentResult: "ඇගයීම් ප්‍රතිඵලය",
      confidence: "විශ්වාසනීයත්වය",
      healthGuidance: "සෞඛ්‍ය මාර්ගෝපදේශය",
      lowRisk: "අඩු අවදානම",
      midRisk: "මධ්‍යම අවදානම",
      highRisk: "ඉහළ අවදානම",
      low: "අඩු",
      medium: "මධ්‍යම",
      moderate: "මධ්‍යස්ථ",
      high: "ඉහළ",
    },

    profile: {
      title: "රෝගී පැතිකඩ සාරාංශය",
      yes: "ඔව්",
      no: "නැත",
      empty: "--",
      fields: {
        Age: "වයස",
        SystolicBP: "සයිස්ටොලික් රුධිර පීඩනය",
        DiastolicBP: "ඩයස්ටොලික් රුධිර පීඩනය",
        BS: "රුධිර සීනි",
        BodyTemp: "ශරීර උෂ්ණත්වය",
        BMI: "BMI",
        HeartRate: "හෘද ස්පන්දන වේගය",
        PreviousComplications: "පෙර සංකූලතා",
        PreexistingDiabetes: "පෙර පැවති දියවැඩියාව",
        GestationalDiabetes: "ගැබිනි දියවැඩියාව",
        MentalHealth: "මානසික සෞඛ්‍යය",
      },
    },
  },

  ta: {
    pageTitle: "சுகாதார கண்காணிப்பு",
    headerSubtitle: "உங்கள் உயிரியல் அறிகுறிகளை கண்காணித்து AI அடிப்படையிலான ஆபத்து மதிப்பீட்டை பெறுங்கள்",
    refresh: "புதுப்பிக்கவும்",
    delete: "நீக்கு",
    authenticationRequired: "உள்நுழைவு தேவை",
    loginAccessDashboard: "தாய்மை சுகாதார டாஷ்போர்டை அணுக தயவுசெய்து உள்நுழையவும்",
    loginAccessPage: "தாய்மை சுகாதார டாஷ்போர்டை அணுக தயவுசெய்து உள்நுழையவும்.",
    authError: "அங்கீகாரப் பிழை. தயவுசெய்து மீண்டும் உள்நுழையவும்.",
    loginSavePredictions: "கணிப்புகளை சேமிக்க தயவுசெய்து உள்நுழையவும்",
    deleteConfirm: "இந்த கணிப்பை நீக்க வேண்டுமா?",
    failedDeletePrediction: "கணிப்பை நீக்க முடியவில்லை",
    failedPredictionPrefix: "கணிப்பைப் பெற முடியவில்லை:",
    tryAgain: "தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    fillRequiredFields: "தேவையான அனைத்து புலங்களையும் நிரப்பவும்",

    stats: {
      bmi: "BMI",
      bloodPressure: "இரத்த அழுத்தம்",
      bloodSugar: "இரத்த சர்க்கரை",
      heartRate: "இதய துடிப்பு",
      noData: "தரவு இல்லை",
      underweight: "குறைந்த எடை",
      normal: "சாதாரணம்",
      overweight: "அதிக எடை",
      obese: "பருமன்",
      elevated: "உயர்ந்தது",
      highStage1: "உயர் நிலை 1",
      highStage2: "உயர் நிலை 2",
      low: "குறைவு",
      prediabetic: "முன் நீரிழிவு",
      diabetic: "நீரிழிவு",
      high: "அதிகம்",
    },

    form: {
      title: "உயிரியல் அறிகுறிகளை உள்ளிடவும்",
      age: "வயது (ஆண்டுகள்) *",
      bloodPressure: "இரத்த அழுத்தம் (mmHg) *",
      bloodSugar: "இரத்த சர்க்கரை (mg/dL) *",
      bodyTemperature: "உடல் வெப்பநிலை (°F) *",
      bmi: "BMI *",
      calculateFromWeightHeight: "எடை/உயரத்திலிருந்து கணக்கிடவும்",
      enterBMIDirectly: "BMI ஐ நேரடியாக உள்ளிடவும்",
      weight: "எடை (kg)",
      height: "உயரம் (cm)",
      calculatedBMI: "கணக்கிடப்பட்ட BMI:",
      heartRate: "இதய துடிப்பு (bpm) *",
      additionalRiskFactors: "கூடுதல் ஆபத்து காரணிகள்",
      previousComplications: "முந்தைய சிக்கல்கள்",
      preexistingDiabetes: "முன்பிருந்த நீரிழிவு",
      gestationalDiabetes: "கர்ப்பகால நீரிழிவு",
      mentalHealthConcerns: "மனநல கவலைகள்",
      updating: "புதுப்பிக்கிறது...",
      analyzingSaving: "பகுப்பாய்வு செய்து சேமிக்கிறது...",
      updateAssessment: "மதிப்பீட்டை புதுப்பிக்கவும்",
      getRiskAssessment: "ஆபத்து மதிப்பீட்டை பெறவும்",
    },

    risk: {
      title: "ஆபத்து மதிப்பீடு",
      noAssessment: "மதிப்பீடு இல்லை",
      noAssessmentDescription: "ஆபத்து மதிப்பீட்டை உருவாக்க உயிரியல் அறிகுறிகளை உள்ளிடவும்.",
      riskLevel: "ஆபத்து நிலை",
      assessmentResult: "மதிப்பீட்டு முடிவு",
      confidence: "நம்பிக்கை",
      healthGuidance: "சுகாதார வழிகாட்டல்",
      lowRisk: "குறைந்த ஆபத்து",
      midRisk: "மிதமான ஆபத்து",
      highRisk: "அதிக ஆபத்து",
      low: "குறைவு",
      medium: "நடுத்தரம்",
      moderate: "மிதமான",
      high: "அதிகம்",
    },

    profile: {
      title: "நோயாளர் சுயவிவர சுருக்கம்",
      yes: "ஆம்",
      no: "இல்லை",
      empty: "--",
      fields: {
        Age: "வயது",
        SystolicBP: "சிஸ்டாலிக் இரத்த அழுத்தம்",
        DiastolicBP: "டயஸ்டாலிக் இரத்த அழுத்தம்",
        BS: "இரத்த சர்க்கரை",
        BodyTemp: "உடல் வெப்பநிலை",
        BMI: "BMI",
        HeartRate: "இதய துடிப்பு",
        PreviousComplications: "முந்தைய சிக்கல்கள்",
        PreexistingDiabetes: "முன்பிருந்த நீரிழிவு",
        GestationalDiabetes: "கர்ப்பகால நீரிழிவு",
        MentalHealth: "மனநலம்",
      },
    },
  },
};