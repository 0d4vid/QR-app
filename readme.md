# QR Code Generator App

This project is a full-stack QR Code Generator application that allows users to generate QR codes with optional logos. The app consists of a **Flask backend** for generating QR codes and a **React Native frontend** for the user interface.

---
# User interface

<image src="./.github/image.png"/>

---

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Features

### Backend
- Generate QR codes from a URL.
- Add an optional logo to the QR code.
- Serve the QR code as a response in hexadecimal format.

### Frontend
- User-friendly interface to input URLs.
- Option to upload a logo for the QR code.
- Display the generated QR code.
- Save the QR code to the device gallery.
- Share the QR code via other apps.

---

## Project Structure

```
QR-app/
├── backend/               # Flask API
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Backend dependencies
│   └── pyproject.toml     # Backend project metadata
└── frontend/              # React Native App
    ├── App.js             # Main React Native component
    ├── package.json       # Frontend dependencies
    ├── android/           # Android-specific files
    ├── assets/            # App assets (icons, splash screens, etc.)
    └── toastConfig.js     # Toast notification configuration
```

---

## Technologies Used

### Backend
- **Flask**: Python web framework.
- **Flask-CORS**: To handle cross-origin requests.
- **QRCode**: For generating QR codes.
- **Pillow**: For image processing.

### Frontend
- **React Native**: Cross-platform mobile app framework.
- **Expo**: For building and running the app.
- **Axios**: For making HTTP requests.
- **Expo Image Picker**: For selecting images from the device.
- **Expo Sharing**: For sharing files.
- **Expo Media Library**: For saving files to the device gallery.

---

## Setup Instructions

### Backend Setup

1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # OR
   source venv/bin/activate  # On macOS/Linux
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask Server**:
   ```bash
   python app.py
   ```

5. **Test the API**:
   Use Postman or `curl` to test the `/generate` endpoint:
   ```bash
   curl -X POST -F "url=https://google.com" -F "logo=@logo.png" http://localhost:5000/generate
   ```

---

### Frontend Setup

1. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Expo Development Server**:
   ```bash
   npx expo start
   ```

4. **Run the App**:
   - Scan the QR code displayed in the terminal using the **Expo Go** app on your mobile device.

5. **Replace Backend URL**:
   - Update the backend URL in `App.js` with your local IP address:
     ```javascript
     const response = await axios.post('http://YOUR_LOCAL_IP:5000/generate', formData, ...);
     ```

   - Find your local IP address:
     - **Windows**: Run `ipconfig` and look for the IPv4 address.
     - **macOS/Linux**: Run `ifconfig` and look for the `inet` address.

---

## Usage

1. **Enter a URL**:
   - Input the URL you want to generate a QR code for.

2. **Add a Logo (Optional)**:
   - Tap the "Insert a Logo" button to select an image from your device.

3. **Generate QR Code**:
   - Tap the "Generate QR Code" button to create the QR code.

4. **Save or Share**:
   - Save the QR code to your gallery or share it via other apps.

---

## Troubleshooting

### Common Issues

1. **Connection Refused**:
   - Ensure both your mobile device and computer are on the same network.
   - Disable any firewall or antivirus software temporarily.

2. **CORS Errors**:
   - Ensure `flask-cors` is installed and enabled in the backend.

3. **Image Upload Fails**:
   - Verify the image format (PNG/JPG).
   - Check the Flask server logs for errors.

4. **Expo Go App Not Connecting**:
   - Ensure your mobile device is on the same network as your computer.
   - Restart the Expo development server.

---

## Next Steps

1. **Add Features**:
   - QR code customization (colors, sizes, etc.).
   - History of generated QR codes.

2. **Deploy Backend**:
   - Use a cloud platform like Heroku or PythonAnywhere.
   - Update the frontend API URL to the deployed backend.

3. **Build Release APK/IPA**:
   - For Android:
     ```bash
     npx expo prebuild
     npx expo run:android
     ```
   - For iOS:
     ```bash
     npx expo run:ios
     ```

---

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.

---

## Acknowledgments

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)