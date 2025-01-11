import React from 'react';

const DeviceList = ({ devices }) => {
  const totalPower = devices.reduce(
    (sum, device) => sum + device.power_consumption_w * device.quantity,
    0
  );

  return (
    <div className="device-list">
      <h3>Device List</h3>
      <ul>
        {devices.map((device, index) => (
          <li key={index}>
            {device.quantity}x {device.name} - {device.power_consumption_w}W each
          </li>
        ))}
      </ul>
      <h4>Total Power: {totalPower}W</h4>
    </div>
  );
};

export default DeviceList;