import type { LanguageCode } from "@/components/common/useLanguage";

export const cycleTrackerTranslations: Record<
  LanguageCode,
  {
    pageTitle: string;
    pageSubtitle: string;
    authRequiredTitle: string;
    authRequiredDefaultMessage: string;
    authLoginMessage: string;
    authErrorMessage: string;
    calculatorTitle: string;
    lastPeriodStartDate: string;
    averageCycleLength: string;
    calculateButton: string;
    calculatingButton: string;
    calculatedSuccess: string;
    enterLastPeriodDate: string;
    loginToCalculate: string;
    calculationFailed: string;
    calendar: string;
    recalculate: string;
    weekdays: string[];
    period: string;
    fertileWindow: string;
    ovulation: string;
    today: string;
    cycleInsights: string;
    ovulationTitle: string;
    expectedOn: string;
    fertileWindowTitle: string;
    nextPeriodTitle: string;
    expectedAround: string;
    safeDaysTitle: string;
    pregnancyTestTitle: string;
    bestToTestAfter: string;
    notAvailable: string;
    currentDay: string;
    periodOfCycle: string;
    cycleLength: string;
    average: string;
    nextPeriod: string;
    daysLeft: string;
    fertileDays: string;
    remaining: string;
  }
> = {
  en: {
    pageTitle: "Cycle Tracker",
    pageSubtitle: "Track your cycle and fertility window",

    authRequiredTitle: "Authentication Required",
    authRequiredDefaultMessage: "Please log in to access the Cycle Tracker",
    authLoginMessage: "Please log in to access the cycle tracker.",
    authErrorMessage: "Authentication error. Please log in again.",

    calculatorTitle: "Calculate Your Fertility Window",
    lastPeriodStartDate: "Last Period Start Date",
    averageCycleLength: "Average Cycle Length (days)",
    calculateButton: "Calculate Fertility Window",
    calculatingButton: "Calculating...",
    calculatedSuccess: "Fertility window calculated successfully!",
    enterLastPeriodDate: "Please enter your last period date",
    loginToCalculate: "Please log in to calculate fertility window",
    calculationFailed: "Failed to calculate fertility window",

    calendar: "Calendar",
    recalculate: "Recalculate",
    weekdays: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    period: "Period",
    fertileWindow: "Fertile Window",
    ovulation: "Ovulation",
    today: "Today",

    cycleInsights: "Cycle Insights",
    ovulationTitle: "Ovulation",
    expectedOn: "Expected on",
    fertileWindowTitle: "Fertile Window",
    nextPeriodTitle: "Next Period",
    expectedAround: "Expected around",
    safeDaysTitle: "Safe Days",
    pregnancyTestTitle: "Pregnancy Test",
    bestToTestAfter: "Best to test after",
    notAvailable: "N/A",

    currentDay: "Current Day",
    periodOfCycle: "Period of cycle",
    cycleLength: "Cycle Length",
    average: "Average",
    nextPeriod: "Next Period",
    daysLeft: "Days left",
    fertileDays: "Fertile Days",
    remaining: "Remaining",
  },

  si: {
    pageTitle: "මාසික චක්‍ර නිරීක්ෂකය",
    pageSubtitle: "ඔබේ මාසික චක්‍රය සහ සරු කාලය නිරීක්ෂණය කරන්න",

    authRequiredTitle: "පිවිසුම අවශ්‍යයි",
    authRequiredDefaultMessage:
      "මාසික චක්‍ර නිරීක්ෂකයට ප්‍රවේශ වීමට කරුණාකර පිවිසෙන්න",
    authLoginMessage:
      "මාසික චක්‍ර නිරීක්ෂකයට ප්‍රවේශ වීමට කරුණාකර පිවිසෙන්න.",
    authErrorMessage: "සත්‍යාපන දෝෂයක් ඇතිවිය. කරුණාකර නැවත පිවිසෙන්න.",

    calculatorTitle: "ඔබේ සරු කාලය ගණනය කරන්න",
    lastPeriodStartDate: "අවසන් මාසික රුධිර වහනය ආරම්භ වූ දිනය",
    averageCycleLength: "සාමාන්‍ය චක්‍ර දිග (දින)",
    calculateButton: "සරු කාලය ගණනය කරන්න",
    calculatingButton: "ගණනය කරමින්...",
    calculatedSuccess: "සරු කාලය නිවැරදිව ගණනය කරන ලදී!",
    enterLastPeriodDate:
      "කරුණාකර ඔබේ අවසන් මාසික රුධිර වහනය ආරම්භ වූ දිනය ඇතුළත් කරන්න",
    loginToCalculate: "සරු කාලය ගණනය කිරීමට කරුණාකර පිවිසෙන්න",
    calculationFailed: "සරු කාලය ගණනය කිරීම අසාර්ථක විය",

    calendar: "දින දර්.ශනය",
    recalculate: "නැවත ගණනය කරන්න",
    weekdays: ["ඉරි", "සඳු", "අඟ", "බදා", "බ්‍රහ", "සිකු", "සෙන"],
    period: "මාසික කාලය",
    fertileWindow: "සරු කාලය",
    ovulation: "ඩිම්බ මෝචනය",
    today: "අද",

    cycleInsights: "චක්‍ර තොරතුරු",
    ovulationTitle: "ඩිම්බ මෝචනය",
    expectedOn: "අපේක්ෂිත දිනය",
    fertileWindowTitle: "සරු කාලය",
    nextPeriodTitle: "ඊළඟ මාසික කාලය",
    expectedAround: "අපේක්ෂිත කාලය",
    safeDaysTitle: "ආරක්ෂිත දින",
    pregnancyTestTitle: "ගර්භ පරීක්ෂණය",
    bestToTestAfter: "පරීක්ෂා කිරීමට හොඳම දිනය",
    notAvailable: "නොමැත",

    currentDay: "වත්මන් දිනය",
    periodOfCycle: "චක්‍රයේ දිනය",
    cycleLength: "චක්‍ර දිග",
    average: "සාමාන්‍යය",
    nextPeriod: "ඊළඟ මාසික කාලය",
    daysLeft: "ඉතිරි දින",
    fertileDays: "සරු දින",
    remaining: "ඉතිරි",
  },

  ta: {
    pageTitle: "மாதவிடாய் சுழற்சி கண்காணிப்பு",
    pageSubtitle:
      "உங்கள் மாதவிடாய் சுழற்சியும் கருவுறும் காலத்தையும் கண்காணிக்கவும்",

    authRequiredTitle: "உள்நுழைவு தேவை",
    authRequiredDefaultMessage:
      "மாதவிடாய் சுழற்சி கண்காணிப்பை அணுக தயவுசெய்து உள்நுழையவும்",
    authLoginMessage:
      "மாதவிடாய் சுழற்சி கண்காணிப்பை அணுக தயவுசெய்து உள்நுழையவும்.",
    authErrorMessage:
      "அங்கீகாரப் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் உள்நுழையவும்.",

    calculatorTitle: "உங்கள் கருவுறும் காலத்தை கணக்கிடுங்கள்",
    lastPeriodStartDate: "கடைசி மாதவிடாய் தொடங்கிய தேதி",
    averageCycleLength: "சராசரி சுழற்சி நீளம் (நாட்கள்)",
    calculateButton: "கருவுறும் காலத்தை கணக்கிடுங்கள்",
    calculatingButton: "கணக்கிடுகிறது...",
    calculatedSuccess: "கருவுறும் காலம் வெற்றிகரமாக கணக்கிடப்பட்டது!",
    enterLastPeriodDate:
      "தயவுசெய்து உங்கள் கடைசி மாதவிடாய் தொடங்கிய தேதியை உள்ளிடுங்கள்",
    loginToCalculate:
      "கருவுறும் காலத்தை கணக்கிட தயவுசெய்து உள்நுழையவும்",
    calculationFailed: "கருவுறும் காலத்தை கணக்கிட முடியவில்லை",

    calendar: "நாட்காட்டி",
    recalculate: "மீண்டும் கணக்கிடுங்கள்",
    weekdays: ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"],
    period: "மாதவிடாய்",
    fertileWindow: "கருவுறும் காலம்",
    ovulation: "முட்டை வெளியேற்றம்",
    today: "இன்று",

    cycleInsights: "சுழற்சி விவரங்கள்",
    ovulationTitle: "முட்டை வெளியேற்றம்",
    expectedOn: "எதிர்பார்க்கப்படும் தேதி",
    fertileWindowTitle: "கருவுறும் காலம்",
    nextPeriodTitle: "அடுத்த மாதவிடாய்",
    expectedAround: "சுமார் எதிர்பார்க்கப்படும் தேதி",
    safeDaysTitle: "பாதுகாப்பான நாட்கள்",
    pregnancyTestTitle: "கர்ப்ப பரிசோதனை",
    bestToTestAfter: "பரிசோதனை செய்ய சிறந்த நாள்",
    notAvailable: "இல்லை",

    currentDay: "தற்போதைய நாள்",
    periodOfCycle: "சுழற்சியின் நாள்",
    cycleLength: "சுழற்சி நீளம்",
    average: "சராசரி",
    nextPeriod: "அடுத்த மாதவிடாய்",
    daysLeft: "மீதமுள்ள நாட்கள்",
    fertileDays: "கருவுறும் நாட்கள்",
    remaining: "மீதம்",
  },
};