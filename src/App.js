import React, { useState, useEffect } from 'react';
import poeData from './poeData.json';

function App() {
  const [deviceGroups, setDeviceGroups] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Add a new device group
  const addDeviceGroup = () => {
    setDeviceGroups([
      ...deviceGroups,
      { name: `Group ${deviceGroups.length + 1}`, devices: [], totalPower: 0, maxPoeMode: 'PoE' },
    ]);
  };

  // Handle device selection (adding devices to a group)
  const handleDeviceSelection = (groupIndex, model) => {
    if (!model) {
      setError('ERROR: Model is undefined');
      return;
    }

    const updatedDeviceGroups = [...deviceGroups];
    const deviceInGroup = updatedDeviceGroups[groupIndex].devices.find(
      (device) => device.name === model.name
    );

    if (deviceInGroup) {
      deviceInGroup.quantity += 1;
    } else {
      const newDevice = {
        name: model.name,
        powerConsumption: model.power_consumption_w,
        poeMode: model.poe_modes[0],
        quantity: 1,
      };
      updatedDeviceGroups[groupIndex].devices.push(newDevice);
    }
    setDeviceGroups(updatedDeviceGroups);
    setError(null);
  };

  // Handle quantity change
  const handleQuantityChange = (groupIndex, deviceIndex, quantity) => {
    const updatedDeviceGroups = [...deviceGroups];
    updatedDeviceGroups[groupIndex].devices[deviceIndex].quantity = quantity;
    setDeviceGroups(updatedDeviceGroups);
  };

  // Handle device removal
  const removeDevice = (groupIndex, deviceIndex) => {
    const updatedDeviceGroups = [...deviceGroups];
    updatedDeviceGroups[groupIndex].devices.splice(deviceIndex, 1);
    setDeviceGroups(updatedDeviceGroups);
  };

  // Handle device group name change
  const handleGroupNameChange = (groupIndex, newName) => {
    const updatedDeviceGroups = [...deviceGroups];
    updatedDeviceGroups[groupIndex].name = newName;
    setDeviceGroups(updatedDeviceGroups);
  };

  // Handle removing an entire device group
  const removeDeviceGroup = (groupIndex) => {
    const updatedDeviceGroups = deviceGroups.filter((_, index) => index !== groupIndex);
    setDeviceGroups(updatedDeviceGroups);
  };

  // Function to suggest switches based on power and port requirements
  const getSwitchSuggestions = (devices) => {
    const totalPorts = devices.reduce((sum, device) => sum + device.quantity, 0);
    const totalPower = devices.reduce(
      (sum, device) => sum + device.powerConsumption * device.quantity,
      0
    );

    const validSwitches = poeData.switches.filter(
      (sw) => sw.poe_ports >= totalPorts && sw.poe_availability_w >= totalPower
    );

    validSwitches.sort((a, b) => {
      if (a.poe_ports !== b.poe_ports) return a.poe_ports - b.poe_ports;
      return a.poe_availability_w - b.poe_availability_w;
    });

    return validSwitches.slice(0, 2).map((sw) => ({
      model: sw.model,
      poePorts: sw.poe_ports,
      poeAvailability: sw.poe_availability_w,
    }));
  };

  // Automatically calculate power and suggest switches when device groups change
  useEffect(() => {
    const groupResults = deviceGroups.map((group) => {
      const totalPorts = group.devices.reduce((sum, device) => sum + device.quantity, 0);
      const totalPower = group.devices.reduce(
        (sum, device) => sum + device.powerConsumption * device.quantity,
        0
      );

      const switchSuggestions = getSwitchSuggestions(group.devices);

      return { groupName: group.name, totalPorts, totalPower, switchSuggestions };
    });
    setResults(groupResults);
  }, [deviceGroups]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#003366', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ textAlign: 'center' }}>Unifi PoE Calculator</h1>
      <button
        onClick={addDeviceGroup}
        style={{
          padding: '10px',
          marginBottom: '20px',
          display: 'block',
          width: '200px',
          margin: '0 auto',
        }}
      >
        Add Device Group
      </button>

      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      {deviceGroups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          style={{
            marginBottom: '30px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <h3>
            <input
              type="text"
              value={group.name}
              onChange={(e) => handleGroupNameChange(groupIndex, e.target.value)}
              style={{
                padding: '5px',
                width: '100%',
                marginBottom: '10px',
                fontSize: '18px',
              }}
            />
          </h3>
          <button
            onClick={() => removeDeviceGroup(groupIndex)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#ff4d4d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginBottom: '10px',
            }}
          >
            Delete Group
          </button>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Device</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Power (W)</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Quantity</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {group.devices.map((device, deviceIndex) => (
                <tr key={deviceIndex}>
                  <td style={{ padding: '10px', textAlign: 'left' }}>{device.name}</td>
                  <td style={{ padding: '10px', textAlign: 'left' }}>{device.powerConsumption} W</td>
                  <td style={{ padding: '10px', textAlign: 'left' }}>
                    <input
                      type="number"
                      value={device.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(groupIndex, deviceIndex, parseInt(e.target.value))
                      }
                      style={{ padding: '5px', width: '60px' }}
                    />
                  </td>
                  <td style={{ padding: '10px', textAlign: 'left' }}>
                    <button
                      onClick={() => removeDevice(groupIndex, deviceIndex)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#ff4d4d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {poeData.devices.map((category) => (
            <div key={category.category} style={{ marginBottom: '10px' }}>
              <h4>{category.category}</h4>
              <select
                onChange={(e) => {
                  const selectedModel = poeData.devices
                    .find((cat) => cat.category === category.category)
                    .models.find((m) => m.name === e.target.value);
                  handleDeviceSelection(groupIndex, selectedModel);
                }}
                style={{ padding: '5px', width: '100%' }}
              >
                <option value="">Select a Device</option>
                {category.models.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ))}

      {results &&
        results.map((result, index) => (
          <div
            key={index}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: 'black',
            }}
          >
            <h3>{result.groupName} Results</h3>
            <p>Total Ports: {result.totalPorts}</p>
            <p>Total Power: {result.totalPower} W</p>
            <h4>Switch Suggestions:</h4>
            {result.switchSuggestions.length > 0 ? (
              <ul>
                {result.switchSuggestions.map((sw, idx) => (
                  <li key={idx}>
                    {sw.model} - Ports: {sw.poePorts}, PoE Power: {sw.poeAvailability} W
                  </li>
                ))}
              </ul>
            ) : (
              <p>No suitable switches found.</p>
            )}
          </div>
        ))}
    </div>
  );
}

export default App;
