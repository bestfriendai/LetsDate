import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Event } from '../types';
import { searchEvents, SearchEventsParams, reverseGeocode, ReverseGeocodeResult } from '../services/api';

interface EventContextType {
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  events: Event[];
  loading: boolean;
  error: string | null;
  selectedLocation: ReverseGeocodeResult | null;
  setSelectedLocation: (location: ReverseGeocodeResult | null) => void;
  searchForEvents: (params: SearchEventsParams) => Promise<void>;
  clearEvents: () => void;
  reverseGeocodedAddress: string | null;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ReverseGeocodeResult | null>(null);
  const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (selectedLocation) {
      performReverseGeocoding(selectedLocation.lat, selectedLocation.lon);
    } else {
      setReverseGeocodedAddress(null);
    }
  }, [selectedLocation]);

  const performReverseGeocoding = async (lat: string, lon: string) => {
    try {
      const result = await reverseGeocode(parseFloat(lat), parseFloat(lon));
      if (result) {
        setReverseGeocodedAddress(result.display_name);
      } else {
        setReverseGeocodedAddress(null);
      }
    } catch (err) {
      console.error('Error in reverse geocoding:', err);
      setReverseGeocodedAddress(null);
    }
  };

  const searchForEvents = async (params: SearchEventsParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchResults = await searchEvents({
        ...params,
        location: params.location ? {
          lat: params.location.lat,
          lon: params.location.lon,
          radius: params.location.radius
        } : undefined
      });
      
      setEvents(searchResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(errorMessage);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const clearEvents = () => {
    setEvents([]);
    setSelectedEvent(null);
    setError(null);
  };

  const contextValue: EventContextType = {
    selectedEvent,
    setSelectedEvent,
    events,
    loading,
    error,
    selectedLocation,
    setSelectedLocation,
    searchForEvents,
    clearEvents,
    reverseGeocodedAddress
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
