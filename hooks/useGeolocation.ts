import { useState, useCallback } from 'react';

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  isLocating: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    isLocating: false,
  });

  const getCurrentPosition = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState(prev => ({ ...prev, error: 'الموقع الجغرافي غير مدعوم' }));
      return Promise.reject(new Error('Geolocation not supported'));
    }

    setState(prev => ({ ...prev, isLocating: true, error: null }));

    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setState({ lat: latitude, lng: longitude, error: null, isLocating: false });
          resolve({ lat: latitude, lng: longitude });
        },
        (err) => {
          const errorMsg =
            err.code === 1
              ? 'تم رفض إذن الموقع'
              : err.code === 2
              ? 'الموقع غير متاح'
              : 'انتهت مهلة تحديد الموقع';
          setState(prev => ({ ...prev, error: errorMsg, isLocating: false }));
          reject(new Error(errorMsg));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }, []);

  const setPosition = useCallback((lat: number, lng: number) => {
    setState({ lat, lng, error: null, isLocating: false });
  }, []);

  return { ...state, getCurrentPosition, setPosition };
}
