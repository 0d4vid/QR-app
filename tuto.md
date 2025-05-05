Let's build your QR code generator app step-by-step. I'll explain every part in detail, even if you're new to Flask!

---

### **Project Structure**
```
qr-app/
├── backend/               # Flask API
│   ├── app.py
│   └── requirements.txt
└── frontend/              # React Native App
    ├── App.js
    └── package.json
```

---

### **Part 1: Flask Backend Setup**

#### **1.1 Create Backend Folder**
```bash
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
# OR 
venv\Scripts\activate    # Windows
```

#### **1.2 Install Dependencies**
```bash
pip install flask pillow qrcode flask-cors
```

Create `requirements.txt`:
```bash
pip freeze > requirements.txt
```

#### **1.3 Create Flask App (`app.py`)**
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import qrcode
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native

def generate_qr_with_logo(url, logo_file=None):
    # Create QR code
    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

    # Add logo if provided
    if logo_file:
        logo = Image.open(logo_file.stream)
        logo_size = (img.size[0] // 4, img.size[1] // 4)
        logo.thumbnail(logo_size)
        position = (
            (img.size[0] - logo.size[0]) // 2,
            (img.size[1] - logo.size[1]) // 2
        )
        img.paste(logo, position, mask=logo.split()[3] if logo.mode == 'RGBA' else None)
    
    # Convert to bytes
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()

@app.route('/generate', methods=['POST'])
def generate_qr():
    try:
        url = request.form.get('url')
        logo = request.files.get('logo')
        
        if not url:
            return jsonify(error="URL is required"), 400
        
        qr_image = generate_qr_with_logo(url, logo)
        return jsonify(qr_code=qr_image.hex())
    
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

#### **1.4 Key Flask Concepts Explained**
- `@app.route`: Defines API endpoint
- `request.form`: Access form data (text inputs)
- `request.files`: Access uploaded files
- `CORS`: Allows cross-origin requests from mobile app
- `io.BytesIO`: Handles image data in memory

#### **1.5 Run Flask Server**
```bash
python app.py
```
Test with Postman or curl:
```bash
curl -X POST -F "url=https://google.com" -F "logo=@logo.png" http://localhost:5000/generate
```

---

### **Part 2: React Native Frontend**

#### **2.1 Create React Native Project**
```bash
npx create-expo-app frontend
cd frontend
npx expo install expo-image-picker axios
```

#### **2.2 App.js (Full Code)**
```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function App() {
  const [url, setUrl] = useState('');
  const [logo, setLogo] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to select a logo');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  const generateQR = async () => {
    if (!url) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('url', url);

      if (logo) {
        const localUri = logo;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';

        formData.append('logo', {
          uri: localUri,
          name: filename,
          type,
        });
      }

      const response = await axios.post('http://YOUR_LOCAL_IP:5000/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageBytes = new Uint8Array(
        response.data.qr_code.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
      );
      const base64String = btoa(String.fromCharCode(...imageBytes));
      setQrCode(`data:image/png;base64,${base64String}`);
      
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter URL (e.g., https://google.com)"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        keyboardType="url"
      />
      
      <Button
        title={logo ? "Change Logo" : "Add Logo (Optional)"}
        onPress={pickImage}
        color="#2196F3"
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#2196F3" />
      ) : (
        <Button
          title="Generate QR Code"
          onPress={generateQR}
          color="#4CAF50"
        />
      )}

      {qrCode && (
        <Image
          source={{ uri: qrCode }}
          style={styles.qrImage}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  qrImage: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginTop: 30,
  },
  loader: {
    marginVertical: 20,
  },
});
```

#### **2.3 Key Frontend Concepts Explained**
- `expo-image-picker`: Handles image selection from device
- `FormData`: Constructs multipart form data for file upload
- `axios`: Makes HTTP requests to Flask backend
- Base64 Conversion: Converts hex string from Flask to displayable image

#### **2.4 Replace YOUR_LOCAL_IP**
Find your computer's local IP:
- **Windows**: `ipconfig` (look for IPv4 Address)
- **Mac/Linux**: `ifconfig | grep "inet "`

Update the axios POST URL:
```javascript
await axios.post('http://192.168.1.5:5000/generate', formData, ...)
```

---

### **Part 3: Run the Full Stack**

#### **3.1 Start Flask Backend**
```bash
cd backend
python app.py
```

#### **3.2 Start React Native App**
```bash
cd frontend
npx expo start
```

Scan the QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

---

### **Part 4: Testing Workflow**
1. Enter a valid URL (e.g., `https://google.com`)
2. Tap "Add Logo" to select an image (optional)
3. Tap "Generate QR Code"
4. See the generated QR code with/without logo
5. Scan it with your phone's camera to verify

---

### **Troubleshooting**
#### **Common Issues**
1. **Connection Refused**:
   - Ensure both devices are on same network
   - Disable firewall/antivirus temporarily
   - Use `http://10.0.2.2:5000` for Android emulator

2. **Image Upload Fails**:
   - Check image format (PNG/JPG)
   - Verify Flask server logs for errors

3. **CORS Errors**:
   - Double-check `flask-cors` is installed
   - Restart Flask server after installation

---

### **Next Steps**
1. **Add Features**:
   - QR code saving/sharing
   - Color customization
   - History storage

2. **Deploy Backend**:
   - Use PythonAnywhere or Heroku
   - Update frontend API URL

3. **Build Release APK/IPA**:
   ```bash
   npx expo prebuild
   npx expo run:android  # or run:ios
   ```

Want me to explain any part in more detail or add specific features?