export const withGracefulDegradation = async <T>(
  apiCall: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call failed, using fallback:', error);
    return fallback;
  }
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const getReadOnlyMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('read_only_mode') === 'true';
};

export const setReadOnlyMode = (enabled: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('read_only_mode', enabled.toString());
};
