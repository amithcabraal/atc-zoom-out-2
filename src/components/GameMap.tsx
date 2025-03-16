import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { City, Guess } from '../types';
import 'leaflet/dist/leaflet.css';

// Component to control zoom and center
const MapController: React.FC<{ maxZoom: number; center: [number, number]; gameOver: boolean }> = ({ maxZoom, center, gameOver }) => {
  const map = useMap();
  
  React.useEffect(() => {
    map.setMinZoom(maxZoom);
    map.setMaxZoom(maxZoom);
    map.setZoom(maxZoom);
    
    if (gameOver) {
      map.setView(center, maxZoom);
    }
  }, [map, maxZoom, center, gameOver]);

  return null;
};

interface GameMapProps {
  center: [number, number];
  zoom: number;
  targetCity: City | null;
  guesses: Guess[];
  gameOver: boolean;
}

const GameMap: React.FC<GameMapProps> = ({ center, zoom, targetCity, guesses, gameOver }) => {
  const guessIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const targetIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const targetPinIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="aspect-square w-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-lg"
        zoomControl={false}
        attributionControl={false}
        dragging={true}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <MapController maxZoom={zoom} center={center} gameOver={gameOver} />
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        
        {targetCity && !gameOver && (
          <Marker 
            position={[targetCity.latitude, targetCity.longitude]}
            icon={targetPinIcon}
          >
            <Popup>Target Location</Popup>
          </Marker>
        )}

        {gameOver && targetCity && (
          <Marker 
            position={[targetCity.latitude, targetCity.longitude]}
            icon={targetIcon}
          >
            <Popup>
              <strong>Correct City:</strong> {targetCity.name}
            </Popup>
          </Marker>
        )}

        {guesses.map((guess, index) => (
          <Marker
            key={index}
            position={[guess.latitude, guess.longitude]}
            icon={guessIcon}
          >
            <Popup>
              <strong>Guess {index + 1}:</strong> {guess.cityName}
              <br />
              Distance: {Math.round(guess.distance)} km
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {guesses.length > 0 && !gameOver && (
        <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
          <span className="font-semibold text-lg">
            {Math.round(guesses[guesses.length - 1].distance)} km away
          </span>
        </div>
      )}
    </div>
  );
};

export default GameMap;
