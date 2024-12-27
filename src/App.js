import React, { useState } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  ZoomableGroup
} from 'react-simple-maps';
import './App.css';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";

function App() {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const handleCountryClick = (geo) => {
    // Get the bounds of the country
    const bounds = geo.geometry.coordinates[0].reduce(
      (bounds, coord) => {
        return {
          minLng: Math.min(bounds.minLng, coord[0]),
          maxLng: Math.max(bounds.maxLng, coord[0]),
          minLat: Math.min(bounds.minLat, coord[1]),
          maxLat: Math.max(bounds.maxLat, coord[1])
        };
      },
      {
        minLng: Infinity,
        maxLng: -Infinity,
        minLat: Infinity,
        maxLat: -Infinity
      }
    );

    // Calculate center point
    const centerLng = (bounds.minLng + bounds.maxLng) / 2;
    const centerLat = (bounds.minLat + bounds.maxLat) / 2;

    setSelectedCountry({
      name: geo.properties.name,
      coordinates: [centerLng, centerLat],
      info: {
        capital: geo.properties.capital || "Unknown",
        population: geo.properties.pop_est || "Unknown",
        region: geo.properties.continent || "Unknown",
      }
    });

    // Set a fixed zoom level for all countries
    setPosition({
      coordinates: [centerLng, centerLat],
      zoom: 4  // Fixed zoom level for consistency
    });
  };

  const handleBackToWorld = () => {
    setSelectedCountry(null);
    setPosition({
      coordinates: [0, 0],
      zoom: 1
    });
  };

  return (
    <div className="App">
      {hoveredCountry && (
        <div className="country-label">
          {hoveredCountry}
        </div>
      )}
      
      {selectedCountry && (
        <>
          <button className="back-button" onClick={handleBackToWorld}>
            ← Back to World Map
          </button>
          <div className="country-info">
            <h2>{selectedCountry.name}</h2>
            <p>Capital: {selectedCountry.info.capital}</p>
            <p>Population: {selectedCountry.info.population}</p>
            <p>Region: {selectedCountry.info.region}</p>
          </div>
        </>
      )}

      <div className="map-container">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 147
          }}
        >
          <ZoomableGroup
            center={position.coordinates}
            zoom={position.zoom}
            minZoom={1}
            maxZoom={8}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setHoveredCountry(geo.properties.name);
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null);
                    }}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: {
                        fill: selectedCountry?.name === geo.properties.name 
                          ? '#4CAF50' 
                          : '#D6D6DA',
                        stroke: '#000000',
                        strokeWidth: 0.5,
                        outline: 'none'
                      },
                      hover: {
                        fill: selectedCountry
                          ? (selectedCountry.name === geo.properties.name 
                            ? '#45a049'  // darker green for selected country
                            : '#87CEEB') // light blue for other countries when one is selected
                          : '#4CAF50',   // default green hover when no country is selected
                        stroke: '#000000',
                        strokeWidth: 0.5,
                        outline: 'none'
                      },
                      pressed: {
                        fill: '#45a049',
                        outline: 'none'
                      }
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}

export default App; 