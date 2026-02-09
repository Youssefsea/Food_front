const geocodeCache = new Map<string, string>();

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const cacheKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
  
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`,
      {
        headers: {
          'User-Agent': 'FoodDeliveryApp/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }

    const data = await response.json();
    
    const address = data.address || {};
    const parts: string[] = [];

    if (address.house_number) parts.push(address.house_number);
    if (address.road) parts.push(address.road);
    if (address.suburb || address.neighbourhood) parts.push(address.suburb || address.neighbourhood);
    if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
    if (address.postcode) parts.push(address.postcode);
    if (address.country) parts.push(address.country);

    const locationName = parts.length > 0 ? parts.join(', ') : data.display_name || 'موقع غير معروف';

    geocodeCache.set(cacheKey, locationName);
    
    return locationName;
  } catch (error) {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

export async function forwardGeocode(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address) return null;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&accept-language=ar`,
      {
        headers: {
          'User-Agent': 'FoodDeliveryApp/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }

    const data = await response.json();
    
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

export function generateCirclePolygon(lat: number, lng: number, radiusKm: number): [number, number][] {
  const points = 64;
  const coords: [number, number][] = [];
  const earthRadius = 6371;

  for (let i = 0; i <= points; i++) {
    const angle = (i * 360) / points;
    const rad = (angle * Math.PI) / 180;

    const dLat = (radiusKm / earthRadius) * (180 / Math.PI) * Math.cos(rad);
    const dLng = (radiusKm / earthRadius) * (180 / Math.PI) * Math.sin(rad) / Math.cos(lat * Math.PI / 180);

    coords.push([lng + dLng, lat + dLat]);
  }

  return coords;
}
