import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/imagePickerModal.styles';
import MyFont from '../forms/MyFont'; // ✅ Import custom font component

const ImagePickerModal = ({ 
  visible, 
  onClose, 
  onTakePhoto, 
  onChooseFromGallery, 
  loading
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {/* 🧭 Header */}
            <View style={styles.header}>
              <MyFont style={styles.title}>Add Clothing Item</MyFont>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* 📸 Loading State */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <MyFont style={styles.loadingText}>Opening camera...</MyFont>
              </View>
            ) : (
              <View style={styles.optionsContainer}>
                
                {/* 📷 Take Photo Option */}
                <TouchableOpacity style={styles.option} onPress={onTakePhoto}>
                  <Ionicons name="camera" size={48} color="#6F8D6B" />
                  <MyFont style={styles.optionText}>Take Picture</MyFont>
                  <MyFont style={styles.optionSubtext}>Use your camera</MyFont>
                </TouchableOpacity>

                {/* 🖼️ Gallery Option */}
                <TouchableOpacity style={styles.option} onPress={onChooseFromGallery}>
                  <Ionicons name="images" size={48} color="#6F8D6B" />
                  <MyFont style={styles.optionText}>Add from Gallery</MyFont>
                  <MyFont style={styles.optionSubtext}>Choose existing photo</MyFont>
                </TouchableOpacity>

              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default ImagePickerModal;
