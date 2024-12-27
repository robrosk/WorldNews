import React from 'react';

const CountryDetail = ({ country, onBack }) => {
  return (
    <div className="country-detail">
      <button className="back-button" onClick={onBack}>
        ← Back to Map
      </button>
      <h1>{country.name}</h1>
      {/* Add more country details here */}
    </div>
  );
};

export default CountryDetail; 