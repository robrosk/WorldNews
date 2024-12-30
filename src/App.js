import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WorldMap from './components/WorldMap';
import './App.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <h1>Welcome to World Explorer</h1>
      <Link to="/map">
        <button className="enter-button">Enter World Map</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<WorldMap />} />
      </Routes>
    </Router>
  );
}

export default App; 