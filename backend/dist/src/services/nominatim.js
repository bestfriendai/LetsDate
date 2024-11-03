import axios from 'axios';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';
const nominatimApi = axios.create({
    baseURL: NOMINATIM_API,
    headers: {
        'User-Agent': 'DateAI/1.0',
    },
});
export async function searchLocations(query) {
    if (!query || query.length < 2)
        return [];
    try {
        const response = await nominatimApi.get('/search', {
            params: {
                q: query,
                format: 'json',
                addressdetails: 1,
                limit: 5,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
}
export async function reverseGeocode(lat, lon) {
    try {
        const response = await nominatimApi.get('/reverse', {
            params: {
                lat,
                lon,
                format: 'json',
                addressdetails: 1,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error reverse geocoding:', error);
        return null;
    }
}
export const nominatimService = {
    searchLocations,
    reverseGeocode
};
//# sourceMappingURL=nominatim.js.map