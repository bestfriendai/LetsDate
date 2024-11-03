export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

export async function searchLocations(query: string): Promise<NominatimResult[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<NominatimResult | null> {
  try {
    const response = await fetch(`/api/geocode/reverse?lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }
    return response.json();
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}