import type { LanguageCode } from "@/components/common/useLanguage";

type ProfileTranslations = {
  pageTitle: string;

  header: {
    district: string;
    mohArea: string;
  };

  personalInfo: {
    title: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
    nationalIdNumber: string;
    address: string;
    area: string;
    district: string;
    mohArea: string;
    locationOnMap: string;
    locationHelp: string;
    useCurrentLocation: string;
    gettingLocation: string;
    hideMapPicker: string;
    pickOnMap: string;
    latitude: string;
    longitude: string;
    saving: string;
    saveChanges: string;
    currentLocationLoaded: string;
    locationSelectedFromMap: string;
    geolocationNotSupported: string;
    failedToGetCurrentLocation: string;
    profileUpdated: string;
    failedToUpdateProfile: string;
  };

  profileImage: {
    title: string;
    acceptedFormats: string;
    storedPath: string;
    chooseFile: string;
    selected: string;
    uploading: string;
    uploadUpdate: string;
    invalidFileType: string;
    fileTooLarge: string;
    sessionNotReady: string;
    chooseImageFirst: string;
    uploadSuccess: string;
    uploadFailed: string;
    profilePreviewAlt: string;
    profileImageAlt: string;
  };

  changeEmail: {
    title: string;
    newEmail: string;
    confirmWithPassword: string;
    newEmailPlaceholder: string;
    passwordPlaceholder: string;
    updating: string;
    changeEmail: string;
    fillAllFields: string;
    emailUpdatedTitle: string;
    emailUpdatedDescription1: string;
    emailUpdatedDescription2: string;
    logout: string;
    close: string;
    failedToChangeEmail: string;
    sessionExpiredTitle: string;
    sessionExpiredDescription1: string;
    sessionExpiredDescription2: string;
    signInAgain: string;
  };

  changePassword: {
    title: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    currentPasswordPlaceholder: string;
    newPasswordPlaceholder: string;
    confirmNewPasswordPlaceholder: string;
    updating: string;
    updatePassword: string;
    failedToChangePassword: string;
  };

  changeRole: {
    title: string;
    currentStage: string;
    selectNewStage: string;
    saving: string;
    saveStage: string;
    selectStageError: string;
    stageUpgradedTitle: string;
    stageUpgradedDescription1: string;
    stageUpgradedDescription2: string;
    logout: string;
    close: string;
    failedToUpdateStage: string;
    stages: Record<string, string>;
  };

  deleteAccount: {
    title: string;
    warning1: string;
    warningPermanent: string;
    warning2: string;
    deleteMyAccount: string;
    confirmQuestion: string;
    cancel: string;
    deleting: string;
    yesDelete: string;
    sessionNotReady: string;
  };

  dashboard: {
    unauthenticated: string;
    failedToLoadProfile: string;
  };

  map: {
    instruction: string;
    selectedLocation: string;
    latitude: string;
    longitude: string;
  };
};

export const profileTranslations: Record<LanguageCode, ProfileTranslations> = {
  en: {
    pageTitle: "My Profile",

    header: {
      district: "District",
      mohArea: "MOH Area",
    },

    personalInfo: {
      title: "Personal Info",
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      dateOfBirth: "Date of Birth",
      nationalIdNumber: "National ID Number",
      address: "Address",
      area: "Area",
      district: "District",
      mohArea: "MOH Area",
      locationOnMap: "Location on Map",
      locationHelp:
        "Click on the map to choose your location, or use your current device location.",
      useCurrentLocation: "Use My Current Location",
      gettingLocation: "Getting Location...",
      hideMapPicker: "Hide Map Picker",
      pickOnMap: "Pick on Map",
      latitude: "Latitude",
      longitude: "Longitude",
      saving: "Saving...",
      saveChanges: "Save Changes",
      currentLocationLoaded: "Current location loaded successfully.",
      locationSelectedFromMap: "Location selected from map.",
      geolocationNotSupported: "Geolocation is not supported by this browser.",
      failedToGetCurrentLocation: "Failed to get current location.",
      profileUpdated: "Profile updated successfully!",
      failedToUpdateProfile: "Failed to update profile.",
    },

    profileImage: {
      title: "Profile Image",
      acceptedFormats: "Accepted formats: JPG, PNG, WEBP (max 5MB)",
      storedPath: "Stored path",
      chooseFile: "Choose File",
      selected: "Selected",
      uploading: "Uploading...",
      uploadUpdate: "Upload / Update",
      invalidFileType: "Please select a JPG, PNG, or WEBP image.",
      fileTooLarge: "Image must be smaller than 5MB.",
      sessionNotReady: "Profile session is not ready. Please refresh and try again.",
      chooseImageFirst: "Please choose an image first.",
      uploadSuccess: "Profile image updated successfully.",
      uploadFailed: "Failed to upload image.",
      profilePreviewAlt: "Profile preview",
      profileImageAlt: "Profile image",
    },

    changeEmail: {
      title: "Change Email",
      newEmail: "New Email",
      confirmWithPassword: "Confirm with Password",
      newEmailPlaceholder: "newemail@example.com",
      passwordPlaceholder: "Enter your password",
      updating: "Updating...",
      changeEmail: "Change Email",
      fillAllFields: "Please fill in all fields.",
      emailUpdatedTitle: "Email Updated",
      emailUpdatedDescription1: "Your email has been changed successfully.",
      emailUpdatedDescription2:
        "Please log out and sign in again with your new email.",
      logout: "Logout",
      close: "Close",
      failedToChangeEmail: "Failed to change email",
      sessionExpiredTitle: "Session Expired",
      sessionExpiredDescription1:
        "Your email may have been updated, but your session is no longer valid.",
      sessionExpiredDescription2: "Please sign in again with your new email.",
      signInAgain: "Sign In Again",
    },

    changePassword: {
      title: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      currentPasswordPlaceholder: "Enter current password",
      newPasswordPlaceholder: "Enter new password",
      confirmNewPasswordPlaceholder: "Enter confirm new password",
      updating: "Updating...",
      updatePassword: "Update Password",
      failedToChangePassword: "Failed to change password",
    },

    changeRole: {
      title: "Upgrade Stages",
      currentStage: "Current Stage",
      selectNewStage: "Select New Stage",
      saving: "Saving...",
      saveStage: "Save Stage",
      selectStageError: "Please select a stage.",
      stageUpgradedTitle: "Stage Upgraded",
      stageUpgradedDescription1: "You have upgraded to",
      stageUpgradedDescription2: "Please log out and sign in again as",
      logout: "Logout",
      close: "Close",
      failedToUpdateStage: "Failed to update stage",
      stages: {
        HOPE_TO_PREGNANT_MOTHER: "Hope To Pregnant Mother",
        PREGNANT_MOTHER: "Pregnant Mother",
        POST_PREGNANT_MOTHER: "Post Pregnant Mother",
      },
    },

    deleteAccount: {
      title: "Delete Account",
      warning1: "This action is",
      warningPermanent: "permanent",
      warning2: "and cannot be undone. All your data will be removed.",
      deleteMyAccount: "Delete My Account",
      confirmQuestion: "Are you absolutely sure?",
      cancel: "Cancel",
      deleting: "Deleting...",
      yesDelete: "Yes, Delete",
      sessionNotReady: "Profile session is not ready. Please refresh and try again.",
    },

    dashboard: {
      unauthenticated: "You are not authenticated. Please sign in again.",
      failedToLoadProfile: "Failed to load profile data.",
    },

    map: {
      instruction: "Click on the map to choose your location",
      selectedLocation: "Selected Location",
      latitude: "Lat",
      longitude: "Lng",
    },
  },

  si: {
    pageTitle: "මගේ පැතිකඩ",

    header: {
      district: "දිස්ත්‍රික්කය",
      mohArea: "MOH ප්‍රදේශය",
    },

    personalInfo: {
      title: "පුද්ගලික තොරතුරු",
      firstName: "මුල් නම",
      lastName: "අවසන් නම",
      phoneNumber: "දුරකථන අංකය",
      dateOfBirth: "උපන් දිනය",
      nationalIdNumber: "ජාතික හැඳුනුම්පත් අංකය",
      address: "ලිපිනය",
      area: "ප්‍රදේශය",
      district: "දිස්ත්‍රික්කය",
      mohArea: "MOH ප්‍රදේශය",
      locationOnMap: "සිතියමේ ස්ථානය",
      locationHelp:
        "ඔබගේ ස්ථානය තෝරා ගැනීමට සිතියම මත ක්ලික් කරන්න, නැතහොත් වත්මන් උපාංග ස්ථානය භාවිත කරන්න.",
      useCurrentLocation: "මගේ වත්මන් ස්ථානය භාවිත කරන්න",
      gettingLocation: "ස්ථානය ලබා ගනිමින්...",
      hideMapPicker: "සිතියම් තෝරනය සඟවන්න",
      pickOnMap: "සිතියමෙන් තෝරන්න",
      latitude: "අක්ෂාංශ",
      longitude: "දේශාංශ",
      saving: "සුරකිමින්...",
      saveChanges: "වෙනස්කම් සුරකින්න",
      currentLocationLoaded: "වත්මන් ස්ථානය සාර්ථකව ලබා ගන්නා ලදී.",
      locationSelectedFromMap: "සිතියමෙන් ස්ථානය තෝරා ගන්නා ලදී.",
      geolocationNotSupported: "මෙම බ්‍රවුසරය භූ-ස්ථාන පහසුකමට සහාය නොදක්වයි.",
      failedToGetCurrentLocation: "වත්මන් ස්ථානය ලබා ගැනීමට නොහැකි විය.",
      profileUpdated: "පැතිකඩ සාර්ථකව යාවත්කාලීන කරන ලදී!",
      failedToUpdateProfile: "පැතිකඩ යාවත්කාලීන කිරීමට නොහැකි විය.",
    },

    profileImage: {
      title: "පැතිකඩ රූපය",
      acceptedFormats: "පිළිගත් ආකෘති: JPG, PNG, WEBP (උපරිම 5MB)",
      storedPath: "සුරකින ලද මාර්ගය",
      chooseFile: "ගොනුව තෝරන්න",
      selected: "තෝරාගෙන ඇත",
      uploading: "උඩුගත කරමින්...",
      uploadUpdate: "උඩුගත / යාවත්කාලීන කරන්න",
      invalidFileType: "කරුණාකර JPG, PNG, හෝ WEBP රූපයක් තෝරන්න.",
      fileTooLarge: "රූපය 5MB ට වඩා කුඩා විය යුතුය.",
      sessionNotReady:
        "පැතිකඩ සැසිය සූදානම් නැත. කරුණාකර පිටුව නැවත පූරණය කර නැවත උත්සාහ කරන්න.",
      chooseImageFirst: "කරුණාකර පළමුව රූපයක් තෝරන්න.",
      uploadSuccess: "පැතිකඩ රූපය සාර්ථකව යාවත්කාලීන කරන ලදී.",
      uploadFailed: "රූපය උඩුගත කිරීමට නොහැකි විය.",
      profilePreviewAlt: "පැතිකඩ පෙරදසුන",
      profileImageAlt: "පැතිකඩ රූපය",
    },

    changeEmail: {
      title: "ඊමේල් වෙනස් කරන්න",
      newEmail: "නව ඊමේල්",
      confirmWithPassword: "මුරපදය සමඟ තහවුරු කරන්න",
      newEmailPlaceholder: "newemail@example.com",
      passwordPlaceholder: "ඔබගේ මුරපදය ඇතුළත් කරන්න",
      updating: "යාවත්කාලීන කරමින්...",
      changeEmail: "ඊමේල් වෙනස් කරන්න",
      fillAllFields: "කරුණාකර සියලුම ක්ෂේත්‍ර පුරවන්න.",
      emailUpdatedTitle: "ඊමේල් යාවත්කාලීන කරන ලදී",
      emailUpdatedDescription1: "ඔබගේ ඊමේල් සාර්ථකව වෙනස් කර ඇත.",
      emailUpdatedDescription2:
        "කරුණාකර පිටවී නව ඊමේල් සමඟ නැවත පුරන්න.",
      logout: "පිටවන්න",
      close: "වසන්න",
      failedToChangeEmail: "ඊමේල් වෙනස් කිරීමට නොහැකි විය",
      sessionExpiredTitle: "සැසිය කල් ඉකුත් වී ඇත",
      sessionExpiredDescription1:
        "ඔබගේ ඊමේල් යාවත්කාලීන වී තිබිය හැකි නමුත් ඔබගේ සැසිය තවදුරටත් වලංගු නොවේ.",
      sessionExpiredDescription2:
        "කරුණාකර නව ඊමේල් සමඟ නැවත පුරන්න.",
      signInAgain: "නැවත පුරන්න",
    },

    changePassword: {
      title: "මුරපදය වෙනස් කරන්න",
      currentPassword: "වත්මන් මුරපදය",
      newPassword: "නව මුරපදය",
      confirmNewPassword: "නව මුරපදය තහවුරු කරන්න",
      currentPasswordPlaceholder: "වත්මන් මුරපදය ඇතුළත් කරන්න",
      newPasswordPlaceholder: "නව මුරපදය ඇතුළත් කරන්න",
      confirmNewPasswordPlaceholder: "නව මුරපදය තහවුරු කරන්න",
      updating: "යාවත්කාලීන කරමින්...",
      updatePassword: "මුරපදය යාවත්කාලීන කරන්න",
      failedToChangePassword: "මුරපදය වෙනස් කිරීමට නොහැකි විය",
    },

    changeRole: {
      title: "අදියර උසස් කරන්න",
      currentStage: "වත්මන් අදියර",
      selectNewStage: "නව අදියර තෝරන්න",
      saving: "සුරකිමින්...",
      saveStage: "අදියර සුරකින්න",
      selectStageError: "කරුණාකර අදියරක් තෝරන්න.",
      stageUpgradedTitle: "අදියර උසස් කරන ලදී",
      stageUpgradedDescription1: "ඔබ උසස් කරන ලද්දේ",
      stageUpgradedDescription2: "කරුණාකර පිටවී නැවත පුරන්න",
      logout: "පිටවන්න",
      close: "වසන්න",
      failedToUpdateStage: "අදියර යාවත්කාලීන කිරීමට නොහැකි විය",
      stages: {
        HOPE_TO_PREGNANT_MOTHER: "ගර්භණී වීමට බලාපොරොත්තු වන මව",
        PREGNANT_MOTHER: "ගර්භණී මව",
        POST_PREGNANT_MOTHER: "ප්‍රසවයෙන් පසු මව",
      },
    },

    deleteAccount: {
      title: "ගිණුම මකන්න",
      warning1: "මෙම ක්‍රියාව",
      warningPermanent: "ස්ථිරයි",
      warning2: "සහ ආපසු හැරවිය නොහැක. ඔබගේ සියලු දත්ත ඉවත් කරනු ලැබේ.",
      deleteMyAccount: "මගේ ගිණුම මකන්න",
      confirmQuestion: "ඔබට සම්පූර්ණයෙන්ම විශ්වාසද?",
      cancel: "අවලංගු කරන්න",
      deleting: "මකමින්...",
      yesDelete: "ඔව්, මකන්න",
      sessionNotReady:
        "පැතිකඩ සැසිය සූදානම් නැත. කරුණාකර පිටුව නැවත පූරණය කර නැවත උත්සාහ කරන්න.",
    },

    dashboard: {
      unauthenticated: "ඔබ සත්‍යාපනය වී නැත. කරුණාකර නැවත පුරන්න.",
      failedToLoadProfile: "පැතිකඩ දත්ත පූරණය කිරීමට නොහැකි විය.",
    },

    map: {
      instruction: "ඔබගේ ස්ථානය තෝරා ගැනීමට සිතියම මත ක්ලික් කරන්න",
      selectedLocation: "තෝරාගත් ස්ථානය",
      latitude: "අක්ෂාංශ",
      longitude: "දේශාංශ",
    },
  },

  ta: {
    pageTitle: "என் சுயவிவரம்",

    header: {
      district: "மாவட்டம்",
      mohArea: "MOH பகுதி",
    },

    personalInfo: {
      title: "தனிப்பட்ட தகவல்கள்",
      firstName: "முதல் பெயர்",
      lastName: "கடைசி பெயர்",
      phoneNumber: "தொலைபேசி எண்",
      dateOfBirth: "பிறந்த தேதி",
      nationalIdNumber: "தேசிய அடையாள அட்டை எண்",
      address: "முகவரி",
      area: "பகுதி",
      district: "மாவட்டம்",
      mohArea: "MOH பகுதி",
      locationOnMap: "வரைபடத்தில் இருப்பிடம்",
      locationHelp:
        "உங்கள் இருப்பிடத்தைத் தேர்ந்தெடுக்க வரைபடத்தில் கிளிக் செய்யவும், அல்லது உங்கள் தற்போதைய சாதன இருப்பிடத்தைப் பயன்படுத்தவும்.",
      useCurrentLocation: "என் தற்போதைய இருப்பிடத்தைப் பயன்படுத்தவும்",
      gettingLocation: "இருப்பிடம் பெறப்படுகிறது...",
      hideMapPicker: "வரைபடத் தேர்வை மறைக்கவும்",
      pickOnMap: "வரைபடத்தில் தேர்ந்தெடுக்கவும்",
      latitude: "அட்சரேகை",
      longitude: "தீர்க்கரேகை",
      saving: "சேமிக்கப்படுகிறது...",
      saveChanges: "மாற்றங்களைச் சேமிக்கவும்",
      currentLocationLoaded: "தற்போதைய இருப்பிடம் வெற்றிகரமாக பெறப்பட்டது.",
      locationSelectedFromMap: "வரைபடத்திலிருந்து இருப்பிடம் தேர்ந்தெடுக்கப்பட்டது.",
      geolocationNotSupported:
        "இந்த உலாவி புவியிடத்தை ஆதரிக்கவில்லை.",
      failedToGetCurrentLocation: "தற்போதைய இருப்பிடத்தைப் பெற முடியவில்லை.",
      profileUpdated: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
      failedToUpdateProfile: "சுயவிவரத்தை புதுப்பிக்க முடியவில்லை.",
    },

    profileImage: {
      title: "சுயவிவர படம்",
      acceptedFormats: "ஏற்றுக்கொள்ளப்படும் வடிவங்கள்: JPG, PNG, WEBP (அதிகபட்சம் 5MB)",
      storedPath: "சேமிக்கப்பட்ட பாதை",
      chooseFile: "கோப்பைத் தேர்ந்தெடுக்கவும்",
      selected: "தேர்ந்தெடுக்கப்பட்டது",
      uploading: "பதிவேற்றப்படுகிறது...",
      uploadUpdate: "பதிவேற்றம் / புதுப்பிப்பு",
      invalidFileType: "JPG, PNG அல்லது WEBP படத்தைத் தேர்ந்தெடுக்கவும்.",
      fileTooLarge: "படம் 5MB-க்கும் குறைவாக இருக்க வேண்டும்.",
      sessionNotReady:
        "சுயவிவர அமர்வு தயாராக இல்லை. பக்கத்தைப் புதுப்பித்து மீண்டும் முயற்சிக்கவும்.",
      chooseImageFirst: "முதலில் ஒரு படத்தைத் தேர்ந்தெடுக்கவும்.",
      uploadSuccess: "சுயவிவர படம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
      uploadFailed: "படத்தை பதிவேற்ற முடியவில்லை.",
      profilePreviewAlt: "சுயவிவர முன்னோட்டம்",
      profileImageAlt: "சுயவிவர படம்",
    },

    changeEmail: {
      title: "மின்னஞ்சலை மாற்றவும்",
      newEmail: "புதிய மின்னஞ்சல்",
      confirmWithPassword: "கடவுச்சொல்லுடன் உறுதிப்படுத்தவும்",
      newEmailPlaceholder: "newemail@example.com",
      passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
      updating: "புதுப்பிக்கப்படுகிறது...",
      changeEmail: "மின்னஞ்சலை மாற்றவும்",
      fillAllFields: "அனைத்து புலங்களையும் நிரப்பவும்.",
      emailUpdatedTitle: "மின்னஞ்சல் புதுப்பிக்கப்பட்டது",
      emailUpdatedDescription1: "உங்கள் மின்னஞ்சல் வெற்றிகரமாக மாற்றப்பட்டது.",
      emailUpdatedDescription2:
        "புதிய மின்னஞ்சலுடன் மீண்டும் உள்நுழைய தயவுசெய்து வெளியேறவும்.",
      logout: "வெளியேறு",
      close: "மூடு",
      failedToChangeEmail: "மின்னஞ்சலை மாற்ற முடியவில்லை",
      sessionExpiredTitle: "அமர்வு காலாவதியானது",
      sessionExpiredDescription1:
        "உங்கள் மின்னஞ்சல் புதுப்பிக்கப்பட்டிருக்கலாம், ஆனால் உங்கள் அமர்வு இனி செல்லுபடியாகாது.",
      sessionExpiredDescription2:
        "புதிய மின்னஞ்சலுடன் மீண்டும் உள்நுழையவும்.",
      signInAgain: "மீண்டும் உள்நுழைக",
    },

    changePassword: {
      title: "கடவுச்சொல்லை மாற்றவும்",
      currentPassword: "தற்போதைய கடவுச்சொல்",
      newPassword: "புதிய கடவுச்சொல்",
      confirmNewPassword: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
      currentPasswordPlaceholder: "தற்போதைய கடவுச்சொல்லை உள்ளிடவும்",
      newPasswordPlaceholder: "புதிய கடவுச்சொல்லை உள்ளிடவும்",
      confirmNewPasswordPlaceholder: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
      updating: "புதுப்பிக்கப்படுகிறது...",
      updatePassword: "கடவுச்சொல்லை புதுப்பிக்கவும்",
      failedToChangePassword: "கடவுச்சொல்லை மாற்ற முடியவில்லை",
    },

    changeRole: {
      title: "நிலைகளை மேம்படுத்தவும்",
      currentStage: "தற்போதைய நிலை",
      selectNewStage: "புதிய நிலையைத் தேர்ந்தெடுக்கவும்",
      saving: "சேமிக்கப்படுகிறது...",
      saveStage: "நிலையைச் சேமிக்கவும்",
      selectStageError: "ஒரு நிலையைத் தேர்ந்தெடுக்கவும்.",
      stageUpgradedTitle: "நிலை மேம்படுத்தப்பட்டது",
      stageUpgradedDescription1: "நீங்கள் மேம்படுத்தப்பட்ட நிலை",
      stageUpgradedDescription2: "தயவுசெய்து வெளியேறி மீண்டும் உள்நுழைக",
      logout: "வெளியேறு",
      close: "மூடு",
      failedToUpdateStage: "நிலையை புதுப்பிக்க முடியவில்லை",
      stages: {
        HOPE_TO_PREGNANT_MOTHER: "கர்ப்பமாக விரும்பும் தாய்",
        PREGNANT_MOTHER: "கர்ப்பிணித் தாய்",
        POST_PREGNANT_MOTHER: "பிறப்புக்குப் பிந்தைய தாய்",
      },
    },

    deleteAccount: {
      title: "கணக்கை நீக்கவும்",
      warning1: "இந்த செயல்",
      warningPermanent: "நிரந்தரமானது",
      warning2:
        "மற்றும் மீட்டெடுக்க முடியாது. உங்கள் அனைத்து தரவுகளும் அகற்றப்படும்.",
      deleteMyAccount: "என் கணக்கை நீக்கு",
      confirmQuestion: "உங்களுக்கு முழுமையாக உறுதியா?",
      cancel: "ரத்து செய்",
      deleting: "நீக்கப்படுகிறது...",
      yesDelete: "ஆம், நீக்கு",
      sessionNotReady:
        "சுயவிவர அமர்வு தயாராக இல்லை. பக்கத்தைப் புதுப்பித்து மீண்டும் முயற்சிக்கவும்.",
    },

    dashboard: {
      unauthenticated: "நீங்கள் அங்கீகரிக்கப்படவில்லை. மீண்டும் உள்நுழையவும்.",
      failedToLoadProfile: "சுயவிவரத் தரவை ஏற்ற முடியவில்லை.",
    },

    map: {
      instruction: "உங்கள் இருப்பிடத்தைத் தேர்ந்தெடுக்க வரைபடத்தில் கிளிக் செய்யவும்",
      selectedLocation: "தேர்ந்தெடுக்கப்பட்ட இருப்பிடம்",
      latitude: "அட்சரேகை",
      longitude: "தீர்க்கரேகை",
    },
  },
};