import React, { useState } from 'react';
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';
import poeData from './poeData.json';

function App() {
  const [deviceGroups, setDeviceGroups] = useState([]);
  const [error, setError] = useState(null);

  const addDeviceGroup = () => {
    setDeviceGroups([
      ...deviceGroups,
      { name: `Group ${deviceGroups.length + 1}`, devices: [], totalPower: 0 },
    ]);
  };

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
      updatedDeviceGroups[groupIndex].devices.push({
        name: model.name,
        powerConsumption: model.power_consumption_w,
        quantity: 1,
      });
    }

    setDeviceGroups(updatedDeviceGroups);
    setError(null);
  };

  const handleQuantityChange = (groupIndex, deviceIndex, quantity) => {
    const updatedDeviceGroups = [...deviceGroups];
    updatedDeviceGroups[groupIndex].devices[deviceIndex].quantity = quantity;
    setDeviceGroups(updatedDeviceGroups);
  };

  const removeDevice = (groupIndex, deviceIndex) => {
    const updatedDeviceGroups = [...deviceGroups];
    updatedDeviceGroups[groupIndex].devices.splice(deviceIndex, 1);
    setDeviceGroups(updatedDeviceGroups);
  };

  const handleGroupNameChange = (groupIndex, newName) => {
    const updatedDeviceGroups = [...deviceGroups];
    updatedDeviceGroups[groupIndex].name = newName;
    setDeviceGroups(updatedDeviceGroups);
  };

  const removeDeviceGroup = (groupIndex) => {
    const updatedDeviceGroups = deviceGroups.filter((_, index) => index !== groupIndex);
    setDeviceGroups(updatedDeviceGroups);
  };

  const downloadSpreadsheet = () => {
    const data = [];

    deviceGroups.forEach((group) => {
      group.devices.forEach((device) => {
        const totalDevicePoE = device.powerConsumption * device.quantity;
        data.push({
          Device: device.name,
          'PoE (W)': device.powerConsumption,
          Quantity: device.quantity,
          'Total PoE (W)': totalDevicePoE,
        });
      });

      // Add total row for the group
      const totalGroupPoE = group.devices.reduce(
        (sum, device) => sum + device.powerConsumption * device.quantity,
        0
      );

      data.push({
        Device: `Total for ${group.name}`,
        'PoE (W)': '',
        Quantity: '',
        'Total PoE (W)': totalGroupPoE,
      });

      // Add a blank row between groups
      data.push({});
    });

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'PoE Calculation');

    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([excelBuffer], { type: 'application/octet-stream' }),
      'PoE_Calculation.xlsx'
    );
  };

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

      {deviceGroups.map((group, groupIndex) => {
        const totalPower = group.devices.reduce(
          (sum, device) => sum + device.powerConsumption * device.quantity,
          0
        );

        return (
          <div
            key={groupIndex}
            style={{
              marginBottom: '30px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: 'black',
              marginTop: '20px',
            }}
          >
            <h3>
              <input
                type="text"
                value={group.name}
                onChange={(e) => handleGroupNameChange(groupIndex, e.target.value)}
                style={{
                  padding: '5px',
                  width: 'calc(100% - 10px)',
                  marginBottom: '10px',
                  fontSize: '18px',
                  boxSizing: 'border-box',
                }}
              />
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '10px', textAlign: 'left', width: '40%' }}>Device</th>
                  <th style={{ padding: '10px', textAlign: 'left', width: '20%' }}>PoE (W)</th>
                  <th style={{ padding: '10px', textAlign: 'left', width: '20%' }}>Quantity</th>
                  <th style={{ padding: '10px', textAlign: 'left', width: '20%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {group.devices.map((device, deviceIndex) => (
                  <tr key={deviceIndex}>
                    <td style={{ padding: '10px', textAlign: 'left' }}>{device.name}</td>
                    <td style={{ padding: '10px', textAlign: 'left' }}>{device.powerConsumption}</td>
                    <td style={{ padding: '10px', textAlign: 'left' }}>
                      <input
                        type="number"
                        value={device.quantity}
                        min="1"
                        onChange={(e) =>
                          handleQuantityChange(groupIndex, deviceIndex, parseInt(e.target.value))
                        }
                        style={{ width: '50px', padding: '5px' }}
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

            <div
              style={{
                marginTop: '20px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                color: '#333',
              }}
            >
              <h4>Results for {group.name}</h4>
              <p>Total Power: {totalPower} W</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button
                  onClick={downloadSpreadsheet}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                  }}
                >
                  Download Spreadsheet
                </button>
                <button
                  onClick={() => removeDeviceGroup(groupIndex)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                  }}
                >
                  Delete Group
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
