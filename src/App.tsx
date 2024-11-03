import { MapPin, Moon, Sun } from 'lucide-react';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import EventDetails from './components/EventDetails';
import EventList from './components/EventList';
import { EventProvider } from './context/EventContext';
import { useTheme } from './context/ThemeContext';
import { Button } from '@nextui-org/react';

function App() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <EventProvider>
      <div className={`h-screen relative ${isDarkMode ? 'dark' : ''}`}>
        {/* Map Container */}
        <div className="absolute inset-0">
          <Map />
        </div>

        {/* Header - Fixed at top */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-lg rounded-2xl p-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-inherit">
                  DateAI
                </h1>
              </div>
              <Button
                isIconOnly
                variant="light"
                onClick={toggleTheme}
                className="text-default-600"
                size="sm"
              >
                {isDarkMode ? <Sun /> : <Moon />}
              </Button>
            </div>
          </div>
        </div>

        {/* Event List Overlay */}
        <EventList />

        {/* Search Bar - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <SearchBar />
          </div>
        </div>

        {/* Event Details Modal */}
        <EventDetails />
      </div>
    </EventProvider>
  );
}

export default App;