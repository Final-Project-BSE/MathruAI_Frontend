import type { LanguageCode } from "@/components/common/useLanguage";

type DailyRecommendationTranslation = {
  pageTitle: string;

  headerTitle: (name: string) => string;
  pregnancyJourney: (week: number) => string;

  authRequiredTitle: string;
  authRequiredMessage: string;
  loginRequiredError: string;
  authUserIdError: string;
  authError: string;

  checklist: string;
  history: string;

  progressTitle: string;
  progressDescription: string;
  trimester: (trimester: number) => string;
  weekOfForty: (week: number) => string;
  pregnancyCompletionProgress: string;
  currentWeek: string;
  weeksToGo: string;
  daysLeft: string;

  todayRecommendation: string;
  updateYourData: string;
  noRecommendationTitle: string;
  noRecommendationDescription: string;
  completed: (done: number, total: number) => string;
  checklistSavedFor: (date: string) => string;
  markAllDone: string;
  reset: string;
  personalizedForYou: string;
  regenerateRefresh: string;

  recentRecommendations: string;
  loadingHistory: string;
  noHistory: string;
  checklistProgress: string;
  completedShort: (done: number, total: number) => string;

  updateSettings: string;
  pregnancyWeek: string;
  weekValidation: string;
  preferencesInterests: string;
  preferencesPlaceholder: string;
  preferencesHelp: string;
  cancel: string;
  saving: string;
  saveRegenerate: string;

  refreshAuthError: string;
  refreshSuccess: string;
  refreshFailed: string;
  updateAuthError: string;
  updateSuccess: string;
  updateFailed: string;
  loadDataFailed: string;
};

export const dailyRecommendationTranslations: Record<
  LanguageCode,
  DailyRecommendationTranslation
> = {
  en: {
    pageTitle: "Daily Recommendation",

    headerTitle: (name) => `Check Today's Recommendation, ${name}!`,
    pregnancyJourney: (week) => `Week ${week} of your pregnancy journey`,

    authRequiredTitle: "Authentication Required",
    authRequiredMessage:
      "Please log in to access the Daily Recommendations Dashboard.",
    loginRequiredError:
      "Please log in to access the daily recommendations dashboard.",
    authUserIdError:
      "Authenticated, but could not resolve your user ID. Please log in again.",
    authError: "Authentication error. Please log in again.",

    checklist: "Checklist",
    history: "History",

    progressTitle: "Pregnancy Progress",
    progressDescription: "Track your current journey and remaining time",
    trimester: (trimester) => `Trimester ${trimester}`,
    weekOfForty: (week) => `Week ${week} of 40`,
    pregnancyCompletionProgress: "Pregnancy completion progress",
    currentWeek: "Current Week",
    weeksToGo: "Weeks to Go",
    daysLeft: "Days Left",

    todayRecommendation: "Today's Recommendation",
    updateYourData: "Update Your Data",
    noRecommendationTitle: "No recommendation available yet",
    noRecommendationDescription:
      "Refresh to generate today's personalized guidance.",
    completed: (done, total) => `${done}/${total} completed`,
    checklistSavedFor: (date) => `Checklist saved for ${date}`,
    markAllDone: "Mark all done",
    reset: "Reset",
    personalizedForYou: "Personalized for you",
    regenerateRefresh: "Regenerate / Refresh",

    recentRecommendations: "Recent Recommendations",
    loadingHistory: "Loading history...",
    noHistory: "No recommendation history yet",
    checklistProgress: "Checklist Progress",
    completedShort: (done, total) => `${done}/${total} completed`,

    updateSettings: "Update Settings",
    pregnancyWeek: "Pregnancy Week *",
    weekValidation: "Week must be between 1 and 42",
    preferencesInterests: "Preferences & Interests",
    preferencesPlaceholder: "e.g., vegetarian, yoga enthusiast, first-time mom",
    preferencesHelp: "Tell us about your lifestyle and dietary preferences",
    cancel: "Cancel",
    saving: "Saving...",
    saveRegenerate: "Save & Regenerate",

    refreshAuthError: "Authentication required to refresh recommendation.",
    refreshSuccess: "Recommendation refreshed successfully.",
    refreshFailed: "Failed to refresh recommendation.",
    updateAuthError: "Authentication required to update settings.",
    updateSuccess: "Settings updated and recommendation regenerated.",
    updateFailed: "Failed to update settings.",
    loadDataFailed: "Failed to load data",
  },

  si: {
    pageTitle: "දෛනික නිර්දේශය",

    headerTitle: (name) => `අද නිර්දේශය බලන්න, ${name}!`,
    pregnancyJourney: (week) => `ඔබගේ ගර්භණී ගමනේ ${week} වන සතිය`,

    authRequiredTitle: "පිවිසීම අවශ්‍යයි",
    authRequiredMessage:
      "දෛනික නිර්දේශ පුවරුවට ප්‍රවේශ වීමට කරුණාකර පිවිසෙන්න.",
    loginRequiredError:
      "දෛනික නිර්දේශ පුවරුවට ප්‍රවේශ වීමට කරුණාකර පිවිසෙන්න.",
    authUserIdError:
      "පිවිසී ඇත, නමුත් ඔබගේ පරිශීලක ID එක හඳුනාගත නොහැක. කරුණාකර නැවත පිවිසෙන්න.",
    authError: "සත්‍යාපන දෝෂයක් ඇතිවිය. කරුණාකර නැවත පිවිසෙන්න.",

    checklist: "පරීක්ෂණ ලැයිස්තුව",
    history: "ඉතිහාසය",

    progressTitle: "ගර්භණී ප්‍රගතිය",
    progressDescription: "ඔබගේ වත්මන් ගමන සහ ඉතිරි කාලය නිරීක්ෂණය කරන්න",
    trimester: (trimester) => `${trimester} වන ත්‍රෛමාසිකය`,
    weekOfForty: (week) => `සති 40න් ${week} වන සතිය`,
    pregnancyCompletionProgress: "ගර්භණී සම්පූර්ණ වීමේ ප්‍රගතිය",
    currentWeek: "වත්මන් සතිය",
    weeksToGo: "ඉතිරි සති",
    daysLeft: "ඉතිරි දින",

    todayRecommendation: "අද නිර්දේශය",
    updateYourData: "ඔබගේ දත්ත යාවත්කාලීන කරන්න",
    noRecommendationTitle: "තවම නිර්දේශයක් නොමැත",
    noRecommendationDescription:
      "අද පුද්ගලික මඟපෙන්වීම ජනනය කිරීමට නැවත යාවත්කාලීන කරන්න.",
    completed: (done, total) => `${done}/${total} සම්පූර්ණයි`,
    checklistSavedFor: (date) => `${date} සඳහා පරීක්ෂණ ලැයිස්තුව සුරක්ෂිතයි`,
    markAllDone: "සියල්ල සම්පූර්ණ ලෙස සලකුණු කරන්න",
    reset: "නැවත සකසන්න",
    personalizedForYou: "ඔබ සඳහා පුද්ගලිකකරණය කර ඇත",
    regenerateRefresh: "නැවත ජනනය / යාවත්කාලීන කරන්න",

    recentRecommendations: "මෑත නිර්දේශ",
    loadingHistory: "ඉතිහාසය පූරණය වෙමින්...",
    noHistory: "තවම නිර්දේශ ඉතිහාසයක් නොමැත",
    checklistProgress: "පරීක්ෂණ ලැයිස්තු ප්‍රගතිය",
    completedShort: (done, total) => `${done}/${total} සම්පූර්ණයි`,

    updateSettings: "සැකසුම් යාවත්කාලීන කරන්න",
    pregnancyWeek: "ගර්භණී සතිය *",
    weekValidation: "සතිය 1 සහ 42 අතර විය යුතුය",
    preferencesInterests: "මනාප සහ රුචිකත්වයන්",
    preferencesPlaceholder: "උදා: නිර්මාංශ, යෝගා රුචි, පළමු මව",
    preferencesHelp: "ඔබගේ ජීවන රටාව සහ ආහාර මනාප ගැන කියන්න",
    cancel: "අවලංගු කරන්න",
    saving: "සුරකිමින්...",
    saveRegenerate: "සුරකින්න සහ නැවත ජනනය කරන්න",

    refreshAuthError: "නිර්දේශය යාවත්කාලීන කිරීමට සත්‍යාපනය අවශ්‍යයි.",
    refreshSuccess: "නිර්දේශය සාර්ථකව යාවත්කාලීන විය.",
    refreshFailed: "නිර්දේශය යාවත්කාලීන කිරීමට අසමත් විය.",
    updateAuthError: "සැකසුම් යාවත්කාලීන කිරීමට සත්‍යාපනය අවශ්‍යයි.",
    updateSuccess: "සැකසුම් යාවත්කාලීන කර නිර්දේශය නැවත ජනනය විය.",
    updateFailed: "සැකසුම් යාවත්කාලීන කිරීමට අසමත් විය.",
    loadDataFailed: "දත්ත පූරණය කිරීමට අසමත් විය",
  },

  ta: {
    pageTitle: "தினசரி பரிந்துரை",

    headerTitle: (name) => `இன்றைய பரிந்துரையை பார்க்கவும், ${name}!`,
    pregnancyJourney: (week) => `உங்கள் கர்ப்பப் பயணத்தின் ${week}வது வாரம்`,

    authRequiredTitle: "அங்கீகாரம் தேவை",
    authRequiredMessage:
      "தினசரி பரிந்துரை பலகையை அணுக தயவுசெய்து உள்நுழையவும்.",
    loginRequiredError:
      "தினசரி பரிந்துரை பலகையை அணுக தயவுசெய்து உள்நுழையவும்.",
    authUserIdError:
      "உள்நுழைந்துள்ளீர்கள், ஆனால் உங்கள் பயனர் IDயை கண்டறிய முடியவில்லை. தயவுசெய்து மீண்டும் உள்நுழையவும்.",
    authError: "அங்கீகாரப் பிழை. தயவுசெய்து மீண்டும் உள்நுழையவும்.",

    checklist: "சரிபார்ப்பு பட்டியல்",
    history: "வரலாறு",

    progressTitle: "கர்ப்ப முன்னேற்றம்",
    progressDescription:
      "உங்கள் தற்போதைய பயணம் மற்றும் மீதமுள்ள நேரத்தை கண்காணிக்கவும்",
    trimester: (trimester) => `${trimester}வது மூன்றாம் பகுதி`,
    weekOfForty: (week) => `40 வாரங்களில் ${week}வது வாரம்`,
    pregnancyCompletionProgress: "கர்ப்ப நிறைவு முன்னேற்றம்",
    currentWeek: "தற்போதைய வாரம்",
    weeksToGo: "மீதமுள்ள வாரங்கள்",
    daysLeft: "மீதமுள்ள நாட்கள்",

    todayRecommendation: "இன்றைய பரிந்துரை",
    updateYourData: "உங்கள் தரவை புதுப்பிக்கவும்",
    noRecommendationTitle: "இன்னும் பரிந்துரை இல்லை",
    noRecommendationDescription:
      "இன்றைய தனிப்பயன் வழிகாட்டலை உருவாக்க புதுப்பிக்கவும்.",
    completed: (done, total) => `${done}/${total} முடிந்தது`,
    checklistSavedFor: (date) => `${date}க்கான சரிபார்ப்பு பட்டியல் சேமிக்கப்பட்டது`,
    markAllDone: "அனைத்தையும் முடிந்ததாக குறிக்கவும்",
    reset: "மீட்டமை",
    personalizedForYou: "உங்களுக்காக தனிப்பயனாக்கப்பட்டது",
    regenerateRefresh: "மீண்டும் உருவாக்கு / புதுப்பி",

    recentRecommendations: "சமீபத்திய பரிந்துரைகள்",
    loadingHistory: "வரலாறு ஏற்றப்படுகிறது...",
    noHistory: "இன்னும் பரிந்துரை வரலாறு இல்லை",
    checklistProgress: "சரிபார்ப்பு பட்டியல் முன்னேற்றம்",
    completedShort: (done, total) => `${done}/${total} முடிந்தது`,

    updateSettings: "அமைப்புகளை புதுப்பிக்கவும்",
    pregnancyWeek: "கர்ப்ப வாரம் *",
    weekValidation: "வாரம் 1 முதல் 42க்குள் இருக்க வேண்டும்",
    preferencesInterests: "விருப்பங்கள் & ஆர்வங்கள்",
    preferencesPlaceholder: "உதா: சைவம், யோகா ஆர்வம், முதல் முறை தாய்",
    preferencesHelp: "உங்கள் வாழ்க்கை முறை மற்றும் உணவு விருப்பங்களை சொல்லுங்கள்",
    cancel: "ரத்து செய்",
    saving: "சேமிக்கிறது...",
    saveRegenerate: "சேமித்து மீண்டும் உருவாக்கு",

    refreshAuthError: "பரிந்துரையை புதுப்பிக்க அங்கீகாரம் தேவை.",
    refreshSuccess: "பரிந்துரை வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
    refreshFailed: "பரிந்துரையை புதுப்பிக்க முடியவில்லை.",
    updateAuthError: "அமைப்புகளை புதுப்பிக்க அங்கீகாரம் தேவை.",
    updateSuccess:
      "அமைப்புகள் புதுப்பிக்கப்பட்டு பரிந்துரை மீண்டும் உருவாக்கப்பட்டது.",
    updateFailed: "அமைப்புகளை புதுப்பிக்க முடியவில்லை.",
    loadDataFailed: "தரவை ஏற்ற முடியவில்லை",
  },
};