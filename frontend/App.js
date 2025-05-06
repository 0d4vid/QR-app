import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { toastConfig } from './toastConfig';

export default function App(){


  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [url, setUrl] = useState('');
  const [logo, setLogo] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  if (permissionResponse && !permissionResponse.granted) {
    requestPermission();
  }


  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted'){
      showToast('We need access to your photos to select a logo', 'error');
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1,1],
      quality:0.5
    });

    if (!result.canceled){
      setLogo(result.assets[0].uri);
    }
  };

  const generateQR = async () => {
    if (!url){
      showToast('Please enter a URL', 'error');
      return;
    }

    setLoading(true);
    try{
      const formData = new FormData();
      formData.append('url', url);

      if (logo){
        const localUri = logo;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';

        formData.append('logo',{
          uri: localUri,
          name: filename,
          type,
        });
      }
      const response = await axios.post('http://192.168.1.184:5000/generate', formData, {
        headers:{
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data?.qr_code){
        throw new Error("Invalind response from server");
      }

      const imageBytes = new Uint8Array(
        response.data.qr_code.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
      );
      const base64String = btoa(String.fromCharCode(...imageBytes));
      setQrCode(`data:image/png;base64,${base64String}`);

    } catch (error) {
        showToast(error.response?.data?.error || 'Failed to generate QR code', 'error');
    } finally{
      setLoading(false);
    }
  };

  const shareQR = async () => {
    if (!qrCode){
      showToast('Generate a QR code first', 'error');
      return;
    }

    try{
      // Convert base64 to local file
      const filename = `QR-${Date.now()}.png`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, qrCode.split(',')[1],{
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share the file
      await Sharing.shareAsync(fileUri);
    } catch{
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  const saveQR = async () => {
    if (!qrCode){
      showToast('Generate a QR code first', 'error');
      return;
    }

    try {
      const filename = `QR-${Date.now()}.png`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, qrCode.split(',')[1],{
        encoding: FileSystem.EncodingType.Base64,
      });

      await MediaLibrary.saveToLibraryAsync(fileUri);
      showToast('QR code saved to gallery!', 'success');
    } catch(error){
      showToast('Failed to save QR code', 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    Toast.show({
      type: type === 'error' ? 'error':
            type === 'succes' ? 'success' : 'info',
      text1: message,
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  return(

    <View style={styles.container}>

      <Text style={styles.title}>QR Generator</Text>

      
        <View style={styles.qrContainer}>
        {qrCode && (
          <>
          <Image
          source={{uri: qrCode}}
          style={styles.qrImage}
          resizeMode="contain"
        />

        <View style={styles.buttonRow}>
        <TouchableOpacity onPress={shareQR}>
          <Feather name="share-2" size={24} color="white"/>
        </TouchableOpacity>
        <View style={styles.buttonSpacer}/>
        <TouchableOpacity onPress={saveQR}>
          <Feather name="download" size={24} color="white"/>
        </TouchableOpacity>
        </View>
          </>
        )}
        </View>

      

      <TextInput
        style={styles.input}
        placeholder="Enter URL (e.g., https://google.com)"
        placeholderTextColor="#999"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />

      <TouchableOpacity 
      style={styles.logoButton} 
      onPress={pickImage}
      >
        <Text style={styles.logoButtonText}>
          {logo ? "Change Logo" : "Insert a Logo (Optional)"}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonSpacer2}/>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#2196F3"/>
      ) : (
        <TouchableOpacity 
        onPress={generateQR} 
        style={[styles.GenenarateBtn, !url && styles.disabled]} 
        disabled={!url}
        >
          <Text style={styles.generateButtonText}>Generate QR code</Text>
        </TouchableOpacity>
      )}
      <Toast/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#181818',
  },
  title:{
    color:'#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  input:{
    height: 50,
    borderColor: '#e1e1e1',
    borderWidth: 1,
    borderRadius: 30,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  qrContainer:{
    padding: 20,
    alignItems: 'center',
    marginBottom: 40,
    borderRadius: 30,
  },
  qrImage:{
    width: 200,
    height: 200,
    alignSelf: 'center',
    borderRadius: 20,
    borderColor:'#e1e1e1',
    marginTop: 30,
  },
  buttonRow:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    
  },
  buttonSpacer:{
    width: 50,
  },
  logoButton:{
    backgroundColor:'#84D9FF',
    borderRadius:35,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoButtonText:{
    color:'black',
  },
  GenenarateBtn:{
    backgroundColor:'#4AC6FF',
    borderRadius:35,
    padding: 15,
    alignItems: 'center'
  },
  generateButtonText:{
    color: 'black',
  },
  disabled:{
    opacity: 0.6,
  },
  
  loader:{
    marginVertical: 20,
  },
});