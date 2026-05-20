import type { LanguageCode } from "@/components/common/useLanguage";

type VaccinationTranslation = {
  popupTitle: string;
  popupDescription: string;
  closePopup: string;

  loadingRecords: string;
  authRequired: string;
  loadFailed: string;

  noCardsPrefix: string;
  noCardsSuffix: string;

  noType: string;
  dose: string;
  dueDate: string;
  injectionDate: string;
  completedDate: string;
  location: string;
  midwifeNote: string;
  emptyValue: string;

  status: {
    PENDING: string;
    COMPLETED: string;
    MISSED: string;
  };
};

export const vaccinationTranslations: Record<
  LanguageCode,
  VaccinationTranslation
> = {
  en: {
    popupTitle: "My Vaccinations",
    popupDescription: "View vaccination cards assigned by your midwife",
    closePopup: "Close vaccination popup",

    loadingRecords: "Loading vaccination records...",
    authRequired: "You are not authenticated.",
    loadFailed: "Failed to load vaccination details.",

    noCardsPrefix: "No",
    noCardsSuffix: "vaccination cards.",

    noType: "No type",
    dose: "Dose",
    dueDate: "Due date",
    injectionDate: "Injection date",
    completedDate: "Completed date",
    location: "Location",
    midwifeNote: "Midwife note",
    emptyValue: "-",

    status: {
      PENDING: "Pending",
      COMPLETED: "Completed",
      MISSED: "Missed",
    },
  },

  si: {
    popupTitle: "මගේ එන්නත්",
    popupDescription: "ඔබගේ පවුල් සෞඛ්‍ය සේවිකාව විසින් පවරා ඇති එන්නත් කාඩ්පත් බලන්න",
    closePopup: "එන්නත් කවුළුව වසන්න",

    loadingRecords: "එන්නත් වාර්තා පූරණය වෙමින් පවතී...",
    authRequired: "ඔබ සත්‍යාපනය වී නොමැත.",
    loadFailed: "එන්නත් විස්තර පූරණය කිරීමට අසමත් විය.",

    noCardsPrefix: "",
    noCardsSuffix: "එන්නත් කාඩ්පත් නොමැත.",

    noType: "වර්ගයක් නොමැත",
    dose: "මාත්‍රාව",
    dueDate: "නියමිත දිනය",
    injectionDate: "එන්නත් කළ දිනය",
    completedDate: "සම්පූර්ණ කළ දිනය",
    location: "ස්ථානය",
    midwifeNote: "පවුල් සෞඛ්‍ය සේවිකාවේ සටහන",
    emptyValue: "-",

    status: {
      PENDING: "බලාපොරොත්තුවෙන්",
      COMPLETED: "සම්පූර්ණයි",
      MISSED: "මඟහැරී ඇත",
    },
  },

  ta: {
    popupTitle: "என் தடுப்பூசிகள்",
    popupDescription: "உங்கள் தாதியால் ஒதுக்கப்பட்ட தடுப்பூசி அட்டைகளைப் பார்க்கவும்",
    closePopup: "தடுப்பூசி சாளரத்தை மூடவும்",

    loadingRecords: "தடுப்பூசி பதிவுகள் ஏற்றப்படுகின்றன...",
    authRequired: "நீங்கள் அங்கீகரிக்கப்படவில்லை.",
    loadFailed: "தடுப்பூசி விவரங்களை ஏற்ற முடியவில்லை.",

    noCardsPrefix: "",
    noCardsSuffix: "தடுப்பூசி அட்டைகள் இல்லை.",

    noType: "வகை இல்லை",
    dose: "மருந்தளவு",
    dueDate: "கடைசி தேதி",
    injectionDate: "தடுப்பூசி செலுத்திய தேதி",
    completedDate: "நிறைவு தேதி",
    location: "இடம்",
    midwifeNote: "தாதியின் குறிப்பு",
    emptyValue: "-",

    status: {
      PENDING: "நிலுவையில்",
      COMPLETED: "நிறைவு",
      MISSED: "தவறியது",
    },
  },
};