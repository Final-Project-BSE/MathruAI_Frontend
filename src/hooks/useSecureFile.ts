import { useState, useEffect } from 'react';
import healthRecordsApi from '@/app/api/health-records/api';

export function useSecureFile(fileUrl: string | undefined | null) {
    const [objectUrl, setObjectUrl] = useState<string | null>(() => {
        // If it's already a base64 or object URL, just return it immediately
        if (fileUrl?.startsWith('data:') || fileUrl?.startsWith('blob:')) {
            return fileUrl;
        }
        return null;
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isSubscribed = true;

        if (!fileUrl) {
            setObjectUrl(null);
            return;
        }

        if (fileUrl.startsWith('data:') || fileUrl.startsWith('blob:')) {
            if (isSubscribed) setObjectUrl(fileUrl);
            return;
        }

        const fetchFile = async () => {
            try {
                if (isSubscribed) setLoading(true);
                const { getSession } = await import('@/lib/authentication');
                const session = await getSession();
                const token = session?.user?.token;

                if (!token) {
                    throw new Error("No authentication token found");
                }

                const blob = await healthRecordsApi.fetchSecureFile(token, fileUrl);
                const url = URL.createObjectURL(blob);

                if (isSubscribed) {
                    setObjectUrl(url);
                    setError(null);
                } else {
                    // Prevent memory leak if unmounted before fetch completes
                    URL.revokeObjectURL(url);
                }
            } catch (err: any) {
                console.error("Failed to load secure file:", err);
                if (isSubscribed) {
                    setError(err);
                    setObjectUrl(null);
                }
            } finally {
                if (isSubscribed) setLoading(false);
            }
        };

        fetchFile();

        return () => {
            isSubscribed = false;
            // We do NOT revoke the URL here immediately because other components 
            // might still be rendering it (e.g. lightbox, lists). 
            // In a strict app, we might want to reference count, but keeping 
            // the object URL alive for the session is usually fine for small amounts of files.
        };
    }, [fileUrl]);

    return { objectUrl, loading, error };
}
