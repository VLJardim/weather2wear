import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../../context/WeatherContext';
import styles from '../../styles/weatherWidget.styles';
import MyFont from '../forms/MyFont'; // ✅ Import custom font

const WeatherWidget = ({ onPress }) => {
  const { weather, loading, error, refreshWeather } = useWeather();

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear': return 'sunny';
      case 'clouds': return 'cloudy';
      case 'rain': return 'rainy';
      case 'snow': return 'snow';
      case 'thunderstorm': return 'thunderstorm';
      default: return 'partly-sunny';
    }
  };

  const getTemperatureColor = (temp) => {
    if (temp <= 0) return '#4A90E2';
    if (temp <= 15) return '#50C878';
    if (temp <= 25) return '#FFA500';
    return '#FF6B6B';
  };

  if (loading) {
    return (
      <TouchableOpacity style={styles.widget} onPress={onPress}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          {/* ✅ MyFont for loading text */}
          <MyFont style={styles.loadingText}>Getting weather...</MyFont>
        </View>
      </TouchableOpacity>
    );
  }

  if (error && !weather) {
    return (
      <TouchableOpacity style={styles.widget} onPress={refreshWeather}>
        <View style={styles.errorContainer}>
          <Ionicons name="refresh" size={20} color="#FF6B6B" />
          {/* ✅ MyFont for error text */}
          <MyFont style={styles.errorText}>Tap to retry</MyFont>
        </View>
      </TouchableOpacity>
    );
  }

  if (!weather) {
    return (
      <View style={styles.widget}>
        {/* ✅ MyFont for fallback message */}
        <MyFont style={styles.errorText}>No weather data available</MyFont>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.widget} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Ionicons
            name={getWeatherIcon(weather.condition)}
            size={32}
            color="#007AFF"
          />
          <View style={styles.weatherInfo}>
            {/* ✅ Temperature */}
            <MyFont
              style={[
                styles.temperature,
                { color: getTemperatureColor(weather.temperature) }
              ]}
            >
              {weather.temperature}°C
            </MyFont>

            {/* ✅ Description */}
            <MyFont style={styles.description}>
              {weather.description}
            </MyFont>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            {/* ✅ City name */}
            <MyFont style={styles.city}>
              {weather.city}
            </MyFont>
          </View>

          <TouchableOpacity onPress={refreshWeather} style={styles.refreshButton}>
            <Ionicons name="refresh" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <MyFont style={styles.warningText}>Using default location</MyFont>
      )}
    </TouchableOpacity>
  );
};

export default WeatherWidget;
