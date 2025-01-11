import React, { useState } from 'react';
import devices from '../data/devices.json';

const DeviceSelector = ({ addDevice }) => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (selectedDevice && quantity > 0) {
      const device = devices.find((d) => d.name === selectedDevice);
      addDevice({ ...device, quantity });
      setSelectedDevice('');
      setQuantity(1);
    }
  };

  return (
    <div className="device-selector">
      <select
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
      >
        <option value="">Select Device</option>
        {devices.map((device) => (
          <option key={device.name} value={device.name}>
            {device.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
      />
      <button onClick={handleAdd}>Add Device</button>
    </div>
  );
};

export default DeviceSelector;