import { Search, MapPin, Calendar, Navigation } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { Input, Button, Chip, Card, CardBody, Listbox, ListboxItem } from '@nextui-org/react';
import { useEvents } from '../context/EventContext';
import { searchLocations, reverseGeocode, NominatimResult } from '../services/nominatim';
import debounce from 'lodash/debounce';

const categories = [
  'Restaurants', 'Movies', 'Events', 'Outdoors', 'Arts', 
  'Music', 'Theater', 'Sports', 'Food & Drink', 'Nightlife'
];

const dateOptions = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'weekend', label: 'This Weekend' },
  { value: 'week', label: 'This Week' }
];

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState('today'); // Default to today
  const { searchForEvents, loading: searchLoading, error, selectedLocation, setSelectedLocation } = useEvents();
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
      } catch (error) {
        console.error('Location search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleLocationSelect = async (location: NominatimResult) => {
    setSearchValue(location.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedLocation(location);

    try {
      await searchForEvents({
        query: selectedCategories.length > 0 ? selectedCategories.join(' ') : 'events',
        date: selectedDate,
        location: {
          lat: parseFloat(location.lat),
          lon: parseFloat(location.lon)
        }
      });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    try {
      setIsLoading(true);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const location = await reverseGeocode(latitude, longitude);
      
      if (location) {
        setSearchValue(location.display_name);
        setSelectedLocation(location);
        await searchForEvents({
          query: selectedCategories.length > 0 ? selectedCategories.join(' ') : 'events',
          date: selectedDate,
          location: {
            lat: latitude,
            lon: longitude
          }
        });
      }
    } catch (error) {
      console.error('Location error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedLocation && !searchValue) {
      return;
    }

    try {
      const categoryQuery = selectedCategories.length > 0 
        ? selectedCategories.join(' ') 
        : 'events';

      if (selectedLocation) {
        await searchForEvents({
          query: categoryQuery,
          date: selectedDate,
          location: {
            lat: parseFloat(selectedLocation.lat),
            lon: parseFloat(selectedLocation.lon)
          }
        });
      } else {
        const locations = await searchLocations(searchValue);
        if (locations.length > 0) {
          const location = locations[0];
          setSelectedLocation(location);
          await searchForEvents({
            query: categoryQuery,
            date: selectedDate,
            location: {
              lat: parseFloat(location.lat),
              lon: parseFloat(location.lon)
            }
          });
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Card className="w-full bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-2xl">
      <CardBody className="gap-4 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter a location..."
              value={searchValue}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                const value = e.target.value;
                setSearchValue(value);
                setShowSuggestions(true);
                debouncedSearch(value);
              }}
              startContent={<MapPin className="text-default-400" size={18} />}
              size="sm"
              className="w-full"
              isLoading={isLoading}
              errorMessage={error}
              classNames={{
                input: "text-sm",
                inputWrapper: "h-10"
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute bottom-full mb-1 w-full z-50">
                <Listbox
                  aria-label="Location suggestions"
                  onAction={(key) => {
                    const suggestion = suggestions.find(item => item.place_id === Number(key));
                    if (suggestion) {
                      handleLocationSelect(suggestion);
                    }
                  }}
                  className="p-0"
                  itemClasses={{
                    base: "px-3 py-2 data-[hover=true]:bg-default-100"
                  }}
                >
                  {suggestions.map((suggestion) => (
                    <ListboxItem key={suggestion.place_id} className="text-sm">
                      {suggestion.display_name}
                    </ListboxItem>
                  ))}
                </Listbox>
              </Card>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              color="primary"
              isIconOnly
              onClick={getCurrentLocation}
              size="sm"
              className="min-w-unit-10 h-10"
            >
              <Navigation size={18} />
            </Button>
            <Button
              color="primary"
              isIconOnly
              onClick={() => setShowFilters(!showFilters)}
              size="sm"
              className="min-w-unit-10 h-10"
            >
              <Calendar size={18} />
            </Button>
            <Button
              color="primary"
              onClick={handleSearch}
              isLoading={searchLoading}
              size="sm"
              className="min-w-[80px] h-10"
              startContent={<Search size={18} />}
            >
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {dateOptions.map((option) => (
                <Chip
                  key={option.value}
                  variant={selectedDate === option.value ? "solid" : "bordered"}
                  color="primary"
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedDate(option.value)}
                  size="sm"
                  classNames={{
                    base: "h-7",
                    content: "text-xs font-medium"
                  }}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <Chip
                  key={category}
                  variant={selectedCategories.includes(category) ? "solid" : "bordered"}
                  color="primary"
                  className="cursor-pointer transition-all"
                  onClick={() => toggleCategory(category)}
                  size="sm"
                  classNames={{
                    base: "h-7",
                    content: "text-xs font-medium"
                  }}
                >
                  {category}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}