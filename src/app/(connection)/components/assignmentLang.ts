import type { LanguageCode } from "@/components/common/useLanguage";

export type AssignmentTranslations = {
  common: {
    close: string;
    loading: string;
    search: string;
    searching: string;
    view: string;
    sendRequest: string;
    sending: string;
    cancel: string;
    approve: string;
    reject: string;
    method: string;
    message: string;
    created: string;
    responded: string;
    status: string;
    address: string;
    area: string;
    district: string;
    mohArea: string;
    latitude: string;
    longitude: string;
    email: string;
    role: string;
    roles: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    optionalMessage: string;
    noMatchingResults: string;
    selectDistrictFirst: string;
    loadingDistricts: string;
    loadingMohAreas: string;
    selectOrTypeDistrict: string;
    selectOrTypeMohArea: string;
    targetEmail: string;
    targetArea: string;
    exampleEmail: string;
    unavailable: string;
  };
  status: {
    PENDING: string;
    APPROVED: string;
    REJECTED: string;
    ASSIGNED: string;
    AVAILABLE: string;
  };
  roleLabels: {
    MIDWIFE: string;
    PREGNANT_MOTHER: string;
    POST_PREGNANT_MOTHER: string;
    HOPE_TO_PREGNANT_MOTHER: string;
  };
  header: {
    midwifeTitle: string;
    motherTitle: string;
    defaultTitle: string;
    midwifeDescription: string;
    motherDescription: string;
    defaultDescription: string;
  };
  tabs: {
    searchConnect: string;
    assignment: string;
    requests: string;
    updateProfile: string;
  };
  searchConnect: {
    searchMothersTitle: string;
    searchMidwivesTitle: string;
    searchUsersTitle: string;
    searchResultsOpenPopup: string;
    mothersMapTitle: string;
    midwivesMapTitle: string;
    mapSearchTitle: string;
    loadMap: string;
    loadingMap: string;
    noMappableUsers: string;
    manualConnectionRequest: string;
    searchResults: string;
    noAvailableUsers: string;
  };
  assignment: {
    myAssignment: string;
    noMidwifeAssigned: string;
    totalAssignedUsers: string;
    noUsersAssigned: string;
    noAssignmentView: string;
    cancelAssignment: string;
    chooseAssignedUser: string;
    updateAssignedMotherProfile: string;
    selectAssignedUser: string;
    updateProfile: string;
  };
  requests: {
    receivedRequests: string;
    sentRequests: string;
    noReceivedRequests: string;
    noSentRequests: string;
    requestDetails: string;
    matchedArea: string;
    cancelRequest: string;
  };
  details: {
    userDetails: string;
    locationDetails: string;
    midwifeName: string;
    assignedMidwife: string;
  };
  map: {
    allRegisteredMidwivesTitle: string;
    allRegisteredPatientsTitle: string;
    allRegisteredMidwivesSubtitle: string;
    allRegisteredPatientsSubtitle: string;
    mapView: string;
    mapHelp: string;
    totalUsersOnMap: string;
    loadingMap: string;
    noUsersWithCoordinates: string;
    registeredMidwivesMap: string;
    registeredPatientsMap: string;
    nearbyRegisteredMidwives: string;
    nearbyRegisteredPatients: string;
    loadingMidwivesMap: string;
    loadingPatientsMap: string;
    unableToLoadMap: string;
  };
  messages: {
    targetEmailRequired: string;
    targetAreaRequired: string;
    districtRequired: string;
    mohAreaRequired: string;
    failedLoadData: string;
    failedSendRequest: string;
    failedSearchUsers: string;
    failedSearchMapUsers: string;
    failedApproveRequest: string;
    failedRejectRequest: string;
    failedCancelRequest: string;
    failedCancelAssignedMidwife: string;
    failedCancelAssignedMother: string;
    failedUpdateAssignedUser: string;
    failedLoadMapData: string;
    requestCannotBeSent: string;
    selectAssignedUserFirst: string;
    requestApproved: string;
    requestRejected: string;
    requestCancelled: string;
    assignedMidwifeCancelled: string;
    assignedMotherCancelled: string;
    assignedUserUpdated: string;
    createdRequests: (count: number) => string;
    foundUsers: (count: number) => string;
    foundMappableUsers: (count: number) => string;
    connectionRequestTo: (name: string) => string;
    connectionRequestToMidwife: (name: string) => string;
    connectionRequestToPatient: (name: string) => string;
    notAuthenticated: string;
    noPermissionMap: string;
  };
};

export const assignmentTranslations: Record<LanguageCode, AssignmentTranslations> = {
  en: {
    common: {
      close: "Close",
      loading: "Loading...",
      search: "Search",
      searching: "Searching...",
      view: "View",
      sendRequest: "Send Request",
      sending: "Sending...",
      cancel: "Cancel",
      approve: "Approve",
      reject: "Reject",
      method: "Method",
      message: "Message",
      created: "Created",
      responded: "Responded",
      status: "Status",
      address: "Address",
      area: "Area",
      district: "District",
      mohArea: "MOH Area",
      latitude: "Latitude",
      longitude: "Longitude",
      email: "Email",
      role: "Role",
      roles: "Roles",
      firstName: "First name",
      lastName: "Last name",
      phoneNumber: "Phone number",
      optionalMessage: "Optional message",
      noMatchingResults: "No matching results",
      selectDistrictFirst: "Select district first",
      loadingDistricts: "Loading districts...",
      loadingMohAreas: "Loading MOH areas...",
      selectOrTypeDistrict: "Select or type district",
      selectOrTypeMohArea: "Select or type MOH area",
      targetEmail: "Target Email",
      targetArea: "Target Area",
      exampleEmail: "example@email.com",
      unavailable: "-",
    },
    status: {
      PENDING: "Pending",
      APPROVED: "Approved",
      REJECTED: "Rejected",
      ASSIGNED: "Assigned",
      AVAILABLE: "Available",
    },
    roleLabels: {
      MIDWIFE: "Midwife",
      PREGNANT_MOTHER: "Pregnant Mother",
      POST_PREGNANT_MOTHER: "Post Pregnant Mother",
      HOPE_TO_PREGNANT_MOTHER: "Hope To Pregnant Mother",
    },
    header: {
      midwifeTitle: "Mother Connectivity & Assignment Management",
      motherTitle: "Midwife Connectivity & Assignment",
      defaultTitle: "Connectivity & Assignment",
      midwifeDescription:
        "Search mothers by district/MOH, map them, manage requests, review assignments and update assigned mother details.",
      motherDescription:
        "Search midwives by district/MOH, view available midwives on the map, manage connection requests and review your assigned midwife.",
      defaultDescription: "Manage connection requests and assignments.",
    },
    tabs: {
      searchConnect: "Search & Connect",
      assignment: "My Assignment",
      requests: "Received & Sent Requests",
      updateProfile: "Update Assigned Mother Profile",
    },
    searchConnect: {
      searchMothersTitle: "Search Mothers by District & MOH Area",
      searchMidwivesTitle: "Search Midwives by District & MOH Area",
      searchUsersTitle: "Search Users",
      searchResultsOpenPopup: "Search results will open in a popup box.",
      mothersMapTitle: "Map of Mothers in Selected Area",
      midwivesMapTitle: "Map of Midwives in Selected Area",
      mapSearchTitle: "Map Search",
      loadMap: "Load Map",
      loadingMap: "Loading Map...",
      noMappableUsers: "No available mappable users found.",
      manualConnectionRequest: "Manual Connection Request",
      searchResults: "Search Results",
      noAvailableUsers: "No available users found.",
    },
    assignment: {
      myAssignment: "My Assignment",
      noMidwifeAssigned: "No midwife assigned yet.",
      totalAssignedUsers: "Total assigned users",
      noUsersAssigned: "No users assigned yet.",
      noAssignmentView: "No assignment view available.",
      cancelAssignment: "Cancel Assignment",
      chooseAssignedUser: "Choose assigned user",
      updateAssignedMotherProfile: "Update Assigned Mother Profile",
      selectAssignedUser: "Select Assigned User",
      updateProfile: "Update Profile",
    },
    requests: {
      receivedRequests: "Received Requests",
      sentRequests: "Sent Requests",
      noReceivedRequests: "No received requests.",
      noSentRequests: "No sent requests.",
      requestDetails: "Request Details",
      matchedArea: "Matched Area",
      cancelRequest: "Cancel Request",
    },
    details: {
      userDetails: "User Details",
      locationDetails: "Location Details",
      midwifeName: "Midwife Name",
      assignedMidwife: "Assigned Midwife",
    },
    map: {
      allRegisteredMidwivesTitle: "All Registered Midwives on Map",
      allRegisteredPatientsTitle: "All Registered Mothers on Map",
      allRegisteredMidwivesSubtitle:
        "Patients can view every registered midwife with map location details and send requests.",
      allRegisteredPatientsSubtitle:
        "Midwives can view registered mothers with map location details and send requests.",
      mapView: "Map View",
      mapHelp: "Click a marker to view address, district, MOH area and send a request.",
      totalUsersOnMap: "Total users on map",
      loadingMap: "Loading map...",
      noUsersWithCoordinates: "No users with saved coordinates were found.",
      registeredMidwivesMap: "Registered Midwives Map",
      registeredPatientsMap: "Registered Mothers Map",
      nearbyRegisteredMidwives: "View nearby registered midwives",
      nearbyRegisteredPatients: "View nearby registered mothers",
      loadingMidwivesMap: "Loading midwives map...",
      loadingPatientsMap: "Loading mothers map...",
      unableToLoadMap: "Unable to load map.",
    },
    messages: {
      targetEmailRequired: "Target email is required.",
      targetAreaRequired: "Target area is required.",
      districtRequired: "District is required.",
      mohAreaRequired: "MOH area is required.",
      failedLoadData: "Failed to load data",
      failedSendRequest: "Failed to send request",
      failedSearchUsers: "Failed to search users",
      failedSearchMapUsers: "Failed to search map users",
      failedApproveRequest: "Failed to approve request",
      failedRejectRequest: "Failed to reject request",
      failedCancelRequest: "Failed to cancel request",
      failedCancelAssignedMidwife: "Failed to cancel assigned midwife",
      failedCancelAssignedMother: "Failed to cancel assigned mother",
      failedUpdateAssignedUser: "Failed to update assigned user",
      failedLoadMapData: "Failed to load map data",
      requestCannotBeSent: "Request cannot be sent for this user.",
      selectAssignedUserFirst: "Select an assigned user first.",
      requestApproved: "Request approved successfully.",
      requestRejected: "Request rejected successfully.",
      requestCancelled: "Request cancelled successfully.",
      assignedMidwifeCancelled: "Assigned midwife cancelled successfully.",
      assignedMotherCancelled: "Assigned mother cancelled successfully.",
      assignedUserUpdated: "Assigned user's profile updated successfully.",
      createdRequests: (count) => `Created ${count} request(s) successfully.`,
      foundUsers: (count) => `Found ${count} user(s).`,
      foundMappableUsers: (count) => `Found ${count} mappable user(s).`,
      connectionRequestTo: (name) => `Connection request sent to ${name}`,
      connectionRequestToMidwife: (name) => `Connection request sent to midwife ${name}`,
      connectionRequestToPatient: (name) => `Connection request sent to patient ${name}`,
      notAuthenticated: "You are not authenticated. Please sign in again.",
      noPermissionMap: "You do not have permission to view this map.",
    },
  },
  si: {
    common: {
      close: "වසන්න",
      loading: "පූරණය වෙමින්...",
      search: "සොයන්න",
      searching: "සොයමින්...",
      view: "බලන්න",
      sendRequest: "ඉල්ලීම යවන්න",
      sending: "යවමින්...",
      cancel: "අවලංගු කරන්න",
      approve: "අනුමත කරන්න",
      reject: "ප්‍රතික්ෂේප කරන්න",
      method: "ක්‍රමය",
      message: "පණිවිඩය",
      created: "සාදන ලද්දේ",
      responded: "ප්‍රතිචාර දැක්වූයේ",
      status: "තත්ත්වය",
      address: "ලිපිනය",
      area: "ප්‍රදේශය",
      district: "දිස්ත්‍රික්කය",
      mohArea: "MOH ප්‍රදේශය",
      latitude: "අක්ෂාංශය",
      longitude: "දේශාංශය",
      email: "ඊමේල්",
      role: "භූමිකාව",
      roles: "භූමිකා",
      firstName: "මුල් නම",
      lastName: "අවසන් නම",
      phoneNumber: "දුරකථන අංකය",
      optionalMessage: "විකල්ප පණිවිඩය",
      noMatchingResults: "ගැළපෙන ප්‍රතිඵල නොමැත",
      selectDistrictFirst: "පළමුව දිස්ත්‍රික්කය තෝරන්න",
      loadingDistricts: "දිස්ත්‍රික්ක පූරණය වෙමින්...",
      loadingMohAreas: "MOH ප්‍රදේශ පූරණය වෙමින්...",
      selectOrTypeDistrict: "දිස්ත්‍රික්කය තෝරන්න හෝ ටයිප් කරන්න",
      selectOrTypeMohArea: "MOH ප්‍රදේශය තෝරන්න හෝ ටයිප් කරන්න",
      targetEmail: "ඉලක්ක ඊමේල්",
      targetArea: "ඉලක්ක ප්‍රදේශය",
      exampleEmail: "example@email.com",
      unavailable: "-",
    },
    status: {
      PENDING: "බලාපොරොත්තුවෙන්",
      APPROVED: "අනුමතයි",
      REJECTED: "ප්‍රතික්ෂේපයි",
      ASSIGNED: "පවරා ඇත",
      AVAILABLE: "ලබා ගත හැක",
    },
    roleLabels: {
      MIDWIFE: "පවුල් සෞඛ්‍ය සේවිකාව",
      PREGNANT_MOTHER: "ගර්භනී මව",
      POST_PREGNANT_MOTHER: "ප්‍රසවයෙන් පසු මව",
      HOPE_TO_PREGNANT_MOTHER: "ගර්භධාරණය අපේක්ෂා කරන මව",
    },
    header: {
      midwifeTitle: "මව සම්බන්ධතා සහ පැවරීම් කළමනාකරණය",
      motherTitle: "පවුල් සෞඛ්‍ය සේවිකා සම්බන්ධතාව සහ පැවරීම",
      defaultTitle: "සම්බන්ධතා සහ පැවරීම්",
      midwifeDescription:
        "දිස්ත්‍රික්ක/MOH අනුව මව්වරුන් සොයන්න, සිතියමේ බලන්න, ඉල්ලීම් කළමනාකරණය කරන්න, පැවරීම් පරීක්ෂා කරන්න සහ පැවරූ මවගේ විස්තර යාවත්කාලීන කරන්න.",
      motherDescription:
        "දිස්ත්‍රික්ක/MOH අනුව පවුල් සෞඛ්‍ය සේවිකාවන් සොයන්න, සිතියමේ ලබාගත හැකි සේවිකාවන් බලන්න, සම්බන්ධතා ඉල්ලීම් කළමනාකරණය කරන්න සහ ඔබට පවරා ඇති සේවිකාව පරීක්ෂා කරන්න.",
      defaultDescription: "සම්බන්ධතා ඉල්ලීම් සහ පැවරීම් කළමනාකරණය කරන්න.",
    },
    tabs: {
      searchConnect: "සොයන්න සහ සම්බන්ධ කරන්න",
      assignment: "මගේ පැවරීම",
      requests: "ලැබුණු සහ යැවූ ඉල්ලීම්",
      updateProfile: "පවරා ඇති මවගේ පැතිකඩ යාවත්කාලීන කරන්න",
    },
    searchConnect: {
      searchMothersTitle: "දිස්ත්‍රික්කය සහ MOH අනුව මව්වරුන් සොයන්න",
      searchMidwivesTitle: "දිස්ත්‍රික්කය සහ MOH අනුව පවුල් සෞඛ්‍ය සේවිකාවන් සොයන්න",
      searchUsersTitle: "පරිශීලකයින් සොයන්න",
      searchResultsOpenPopup: "සෙවුම් ප්‍රතිඵල popup එකක විවෘත වේ.",
      mothersMapTitle: "තෝරාගත් ප්‍රදේශයේ මව්වරුන්ගේ සිතියම",
      midwivesMapTitle: "තෝරාගත් ප්‍රදේශයේ පවුල් සෞඛ්‍ය සේවිකාවන්ගේ සිතියම",
      mapSearchTitle: "සිතියම් සෙවීම",
      loadMap: "සිතියම පූරණය කරන්න",
      loadingMap: "සිතියම පූරණය වෙමින්...",
      noMappableUsers: "සිතියමේ පෙන්විය හැකි ලබාගත හැකි පරිශීලකයින් නොමැත.",
      manualConnectionRequest: "අතින් සම්බන්ධතා ඉල්ලීම",
      searchResults: "සෙවුම් ප්‍රතිඵල",
      noAvailableUsers: "ලබාගත හැකි පරිශීලකයින් නොමැත.",
    },
    assignment: {
      myAssignment: "මගේ පැවරීම",
      noMidwifeAssigned: "තවම පවුල් සෞඛ්‍ය සේවිකාවක් පවරා නැත.",
      totalAssignedUsers: "මුළු පවරා ඇති පරිශීලකයින්",
      noUsersAssigned: "තවම පරිශීලකයින් පවරා නැත.",
      noAssignmentView: "පැවරීම් දර්ශනයක් නොමැත.",
      cancelAssignment: "පැවරීම අවලංගු කරන්න",
      chooseAssignedUser: "පවරා ඇති පරිශීලකයෙකු තෝරන්න",
      updateAssignedMotherProfile: "පවරා ඇති මවගේ පැතිකඩ යාවත්කාලීන කරන්න",
      selectAssignedUser: "පවරා ඇති පරිශීලකයා තෝරන්න",
      updateProfile: "පැතිකඩ යාවත්කාලීන කරන්න",
    },
    requests: {
      receivedRequests: "ලැබුණු ඉල්ලීම්",
      sentRequests: "යැවූ ඉල්ලීම්",
      noReceivedRequests: "ලැබුණු ඉල්ලීම් නොමැත.",
      noSentRequests: "යැවූ ඉල්ලීම් නොමැත.",
      requestDetails: "ඉල්ලීම් විස්තර",
      matchedArea: "ගැළපුණු ප්‍රදේශය",
      cancelRequest: "ඉල්ලීම අවලංගු කරන්න",
    },
    details: {
      userDetails: "පරිශීලක විස්තර",
      locationDetails: "ස්ථාන විස්තර",
      midwifeName: "පවුල් සෞඛ්‍ය සේවිකා නම",
      assignedMidwife: "පවරා ඇති පවුල් සෞඛ්‍ය සේවිකාව",
    },
    map: {
      allRegisteredMidwivesTitle: "සියලු ලියාපදිංචි පවුල් සෞඛ්‍ය සේවිකාවන් සිතියමේ",
      allRegisteredPatientsTitle: "සියලු ලියාපදිංචි මව්වරුන් සිතියමේ",
      allRegisteredMidwivesSubtitle:
        "රෝගීන්ට/මව්වරුන්ට ලියාපදිංචි පවුල් සෞඛ්‍ය සේවිකාවන්ගේ ස්ථාන විස්තර බලා ඉල්ලීම් යැවිය හැක.",
      allRegisteredPatientsSubtitle:
        "පවුල් සෞඛ්‍ය සේවිකාවන්ට ලියාපදිංචි මව්වරුන්ගේ ස්ථාන විස්තර බලා ඉල්ලීම් යැවිය හැක.",
      mapView: "සිතියම් දර්ශනය",
      mapHelp: "ලිපිනය, දිස්ත්‍රික්කය, MOH ප්‍රදේශය බලන්න සහ ඉල්ලීම යවන්න marker එක මත ක්ලික් කරන්න.",
      totalUsersOnMap: "සිතියමේ පරිශීලකයින් ගණන",
      loadingMap: "සිතියම පූරණය වෙමින්...",
      noUsersWithCoordinates: "සුරැකි ඛණ්ඩාංක සහිත පරිශීලකයින් නොමැත.",
      registeredMidwivesMap: "ලියාපදිංචි පවුල් සෞඛ්‍ය සේවිකාවන්ගේ සිතියම",
      registeredPatientsMap: "ලියාපදිංචි මව්වරුන්ගේ සිතියම",
      nearbyRegisteredMidwives: "අසල ලියාපදිංචි පවුල් සෞඛ්‍ය සේවිකාවන් බලන්න",
      nearbyRegisteredPatients: "අසල ලියාපදිංචි මව්වරුන් බලන්න",
      loadingMidwivesMap: "පවුල් සෞඛ්‍ය සේවිකා සිතියම පූරණය වෙමින්...",
      loadingPatientsMap: "මව්වරුන්ගේ සිතියම පූරණය වෙමින්...",
      unableToLoadMap: "සිතියම පූරණය කළ නොහැක.",
    },
    messages: {
      targetEmailRequired: "ඉලක්ක ඊමේල් අවශ්‍යයි.",
      targetAreaRequired: "ඉලක්ක ප්‍රදේශය අවශ්‍යයි.",
      districtRequired: "දිස්ත්‍රික්කය අවශ්‍යයි.",
      mohAreaRequired: "MOH ප්‍රදේශය අවශ්‍යයි.",
      failedLoadData: "දත්ත පූරණය කිරීමට අසමත් විය",
      failedSendRequest: "ඉල්ලීම යැවීමට අසමත් විය",
      failedSearchUsers: "පරිශීලකයින් සෙවීමට අසමත් විය",
      failedSearchMapUsers: "සිතියම් පරිශීලකයින් සෙවීමට අසමත් විය",
      failedApproveRequest: "ඉල්ලීම අනුමත කිරීමට අසමත් විය",
      failedRejectRequest: "ඉල්ලීම ප්‍රතික්ෂේප කිරීමට අසමත් විය",
      failedCancelRequest: "ඉල්ලීම අවලංගු කිරීමට අසමත් විය",
      failedCancelAssignedMidwife: "පවරා ඇති පවුල් සෞඛ්‍ය සේවිකාව අවලංගු කිරීමට අසමත් විය",
      failedCancelAssignedMother: "පවරා ඇති මව අවලංගු කිරීමට අසමත් විය",
      failedUpdateAssignedUser: "පවරා ඇති පරිශීලකයා යාවත්කාලීන කිරීමට අසමත් විය",
      failedLoadMapData: "සිතියම් දත්ත පූරණය කිරීමට අසමත් විය",
      requestCannotBeSent: "මෙම පරිශීලකයාට ඉල්ලීම යැවිය නොහැක.",
      selectAssignedUserFirst: "පළමුව පවරා ඇති පරිශීලකයෙකු තෝරන්න.",
      requestApproved: "ඉල්ලීම සාර්ථකව අනුමත කරන ලදි.",
      requestRejected: "ඉල්ලීම සාර්ථකව ප්‍රතික්ෂේප කරන ලදි.",
      requestCancelled: "ඉල්ලීම සාර්ථකව අවලංගු කරන ලදි.",
      assignedMidwifeCancelled: "පවරා ඇති පවුල් සෞඛ්‍ය සේවිකාව සාර්ථකව අවලංගු කරන ලදි.",
      assignedMotherCancelled: "පවරා ඇති මව සාර්ථකව අවලංගු කරන ලදි.",
      assignedUserUpdated: "පවරා ඇති පරිශීලකයාගේ පැතිකඩ සාර්ථකව යාවත්කාලීන කරන ලදි.",
      createdRequests: (count) => `ඉල්ලීම් ${count}ක් සාර්ථකව සාදන ලදි.`,
      foundUsers: (count) => `පරිශීලකයින් ${count}ක් සොයාගන්නා ලදි.`,
      foundMappableUsers: (count) => `සිතියමේ පෙන්විය හැකි පරිශීලකයින් ${count}ක් සොයාගන්නා ලදි.`,
      connectionRequestTo: (name) => `${name} වෙත සම්බන්ධතා ඉල්ලීම යවන ලදි`,
      connectionRequestToMidwife: (name) => `පවුල් සෞඛ්‍ය සේවිකා ${name} වෙත සම්බන්ධතා ඉල්ලීම යවන ලදි`,
      connectionRequestToPatient: (name) => `රෝගී/මව ${name} වෙත සම්බන්ධතා ඉල්ලීම යවන ලදි`,
      notAuthenticated: "ඔබ පිවිසී නොමැත. නැවත පුරනය වන්න.",
      noPermissionMap: "මෙම සිතියම බැලීමට ඔබට අවසර නොමැත.",
    },
  },
  ta: {
    common: {
      close: "மூடு",
      loading: "ஏற்றப்படுகிறது...",
      search: "தேடு",
      searching: "தேடுகிறது...",
      view: "பார்",
      sendRequest: "கோரிக்கை அனுப்பு",
      sending: "அனுப்புகிறது...",
      cancel: "ரத்து செய்",
      approve: "அங்கீகரி",
      reject: "நிராகரி",
      method: "முறை",
      message: "செய்தி",
      created: "உருவாக்கப்பட்டது",
      responded: "பதில் அளித்தது",
      status: "நிலை",
      address: "முகவரி",
      area: "பகுதி",
      district: "மாவட்டம்",
      mohArea: "MOH பகுதி",
      latitude: "அட்சரேகை",
      longitude: "தீர்க்கரேகை",
      email: "மின்னஞ்சல்",
      role: "பங்கு",
      roles: "பங்குகள்",
      firstName: "முதல் பெயர்",
      lastName: "கடைசி பெயர்",
      phoneNumber: "தொலைபேசி எண்",
      optionalMessage: "விருப்ப செய்தி",
      noMatchingResults: "பொருந்தும் முடிவுகள் இல்லை",
      selectDistrictFirst: "முதலில் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
      loadingDistricts: "மாவட்டங்கள் ஏற்றப்படுகிறது...",
      loadingMohAreas: "MOH பகுதிகள் ஏற்றப்படுகிறது...",
      selectOrTypeDistrict: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும் அல்லது தட்டச்சு செய்யவும்",
      selectOrTypeMohArea: "MOH பகுதியைத் தேர்ந்தெடுக்கவும் அல்லது தட்டச்சு செய்யவும்",
      targetEmail: "இலக்கு மின்னஞ்சல்",
      targetArea: "இலக்கு பகுதி",
      exampleEmail: "example@email.com",
      unavailable: "-",
    },
    status: {
      PENDING: "நிலுவையில்",
      APPROVED: "அங்கீகரிக்கப்பட்டது",
      REJECTED: "நிராகரிக்கப்பட்டது",
      ASSIGNED: "ஒதுக்கப்பட்டது",
      AVAILABLE: "கிடைக்கிறது",
    },
    roleLabels: {
      MIDWIFE: "மகப்பேறு தாதி",
      PREGNANT_MOTHER: "கர்ப்பிணி தாய்",
      POST_PREGNANT_MOTHER: "பிறப்புக்குப் பிந்தைய தாய்",
      HOPE_TO_PREGNANT_MOTHER: "கர்ப்பம் எதிர்பார்க்கும் தாய்",
    },
    header: {
      midwifeTitle: "தாய் இணைப்பு மற்றும் ஒதுக்கீடு மேலாண்மை",
      motherTitle: "மகப்பேறு தாதி இணைப்பு மற்றும் ஒதுக்கீடு",
      defaultTitle: "இணைப்பு மற்றும் ஒதுக்கீடு",
      midwifeDescription:
        "மாவட்டம்/MOH அடிப்படையில் தாய்மார்களைத் தேடுங்கள், வரைபடத்தில் பாருங்கள், கோரிக்கைகளை நிர்வகியுங்கள், ஒதுக்கீடுகளைப் பாருங்கள், ஒதுக்கப்பட்ட தாயின் விவரங்களைப் புதுப்பியுங்கள்.",
      motherDescription:
        "மாவட்டம்/MOH அடிப்படையில் மகப்பேறு தாதிகளைத் தேடுங்கள், கிடைக்கும் தாதிகளை வரைபடத்தில் பாருங்கள், இணைப்பு கோரிக்கைகளை நிர்வகியுங்கள், உங்களுக்கு ஒதுக்கப்பட்ட தாதியைப் பாருங்கள்.",
      defaultDescription: "இணைப்பு கோரிக்கைகள் மற்றும் ஒதுக்கீடுகளை நிர்வகிக்கவும்.",
    },
    tabs: {
      searchConnect: "தேடு & இணை",
      assignment: "என் ஒதுக்கீடு",
      requests: "பெற்ற & அனுப்பிய கோரிக்கைகள்",
      updateProfile: "ஒதுக்கப்பட்ட தாயின் சுயவிவரத்தைப் புதுப்பி",
    },
    searchConnect: {
      searchMothersTitle: "மாவட்டம் & MOH பகுதி அடிப்படையில் தாய்மார்களைத் தேடு",
      searchMidwivesTitle: "மாவட்டம் & MOH பகுதி அடிப்படையில் மகப்பேறு தாதிகளைத் தேடு",
      searchUsersTitle: "பயனர்களைத் தேடு",
      searchResultsOpenPopup: "தேடல் முடிவுகள் popup பெட்டியில் திறக்கும்.",
      mothersMapTitle: "தேர்ந்தெடுத்த பகுதியில் தாய்மார்கள் வரைபடம்",
      midwivesMapTitle: "தேர்ந்தெடுத்த பகுதியில் மகப்பேறு தாதிகள் வரைபடம்",
      mapSearchTitle: "வரைபட தேடல்",
      loadMap: "வரைபடத்தை ஏற்று",
      loadingMap: "வரைபடம் ஏற்றப்படுகிறது...",
      noMappableUsers: "வரைபடத்தில் காட்டக்கூடிய கிடைக்கும் பயனர்கள் இல்லை.",
      manualConnectionRequest: "கைமுறை இணைப்பு கோரிக்கை",
      searchResults: "தேடல் முடிவுகள்",
      noAvailableUsers: "கிடைக்கும் பயனர்கள் இல்லை.",
    },
    assignment: {
      myAssignment: "என் ஒதுக்கீடு",
      noMidwifeAssigned: "இன்னும் மகப்பேறு தாதி ஒதுக்கப்படவில்லை.",
      totalAssignedUsers: "மொத்த ஒதுக்கப்பட்ட பயனர்கள்",
      noUsersAssigned: "இன்னும் பயனர்கள் ஒதுக்கப்படவில்லை.",
      noAssignmentView: "ஒதுக்கீடு காட்சி இல்லை.",
      cancelAssignment: "ஒதுக்கீட்டை ரத்து செய்",
      chooseAssignedUser: "ஒதுக்கப்பட்ட பயனரைத் தேர்ந்தெடு",
      updateAssignedMotherProfile: "ஒதுக்கப்பட்ட தாயின் சுயவிவரத்தைப் புதுப்பி",
      selectAssignedUser: "ஒதுக்கப்பட்ட பயனரைத் தேர்ந்தெடு",
      updateProfile: "சுயவிவரத்தைப் புதுப்பி",
    },
    requests: {
      receivedRequests: "பெற்ற கோரிக்கைகள்",
      sentRequests: "அனுப்பிய கோரிக்கைகள்",
      noReceivedRequests: "பெற்ற கோரிக்கைகள் இல்லை.",
      noSentRequests: "அனுப்பிய கோரிக்கைகள் இல்லை.",
      requestDetails: "கோரிக்கை விவரங்கள்",
      matchedArea: "பொருந்திய பகுதி",
      cancelRequest: "கோரிக்கையை ரத்து செய்",
    },
    details: {
      userDetails: "பயனர் விவரங்கள்",
      locationDetails: "இட விவரங்கள்",
      midwifeName: "மகப்பேறு தாதி பெயர்",
      assignedMidwife: "ஒதுக்கப்பட்ட மகப்பேறு தாதி",
    },
    map: {
      allRegisteredMidwivesTitle: "அனைத்து பதிவு செய்யப்பட்ட மகப்பேறு தாதிகள் வரைபடத்தில்",
      allRegisteredPatientsTitle: "அனைத்து பதிவு செய்யப்பட்ட தாய்மார்கள் வரைபடத்தில்",
      allRegisteredMidwivesSubtitle:
        "நோயாளிகள்/தாய்மார்கள் பதிவு செய்யப்பட்ட மகப்பேறு தாதிகளின் இட விவரங்களைப் பார்த்து கோரிக்கைகள் அனுப்பலாம்.",
      allRegisteredPatientsSubtitle:
        "மகப்பேறு தாதிகள் பதிவு செய்யப்பட்ட தாய்மார்களின் இட விவரங்களைப் பார்த்து கோரிக்கைகள் அனுப்பலாம்.",
      mapView: "வரைபட காட்சி",
      mapHelp: "முகவரி, மாவட்டம், MOH பகுதி பார்க்கவும் கோரிக்கை அனுப்பவும் marker-ஐ கிளிக் செய்யவும்.",
      totalUsersOnMap: "வரைபடத்தில் மொத்த பயனர்கள்",
      loadingMap: "வரைபடம் ஏற்றப்படுகிறது...",
      noUsersWithCoordinates: "சேமிக்கப்பட்ட கோஆர்டினேட் கொண்ட பயனர்கள் இல்லை.",
      registeredMidwivesMap: "பதிவு செய்யப்பட்ட மகப்பேறு தாதிகள் வரைபடம்",
      registeredPatientsMap: "பதிவு செய்யப்பட்ட தாய்மார்கள் வரைபடம்",
      nearbyRegisteredMidwives: "அருகிலுள்ள பதிவு செய்யப்பட்ட மகப்பேறு தாதிகளைப் பாருங்கள்",
      nearbyRegisteredPatients: "அருகிலுள்ள பதிவு செய்யப்பட்ட தாய்மார்களைப் பாருங்கள்",
      loadingMidwivesMap: "மகப்பேறு தாதிகள் வரைபடம் ஏற்றப்படுகிறது...",
      loadingPatientsMap: "தாய்மார்கள் வரைபடம் ஏற்றப்படுகிறது...",
      unableToLoadMap: "வரைபடத்தை ஏற்ற முடியவில்லை.",
    },
    messages: {
      targetEmailRequired: "இலக்கு மின்னஞ்சல் தேவை.",
      targetAreaRequired: "இலக்கு பகுதி தேவை.",
      districtRequired: "மாவட்டம் தேவை.",
      mohAreaRequired: "MOH பகுதி தேவை.",
      failedLoadData: "தரவை ஏற்ற முடியவில்லை",
      failedSendRequest: "கோரிக்கையை அனுப்ப முடியவில்லை",
      failedSearchUsers: "பயனர்களைத் தேட முடியவில்லை",
      failedSearchMapUsers: "வரைபட பயனர்களைத் தேட முடியவில்லை",
      failedApproveRequest: "கோரிக்கையை அங்கீகரிக்க முடியவில்லை",
      failedRejectRequest: "கோரிக்கையை நிராகரிக்க முடியவில்லை",
      failedCancelRequest: "கோரிக்கையை ரத்து செய்ய முடியவில்லை",
      failedCancelAssignedMidwife: "ஒதுக்கப்பட்ட மகப்பேறு தாதியை ரத்து செய்ய முடியவில்லை",
      failedCancelAssignedMother: "ஒதுக்கப்பட்ட தாயை ரத்து செய்ய முடியவில்லை",
      failedUpdateAssignedUser: "ஒதுக்கப்பட்ட பயனரைப் புதுப்பிக்க முடியவில்லை",
      failedLoadMapData: "வரைபட தரவை ஏற்ற முடியவில்லை",
      requestCannotBeSent: "இந்த பயனருக்கு கோரிக்கை அனுப்ப முடியாது.",
      selectAssignedUserFirst: "முதலில் ஒதுக்கப்பட்ட பயனரைத் தேர்ந்தெடுக்கவும்.",
      requestApproved: "கோரிக்கை வெற்றிகரமாக அங்கீகரிக்கப்பட்டது.",
      requestRejected: "கோரிக்கை வெற்றிகரமாக நிராகரிக்கப்பட்டது.",
      requestCancelled: "கோரிக்கை வெற்றிகரமாக ரத்து செய்யப்பட்டது.",
      assignedMidwifeCancelled: "ஒதுக்கப்பட்ட மகப்பேறு தாதி வெற்றிகரமாக ரத்து செய்யப்பட்டது.",
      assignedMotherCancelled: "ஒதுக்கப்பட்ட தாய் வெற்றிகரமாக ரத்து செய்யப்பட்டது.",
      assignedUserUpdated: "ஒதுக்கப்பட்ட பயனரின் சுயவிவரம் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது.",
      createdRequests: (count) => `${count} கோரிக்கை(கள்) வெற்றிகரமாக உருவாக்கப்பட்டது.`,
      foundUsers: (count) => `${count} பயனர்(கள்) கண்டுபிடிக்கப்பட்டனர்.`,
      foundMappableUsers: (count) => `வரைபடத்தில் காட்டக்கூடிய ${count} பயனர்(கள்) கண்டுபிடிக்கப்பட்டனர்.`,
      connectionRequestTo: (name) => `${name} க்கு இணைப்பு கோரிக்கை அனுப்பப்பட்டது`,
      connectionRequestToMidwife: (name) => `மகப்பேறு தாதி ${name} க்கு இணைப்பு கோரிக்கை அனுப்பப்பட்டது`,
      connectionRequestToPatient: (name) => `நோயாளி/தாய் ${name} க்கு இணைப்பு கோரிக்கை அனுப்பப்பட்டது`,
      notAuthenticated: "நீங்கள் உள்நுழையவில்லை. மீண்டும் உள்நுழையவும்.",
      noPermissionMap: "இந்த வரைபடத்தைப் பார்க்க உங்களுக்கு அனுமதி இல்லை.",
    },
  },
};

export function getStatusLabel(
  status: string | undefined,
  t: AssignmentTranslations
) {
  if (!status) return "-";
  if (status === "PENDING") return t.status.PENDING;
  if (status === "APPROVED") return t.status.APPROVED;
  if (status === "REJECTED") return t.status.REJECTED;
  if (status === "ASSIGNED") return t.status.ASSIGNED;
  if (status === "AVAILABLE") return t.status.AVAILABLE;
  return status;
}
