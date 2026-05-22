import type { LanguageCode } from "@/components/common/useLanguage";

export const pregnancyTranslations: Record<LanguageCode, {
  page: {
    title: string;
    subtitle: string;
    loading: string;
  };

  topbar: {
    trackProgress: string;
    currentWeek: string;
    daysLeft: string;
  };

  kickCounter: {
    title: string;
    trackedToday: string;
    addKick: string;
    reset: string;
    tip: string;
  };

  timeline: {
    title: string;
    week: string;
    size: string;
    weight: string;
    estimatedDaysLeft: string;
    viewFullTimeline: string;
    fallbackDevelopment: string;
  };

  recommendation: {
    title: string;
    loading: string;
    loginRequired: string;
    userIdFailed: string;
    loadFailed: string;
    refreshAuthRequired: string;
    refreshFailed: string;
    unableToLoad: string;
    viewDetails: string;
    week: string;
    noRecommendation: string;
    noRecommendationDesc: string;
    personalizedSummary: string;
    tapToOpen: string;
    checklist: string;
    regenerated: string;
    hydrationGoal: string;
    gentleActivity: string;
    restReminder: string;
    nutritionFocus: string;
    careReminder: string;
    recommendation: string;
  };

  health: {
    title: string;
    noAssessment: string;
    goodHealth: string;
    needsAttention: string;
    highRisk: string;
    riskConfidence: string;
    assessment: string;
    bmi: string;
    bloodPressure: string;
    heartRate: string;
    loading: string;
    loginRequired: string;
    failed: string;
    noSaved: string;
    justNow: string;
    minAgo: string;
    hrAgo: string;
    dayAgo: string;
    daysAgo: string;
  };
}> = {
  en: {
    page: {
      title: "Pregnancy Dashboard",
      subtitle: "Track your progress",
      loading: "Loading pregnancy data...",
    },

    topbar: {
      trackProgress: "Track your progress",
      currentWeek: "Current Week",
      daysLeft: "Days Left",
    },

    kickCounter: {
      title: "Kick Counter",
      trackedToday: "Kicks tracked today",
      addKick: "Add Kick",
      reset: "Reset",
      tip: "Tip: Try counting kicks during the time of day when your baby is usually most active.",
    },

    timeline: {
      title: "Pregnancy Timeline & Milestones",
      week: "Week",
      size: "Size",
      weight: "Weight",
      estimatedDaysLeft: "Estimated days left",
      viewFullTimeline: "View full timeline",
      fallbackDevelopment: "Your baby is continuing to develop.",
    },

    recommendation: {
      title: "Today’s Recommendation",
      loading: "Loading today’s recommendation...",
      loginRequired: "Please log in to view today’s recommendation.",
      userIdFailed: "Authenticated, but user ID could not be resolved.",
      loadFailed: "Failed to load recommendation.",
      refreshAuthRequired: "Authentication required to refresh.",
      refreshFailed: "Failed to refresh recommendation.",
      unableToLoad: "Unable to load recommendation",
      viewDetails: "View details",
      week: "Week",
      noRecommendation: "No recommendation available yet",
      noRecommendationDesc:
        "Refresh or open the recommendation page to generate today’s guidance.",
      personalizedSummary: "Personalized daily care summary",
      tapToOpen: "Tap this card to open the full recommendation page",
      checklist: "Checklist",
      regenerated: "Regenerated",
      hydrationGoal: "Hydration Goal",
      gentleActivity: "Gentle Activity",
      restReminder: "Rest Reminder",
      nutritionFocus: "Nutrition Focus",
      careReminder: "Care Reminder",
      recommendation: "Recommendation",
    },

    health: {
      title: "Health Status Summary",
      noAssessment: "No assessment yet",
      goodHealth: "Good Health Status",
      needsAttention: "Needs Attention",
      highRisk: "High Risk",
      riskConfidence: "Risk Confidence",
      assessment: "Assessment",
      bmi: "BMI",
      bloodPressure: "Blood Pressure",
      heartRate: "Heart Rate",
      loading: "Loading health status...",
      loginRequired: "Please log in to see your health summary.",
      failed: "Failed to load summary.",
      noSaved:
        "No saved assessment yet. Click to add vitals and get your first assessment.",
      justNow: "just now",
      minAgo: "min ago",
      hrAgo: "hr ago",
      dayAgo: "day ago",
      daysAgo: "days ago",
    },
  },

  si: {
    page: {
      title: "ගර්භණී තත්ත්ව පුවරුව",
      subtitle: "ඔබේ ප්‍රගතිය නිරීක්ෂණය කරන්න",
      loading: "ගර්භණී දත්ත පූරණය වෙමින්...",
    },

    topbar: {
      trackProgress: "ඔබේ ප්‍රගතිය නිරීක්ෂණය කරන්න",
      currentWeek: "වත්මන් සතිය",
      daysLeft: "ඉතිරි දින",
    },

    kickCounter: {
      title: "බිළිඳාගේ චලන ගණකය",
      trackedToday: "අද ගණන් කළ චලන",
      addKick: "චලනයක් එක් කරන්න",
      reset: "නැවත සකසන්න",
      tip: "උපදෙස්: ඔබේ බිළිඳා සාමාන්‍යයෙන් වැඩිපුර ක්‍රියාශීලී වන වේලාවේ චලන ගණන් කිරීමට උත්සාහ කරන්න.",
    },

    timeline: {
      title: "ගර්භණී කාලරේඛාව සහ මයිල්ස්ටෝන්",
      week: "සතිය",
      size: "ප්‍රමාණය",
      weight: "බර",
      estimatedDaysLeft: "ඇස්තමේන්තුගත ඉතිරි දින",
      viewFullTimeline: "සම්පූර්ණ කාලරේඛාව බලන්න",
      fallbackDevelopment: "ඔබේ බිළිඳා දිගටම වර්ධනය වෙමින් පවතී.",
    },

    recommendation: {
      title: "අද නිර්දේශය",
      loading: "අද නිර්දේශය පූරණය වෙමින්...",
      loginRequired: "අද නිර්දේශය බැලීමට ලොග් වන්න.",
      userIdFailed: "ලොග් වී ඇත, නමුත් පරිශීලක අංකය හඳුනාගත නොහැකි විය.",
      loadFailed: "නිර්දේශය පූරණය කිරීමට අසමත් විය.",
      refreshAuthRequired: "නැවත පූරණය කිරීමට ලොග් වීම අවශ්‍යයි.",
      refreshFailed: "නිර්දේශය නැවත පූරණය කිරීමට අසමත් විය.",
      unableToLoad: "නිර්දේශය පූරණය කළ නොහැක",
      viewDetails: "විස්තර බලන්න",
      week: "සතිය",
      noRecommendation: "තවම නිර්දේශයක් නොමැත",
      noRecommendationDesc:
        "අද මාර්ගෝපදේශය ලබා ගැනීමට නැවත පූරණය කරන්න හෝ නිර්දේශ පිටුව විවෘත කරන්න.",
      personalizedSummary: "පුද්ගලික දෛනික සත්කාර සාරාංශය",
      tapToOpen: "සම්පූර්ණ නිර්දේශ පිටුව විවෘත කිරීමට මෙම කාඩ්පත තට්ටු කරන්න",
      checklist: "පිරික්සුම් ලැයිස්තුව",
      regenerated: "නැවත ජනනය කරන ලදී",
      hydrationGoal: "ජල පරිභෝජන ඉලක්කය",
      gentleActivity: "මෘදු ක්‍රියාකාරකම",
      restReminder: "විවේක මතක් කිරීම",
      nutritionFocus: "පෝෂණ අවධානය",
      careReminder: "සත්කාර මතක් කිරීම",
      recommendation: "නිර්දේශය",
    },

    health: {
      title: "සෞඛ්‍ය තත්ත්ව සාරාංශය",
      noAssessment: "තවම තක්සේරුවක් නැත",
      goodHealth: "හොඳ සෞඛ්‍ය තත්ත්වයක්",
      needsAttention: "අවධානය අවශ්‍යයි",
      highRisk: "ඉහළ අවදානම",
      riskConfidence: "අවදානම් විශ්වාස මට්ටම",
      assessment: "තක්සේරුව",
      bmi: "BMI",
      bloodPressure: "රුධිර පීඩනය",
      heartRate: "හෘද ස්පන්දන වේගය",
      loading: "සෞඛ්‍ය තත්ත්වය පූරණය වෙමින්...",
      loginRequired: "ඔබේ සෞඛ්‍ය සාරාංශය බැලීමට ලොග් වන්න.",
      failed: "සාරාංශය පූරණය කිරීමට අසමත් විය.",
      noSaved:
        "තවම සුරකින ලද තක්සේරුවක් නැත. පළමු තක්සේරුව ලබා ගැනීමට විටල්ස් එක් කරන්න.",
      justNow: "දැන්ම",
      minAgo: "මිනිත්තු පෙර",
      hrAgo: "පැය පෙර",
      dayAgo: "දිනකට පෙර",
      daysAgo: "දින පෙර",
    },
  },

  ta: {
    page: {
      title: "கர்ப்பகால டாஷ்போர்டு",
      subtitle: "உங்கள் முன்னேற்றத்தை கண்காணிக்கவும்",
      loading: "கர்ப்பகால தரவு ஏற்றப்படுகிறது...",
    },

    topbar: {
      trackProgress: "உங்கள் முன்னேற்றத்தை கண்காணிக்கவும்",
      currentWeek: "தற்போதைய வாரம்",
      daysLeft: "மீதமுள்ள நாட்கள்",
    },

    kickCounter: {
      title: "குழந்தை அசைவு எண்ணிக்கை",
      trackedToday: "இன்று கண்காணிக்கப்பட்ட அசைவுகள்",
      addKick: "அசைவு சேர்க்கவும்",
      reset: "மீட்டமை",
      tip: "குறிப்பு: உங்கள் குழந்தை பொதுவாக அதிகம் அசையும் நேரத்தில் அசைவுகளை எண்ண முயற்சிக்கவும்.",
    },

    timeline: {
      title: "கர்ப்பகால காலவரிசை மற்றும் மைல்கற்கள்",
      week: "வாரம்",
      size: "அளவு",
      weight: "எடை",
      estimatedDaysLeft: "மதிப்பிடப்பட்ட மீதமுள்ள நாட்கள்",
      viewFullTimeline: "முழு காலவரிசையை பார்க்க",
      fallbackDevelopment: "உங்கள் குழந்தை தொடர்ந்து வளர்ந்து கொண்டிருக்கிறது.",
    },

    recommendation: {
      title: "இன்றைய பரிந்துரை",
      loading: "இன்றைய பரிந்துரை ஏற்றப்படுகிறது...",
      loginRequired: "இன்றைய பரிந்துரையைப் பார்க்க உள்நுழையவும்.",
      userIdFailed: "உள்நுழைந்துள்ளீர்கள், ஆனால் பயனர் ஐடியை கண்டறிய முடியவில்லை.",
      loadFailed: "பரிந்துரையை ஏற்ற முடியவில்லை.",
      refreshAuthRequired: "புதுப்பிக்க உள்நுழைவு தேவை.",
      refreshFailed: "பரிந்துரையை புதுப்பிக்க முடியவில்லை.",
      unableToLoad: "பரிந்துரையை ஏற்ற முடியவில்லை",
      viewDetails: "விவரங்களை பார்க்க",
      week: "வாரம்",
      noRecommendation: "இன்னும் பரிந்துரை இல்லை",
      noRecommendationDesc:
        "இன்றைய வழிகாட்டுதலை உருவாக்க புதுப்பிக்கவும் அல்லது பரிந்துரை பக்கத்தை திறக்கவும்.",
      personalizedSummary: "தனிப்பயன் தினசரி பராமரிப்பு சுருக்கம்",
      tapToOpen: "முழு பரிந்துரை பக்கத்தை திறக்க இந்த அட்டையைத் தட்டவும்",
      checklist: "சரிபார்ப்பு பட்டியல்",
      regenerated: "மீண்டும் உருவாக்கப்பட்டது",
      hydrationGoal: "நீர்ப்பான இலக்கு",
      gentleActivity: "மென்மையான செயல்பாடு",
      restReminder: "ஓய்வு நினைவூட்டல்",
      nutritionFocus: "ஊட்டச்சத்து கவனம்",
      careReminder: "பராமரிப்பு நினைவூட்டல்",
      recommendation: "பரிந்துரை",
    },

    health: {
      title: "ஆரோக்கிய நிலை சுருக்கம்",
      noAssessment: "இன்னும் மதிப்பீடு இல்லை",
      goodHealth: "நல்ல ஆரோக்கிய நிலை",
      needsAttention: "கவனம் தேவை",
      highRisk: "அதிக ஆபத்து",
      riskConfidence: "ஆபத்து நம்பிக்கை",
      assessment: "மதிப்பீடு",
      bmi: "BMI",
      bloodPressure: "இரத்த அழுத்தம்",
      heartRate: "இதய துடிப்பு",
      loading: "ஆரோக்கிய நிலை ஏற்றுகிறது...",
      loginRequired: "உங்கள் ஆரோக்கிய சுருக்கத்தைப் பார்க்க உள்நுழையவும்.",
      failed: "சுருக்கத்தை ஏற்ற முடியவில்லை.",
      noSaved:
        "சேமிக்கப்பட்ட மதிப்பீடு இல்லை. முதல் மதிப்பீட்டை பெற விவரங்களைச் சேர்க்கவும்.",
      justNow: "இப்போது",
      minAgo: "நிமிடங்களுக்கு முன்",
      hrAgo: "மணி நேரங்களுக்கு முன்",
      dayAgo: "நாள் முன்",
      daysAgo: "நாட்களுக்கு முன்",
    },
  },
};