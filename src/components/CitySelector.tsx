import React from 'react';
import { cities } from '../data/cities';

interface CitySelectorProps {
  onGuess: (cityName: string) => void;
  disabled: boolean;
}

const CitySelector: React.FC<CitySelectorProps> = ({ onGuess, disabled }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);

  const filteredCities = cities
    .filter(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);

  const handleSelect = (cityName: string) => {
    onGuess(cityName);
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        placeholder="Enter a city name..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
      />
      
      {showDropdown && searchTerm && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
          {filteredCities.map((city) => (
            <button
              key={city.name}
              onClick={() => handleSelect(city.name)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
            >
              {city.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySelector;