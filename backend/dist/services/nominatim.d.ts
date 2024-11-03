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
export declare function searchLocations(query: string): Promise<NominatimResult[]>;
export declare function reverseGeocode(lat: number, lon: number): Promise<NominatimResult | null>;
export declare const nominatimService: {
    readonly searchLocations: typeof searchLocations;
    readonly reverseGeocode: typeof reverseGeocode;
};
//# sourceMappingURL=nominatim.d.ts.map