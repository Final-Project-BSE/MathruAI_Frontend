
interface ProtectedFeatureProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedFeature({ 
  allowedRoles, 
  children, 
  fallback = null 
}: ProtectedFeatureProps) {
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch('/api/auth/check-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ allowedRoles }),
        });

        const data = await response.json();
        setHasAccess(data.hasAccess || false);
      } catch (error) {
        console.error('Role check error:', error);
        setHasAccess(false);
      }
    }

    checkAccess();
  }, [allowedRoles]);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Hook to check user role
export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      try {
        const response = await fetch('/api/auth/get-role');
        const data = await response.json();
        setRole(data.role || null);
      } catch (error) {
        console.error('Error fetching role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, []);

  return { role, loading };
}