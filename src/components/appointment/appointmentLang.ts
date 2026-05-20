import type { LanguageCode } from "@/components/common/useLanguage";

type AppointmentTranslation = {
  requestAppointment: string;
  scheduledAppointments: string;

  requestDescription: string;
  scheduledDescription: string;

  failedToLoadRequestData: string;
  failedToLoadAppointments: string;
  failedToCancelAppointment: string;
  failedToCompleteAppointment: string;
  failedToDeleteAppointment: string;
  failedToSubmitRequest: string;

  appointmentCanceled: string;
  appointmentCompleted: string;
  appointmentDeleted: string;
  appointmentRemovedLocally: string;
  appointmentSubmitted: string;

  currentScheduledAppointments: string;
};

export const appointmentTranslations: Record<
  LanguageCode,
  AppointmentTranslation
> = {
  en: {
    requestAppointment: "Request Appointment",
    scheduledAppointments: "Scheduled Appointments",

    requestDescription: "Submit an appointment request to your midwife.",
    scheduledDescription: "View your scheduled appointments from your midwife.",

    failedToLoadRequestData: "Failed to load appointment request data.",
    failedToLoadAppointments: "Failed to load appointments.",
    failedToCancelAppointment: "Failed to cancel appointment.",
    failedToCompleteAppointment: "Failed to complete appointment.",
    failedToDeleteAppointment: "Failed to delete appointment.",
    failedToSubmitRequest: "Failed to submit appointment request.",

    appointmentCanceled: "Appointment canceled.",
    appointmentCompleted: "Appointment marked as completed.",
    appointmentDeleted: "Appointment deleted.",
    appointmentRemovedLocally: "Appointment removed locally.",
    appointmentSubmitted: "Appointment request submitted successfully.",

    currentScheduledAppointments: "Current scheduled appointments",
  },

  si: {
    requestAppointment: "හමුවීමක් ඉල්ලන්න",
    scheduledAppointments: "නියමිත හමුවීම්",

    requestDescription: "ඔබගේ පවුල් සෞඛ්‍ය සේවිකාවට හමුවීම් ඉල්ලීමක් යවන්න.",
    scheduledDescription: "ඔබගේ පවුල් සෞඛ්‍ය සේවිකාවගෙන් ලැබුණු නියමිත හමුවීම් බලන්න.",

    failedToLoadRequestData: "හමුවීම් ඉල්ලීම් දත්ත පූරණය කිරීමට අසමත් විය.",
    failedToLoadAppointments: "හමුවීම් පූරණය කිරීමට අසමත් විය.",
    failedToCancelAppointment: "හමුවීම අවලංගු කිරීමට අසමත් විය.",
    failedToCompleteAppointment: "හමුවීම සම්පූර්ණ ලෙස සලකුණු කිරීමට අසමත් විය.",
    failedToDeleteAppointment: "හමුවීම මකා දැමීමට අසමත් විය.",
    failedToSubmitRequest: "හමුවීම් ඉල්ලීම යැවීමට අසමත් විය.",

    appointmentCanceled: "හමුවීම අවලංගු කරන ලදී.",
    appointmentCompleted: "හමුවීම සම්පූර්ණ ලෙස සලකුණු කරන ලදී.",
    appointmentDeleted: "හමුවීම මකා දමන ලදී.",
    appointmentRemovedLocally: "හමුවීම දේශීයව ඉවත් කරන ලදී.",
    appointmentSubmitted: "හමුවීම් ඉල්ලීම සාර්ථකව යවන ලදී.",

    currentScheduledAppointments: "වත්මන් නියමිත හමුවීම්",
  },

  ta: {
    requestAppointment: "சந்திப்பை கோரவும்",
    scheduledAppointments: "திட்டமிடப்பட்ட சந்திப்புகள்",

    requestDescription: "உங்கள் தாதியிடம் சந்திப்பு கோரிக்கையை சமர்ப்பிக்கவும்.",
    scheduledDescription: "உங்கள் தாதியிடமிருந்து திட்டமிடப்பட்ட சந்திப்புகளைப் பார்க்கவும்.",

    failedToLoadRequestData: "சந்திப்பு கோரிக்கை தரவை ஏற்ற முடியவில்லை.",
    failedToLoadAppointments: "சந்திப்புகளை ஏற்ற முடியவில்லை.",
    failedToCancelAppointment: "சந்திப்பை ரத்து செய்ய முடியவில்லை.",
    failedToCompleteAppointment: "சந்திப்பை நிறைவு செய்ததாக குறிக்க முடியவில்லை.",
    failedToDeleteAppointment: "சந்திப்பை நீக்க முடியவில்லை.",
    failedToSubmitRequest: "சந்திப்பு கோரிக்கையை சமர்ப்பிக்க முடியவில்லை.",

    appointmentCanceled: "சந்திப்பு ரத்து செய்யப்பட்டது.",
    appointmentCompleted: "சந்திப்பு நிறைவு செய்யப்பட்டதாக குறிக்கப்பட்டது.",
    appointmentDeleted: "சந்திப்பு நீக்கப்பட்டது.",
    appointmentRemovedLocally: "சந்திப்பு உள்ளூரில் அகற்றப்பட்டது.",
    appointmentSubmitted: "சந்திப்பு கோரிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.",

    currentScheduledAppointments: "தற்போதைய திட்டமிடப்பட்ட சந்திப்புகள்",
  },
};