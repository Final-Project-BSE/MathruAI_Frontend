export const ROLES = {
  HOPE_TO_PREGNANT_MOTHER: 'HOPE_TO_PREGNANT_MOTHER',
  PREGNANT_MOTHER: 'PREGNANT_MOTHER',
  POST_PREGNANT_MOTHER: 'POST_PREGNANT_MOTHER',
  MIDWIFE: 'MIDWIFE',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Map each role to its default dashboard
export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  [ROLES.HOPE_TO_PREGNANT_MOTHER]: '/dashboard/reproductive',
  [ROLES.PREGNANT_MOTHER]: '/dashboard/pregnancy',
  [ROLES.POST_PREGNANT_MOTHER]: '/dashboard/postpartum',
  [ROLES.MIDWIFE]: '/midwife/dashboard',
};

// about which roles can access which routes
// about which roles can access which routes
export const ROUTE_ACCESS: Record<string, UserRole[]> = {
  '/dashboard/reproductive': [ROLES.HOPE_TO_PREGNANT_MOTHER],
  '/dashboard/pregnancy': [ROLES.PREGNANT_MOTHER],
  '/dashboard/postpartum': [ROLES.POST_PREGNANT_MOTHER],
  '/midwife/dashboard': [ROLES.MIDWIFE],

  '/cycle-tracker': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/health-monitoring': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE, ROLES.PREGNANT_MOTHER],
  '/daily-recommendations': [ROLES.PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/midwife-assign': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.PREGNANT_MOTHER, ROLES.MIDWIFE, ROLES.POST_PREGNANT_MOTHER],
  '/chatbot': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE, ROLES.POST_PREGNANT_MOTHER],
  '/notifications': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE, ROLES.POST_PREGNANT_MOTHER],
  '/announcement': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/settings': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.PREGNANT_MOTHER, ROLES.MIDWIFE, ROLES.POST_PREGNANT_MOTHER],
  '/health-records': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.PREGNANT_MOTHER, ROLES.MIDWIFE, ROLES.POST_PREGNANT_MOTHER],
  '/timeline-milestone': [ROLES.PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/nutrition-wellness': [ROLES.PREGNANT_MOTHER, ROLES.MIDWIFE, ROLES.POST_PREGNANT_MOTHER],
  '/recovery-tracking': [ROLES.POST_PREGNANT_MOTHER],
  '/breastfeeding-support': [ROLES.POST_PREGNANT_MOTHER],
  '/three-posha': [ROLES.POST_PREGNANT_MOTHER],
  '/birth-control': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.POST_PREGNANT_MOTHER],
  '/analytics': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.PREGNANT_MOTHER, ROLES.MIDWIFE, ROLES.POST_PREGNANT_MOTHER],

  '/midwife/patient-console': [ROLES.MIDWIFE],
  '/midwife/chatbot': [ROLES.MIDWIFE],
  '/user-assign': [ROLES.MIDWIFE],



};

export function getDashboardForRole(role: string): string {
  return ROLE_DASHBOARDS[role as UserRole] || '/sign-in';
}

export function canAccessRoute(role: string, route: string): boolean {
  for (const [routePattern, allowedRoles] of Object.entries(ROUTE_ACCESS)) {
    if (route.startsWith(routePattern)) {
      return allowedRoles.includes(role as UserRole);
    }
  }
  return false;
}