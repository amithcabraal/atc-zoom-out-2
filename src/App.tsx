import React, { useState, useEffect } from 'react';
import { getDistance } from 'geolib';
import { MapPin, RefreshCw } from 'lucide-react';
import { City, Guess } from './types';
import { cities } from './data/cities';
import GameMap from './components/GameMap';
import CitySelector from './components/CitySelector';

function App() {
  const [targetCity, setTargetCity] = useState<City | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [zoom, setZoom] = useState(18);
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('welcomeDismissed');
  });

  const MAX_GUESSES = 6;
  const ZOOM_LEVELS = [18, 16, 14, 12, 10, 8];
  const FINAL_ZOOM = 4;

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (gameOver) {
      setZoom(FINAL_ZOOM);
    }
  }, [gameOver]);

  const startNewGame = () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    setTargetCity(randomCity);
    setGuesses([]);
    setGameOver(false);
    setZoom(ZOOM_LEVELS[0]);
  };

  const handleGuess = (cityName: string) => {
    if (!targetCity || gameOver) return;

    const guessedCity = cities.find(c => c.name === cityName);
    if (!guessedCity) return;

    const distance = getDistance(
      { latitude: guessedCity.latitude, longitude: guessedCity.longitude },
      { latitude: targetCity.latitude, longitude: targetCity.longitude }
    ) / 1000;

    const newGuess: Guess = {
      cityName,
      latitude: guessedCity.latitude,
      longitude: guessedCity.longitude,
      distance
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    if (distance < 1) {
      setGameOver(true);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
    } else {
      setZoom(ZOOM_LEVELS[newGuesses.length]);
    }
  };

  const dismissWelcome = () => {
    localStorage.setItem('welcomeDismissed', 'true');
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {showWelcome && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-8 rounded-lg max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to Zoom Out!</h2>
            <p className="mb-4">
              Try to guess the mystery city based on the map view. You have 6 chances, and with each wrong guess:
              <ul className="list-disc ml-6 mt-2">
                <li>The map will zoom out</li>
                <li>You'll see how far your guess was from the target</li>
              </ul>
            </p>
            <button
              onClick={dismissWelcome}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Start Playing!
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="w-8 h-8" />
            Zoom Out
          </h1>
          <button
            onClick={startNewGame}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            New Game
          </button>
        </div>

        <div className="grid md:grid-cols-[2fr,1fr] gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {targetCity && (
              <GameMap
                center={[targetCity.latitude, targetCity.longitude]}
                zoom={zoom}
                targetCity={targetCity}
                guesses={guesses}
                gameOver={gameOver}
              />
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <CitySelector
                onGuess={handleGuess}
                disabled={gameOver}
              />

              <div className="space-y-2">
                {guesses.map((guess, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded"
                  >
                    <span>Guess {index + 1}: {guess.cityName}</span>
                    <span className="font-semibold">
                      {Math.round(guess.distance)} km away
                    </span>
                  </div>
                ))}
              </div>

              {gameOver && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-lg font-semibold">
                    Game Over! The city was {targetCity?.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {guesses.length === MAX_GUESSES
                      ? "You've used all your guesses!"
                      : "Congratulations, you found the city!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
