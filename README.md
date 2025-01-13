Unifi PoE Calculator
Overview

The Unifi PoE Calculator is a React-based web application designed to help users manage and calculate Power over Ethernet (PoE) requirements for multiple device groups. It allows users to add devices to specific groups, adjust the quantity of each device, and automatically calculates the total power consumption for each group. Based on the power consumption, it then suggests suitable PoE switches to meet the power requirements.
Features

    Device Group Management: Add, remove, and rename device groups.
    Device Selection: Add devices to a group from a predefined list of models, including the ability to adjust the quantity.
    PoE Power Calculation: Automatically calculate the total power required for each group based on the devices and their quantities.
    Switch Suggestions: Based on the calculated power, suggest appropriate PoE switches from a list of available models.
    Device Removal: Remove devices from a group, updating the total power accordingly.
    Error Handling: Alerts for undefined device models and invalid inputs.

How to Use

    Add Device Group: Click the "Add Device Group" button to create a new group of devices.
    Select Devices: For each group, select devices from the available categories. You can select a device by choosing it from a dropdown menu.
    Adjust Device Quantity: Adjust the number of devices in a group by changing the quantity input field next to each device.
    View Results: After adding devices to a group, the app will automatically calculate the total power consumption for the group and suggest suitable PoE switches to meet the power requirements.

Components

    Device Groups: A list of groups where each group contains a set of devices.
    Devices: Each device has properties such as name, power consumption (in watts), and the PoE mode it supports.
    Switch Suggestions: Based on the total power required, the app will suggest the necessary number of PoE switches from the available options.

Technical Details

    React: The app is built using React, using hooks such as useState and useEffect for state management and side effects.
    JSON Data: The device and switch data is loaded from a local JSON file (poeData.json), which contains categories of devices and switch models.
    Power Calculation: The total power consumption is calculated by multiplying the device power consumption by the quantity and summing for all devices in the group.
    Switch Selection: Based on the total power required, the app suggests PoE switches by matching their availability to the power needs.

Installation

To run this app locally:

    Clone the repository.

git clone <repository-url>
cd <repository-directory>

Install dependencies.

npm install

Start the development server.

    npm start

    The app should now be running at http://localhost:3000.

File Structure

/public
  /index.html
/src
  /App.js
  /poeData.json
  /index.js
/package.json

Dependencies

    React: A JavaScript library for building user interfaces.
    React DOM: Provides DOM-specific methods for React.

Contributing

Feel free to fork the repository and create a pull request for any improvements or bug fixes.
License

This project is licensed under the MIT License - see the LICENSE file for details.
