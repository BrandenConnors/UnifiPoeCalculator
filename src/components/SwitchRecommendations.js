import React from 'react';
import switches from '../data/switches.json';

const SwitchRecommendations = ({ totalPower }) => {
  const recommendations = switches.filter(
    (sw) => sw.poe_availability_w >= totalPower
  );

  return (
    <div className="switch-recommendations">
      <h3>Recommended Switches</h3>
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((sw, index) => (
            <li key={index}>
              {sw.model} - {sw.poe_availability_w}W ({sw.supported_poe_modes.join(', ')})
            </li>
          ))}
        </ul>
      ) : (
        <p>No suitable switches available.</p>
      )}
    </div>
  );
};

export default SwitchRecommendations;