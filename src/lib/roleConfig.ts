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
  [ROLES.MIDWIFE]: '/dashboard/admin',
};

// Define which roles can access which routes
export const ROUTE_ACCESS: Record<string, UserRole[]> = {
  '/dashboard/reproductive': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/dashboard/pregnancy': [ROLES.PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/dashboard/postpartum': [ROLES.POST_PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/dashboard/admin': [ROLES.MIDWIFE],

  '/cycle-tracker': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/health-monitoring': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/daily-recommendations': [ROLES.PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/midwife-connection': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/chatbot': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/notifications': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/announcement': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/settings': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/healthrecords': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE],
  '/analytics': [ROLES.HOPE_TO_PREGNANT_MOTHER, ROLES.MIDWIFE],

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