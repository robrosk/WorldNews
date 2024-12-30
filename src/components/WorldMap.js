import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapController({ selectedCountry }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (selectedCountry && selectedCountry.bounds) {
      map.fitBounds(selectedCountry.bounds, { padding: [50, 50] });
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.setView([20, 0], 2);
    }
  }, [selectedCountry, map]);
  
  return null;
}

function WorldMap() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
      .then(response => response.json())
      .then(data => {
        setGeoData(data);
      });
  }, []);

  const countryStyle = {
    fillColor: 'transparent',
    weight: 1,
    opacity: 1,
    color: isDarkMode ? '#404040' : '#000000'
  };

  const onEachCountry = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: '#87CEEB',
          fillOpacity: 0.2,
          weight: 1
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: 'transparent',
          fillOpacity: 0,
          weight: 1
        });
      },
      click: (e) => {
        const layer = e.target;
        setSelectedCountry({
          name: feature.properties.name,
          bounds: layer.getBounds()
        });
      }
    });
  };

  const handleExit = () => {
    setSelectedCountry(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const Settings = () => (
    <div className="settings-overlay" onClick={() => setIsSettingsOpen(false)}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <h2>Settings</h2>
        <div className="settings-option">
          <label>Theme</label>
          <button onClick={toggleDarkMode}>
            {isDarkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
          </button>
        </div>
        {/* Add more settings options here */}
      </div>
    </div>
  );

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <button 
        className="settings-button"
        onClick={() => setIsSettingsOpen(true)}
      >
        ⚙️ Settings
      </button>

      {isSettingsOpen && <Settings />}

      {selectedCountry && (
        <>
          <div className="country-name">
            {selectedCountry.name}
          </div>
          <button className="exit-button" onClick={handleExit}>
            Exit to World Map
          </button>
        </>
      )}
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: "100vh", width: "100%" }}
        scrollWheelZoom={true}
      >
        <MapController selectedCountry={selectedCountry} />
        <TileLayer
          url={isDarkMode 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoData && (
          <GeoJSON
            key={isDarkMode ? 'dark' : 'light'}
            data={geoData}
            style={countryStyle}
            onEachFeature={onEachCountry}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default WorldMap; 