import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/clothingForm.styles.js';
import MyFont from './MyFont';


const ClothingForm = ({ image, onSubmit, onCancel }) => {
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

  const categories = [
    { id: 'tops', name: 'Tops', icon: 'shirt' },
    { id: 'bottoms', name: 'Bottoms', icon: 'walk' },
    { id: 'dresses', name: 'Dresses', icon: 'woman' },
    { id: 'outerwear', name: 'Outerwear', icon: 'layers' },
    { id: 'shoes', name: 'Shoes', icon: 'footsteps' },
    { id: 'accessories', name: 'Accessories', icon: 'watch' },
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000',
  ];

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'All Year'];

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleSubmit = () => {
    if (!itemName.trim() || !selectedCategory) {
      alert('Please fill in the item name and select a category');
      return;
    }

    onSubmit({
      name: itemName,
      category: selectedCategory,
      colors: selectedColors,
      season: selectedSeason,
      image: image,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🖼️ Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.previewImage} />
      </View>

      {/* 🏷️ Item name */}
      <View style={styles.section}>
        <MyFont style={styles.label}>Item Name</MyFont>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Blue Denim Jacket"
          value={itemName}
          onChangeText={setItemName}
        />
      </View>

      {/* 👕 Category */}
      <View style={styles.section}>
        <MyFont style={styles.label}>Category</MyFont>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon}
                size={24}
                color={selectedCategory === category.id ? '#fff' : '#6F8D6B'}
              />
              <MyFont
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}
              >
                {category.name}
              </MyFont>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 🎨 Colors */}
      <View style={styles.section}>
        <MyFont style={styles.label}>Colors</MyFont>
        <View style={styles.colorGrid}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColors.includes(color) && styles.selectedColor
              ]}
              onPress={() => toggleColor(color)}
            >
              {selectedColors.includes(color) && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={color === '#FFFFFF' ? '#000' : '#fff'}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 🌱 Season */}
      <View style={styles.section}>
        <MyFont style={styles.label}>Season</MyFont>
        <View style={styles.seasonContainer}>
          {seasons.map((season) => (
            <TouchableOpacity
              key={season}
              style={[
                styles.seasonButton,
                selectedSeason === season && styles.selectedSeason
              ]}
              onPress={() => setSelectedSeason(season)}
            >
              <MyFont
                style={[
                  styles.seasonText,
                  selectedSeason === season && styles.selectedSeasonText
                ]}
              >
                {season}
              </MyFont>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 🆗 Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <MyFont style={styles.cancelButtonText}>Cancel</MyFont>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <MyFont style={styles.submitButtonText}>Add to Wardrobe</MyFont>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ClothingForm;
