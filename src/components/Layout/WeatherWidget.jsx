/**
 * WEATHER WIDGET - DISPLAYS CURRENT WEATHER CONDITIONS
 * 
 * This component shows:
 * - Current temperature with color coding (cold=blue, hot=red)
 * - Weather condition with appropriate icon
 * - City location with GPS icon
 * - Refresh button to manually update weather
 * - Loading state while fetching data
 * - Error state with retry option
 * 
 * Props:
 * - onPress: Function called when widget is tapped
 * 
 * Uses WeatherContext to get weather data automatically
 * Uses custom MyFont component for consistent typography
 */

import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../../context/WeatherContext';    // Get weather data
import styles from '../../styles/weatherWidget.styles';       // External styles
import MyFont from '../forms/MyFont'; // ✅ Custom font component

const WeatherWidget = ({ onPress }) => {
  // Get weather data and functions from context
  const { weather, loading, error, refreshWeather } = useWeather();

  // Map weather conditions to appropriate icons
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

  // Color-code temperature based on value
  const getTemperatureColor = (temp) => {
    if (temp <= 0) return '#4A90E2';   // Freezing - Blue
    if (temp <= 15) return '#50C878';  // Cold - Green
    if (temp <= 25) return '#FFA500';  // Mild - Orange
    return '#FF6B6B';                  // Hot - Red
  };

  // LOADING STATE - Show spinner while fetching weather
  if (loading) {
    return (
      <TouchableOpacity style={styles.widget} onPress={onPress}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <MyFont style={styles.loadingText}>Getting weather...</MyFont>
        </View>
      </TouchableOpacity>
    );
  }

  // ERROR STATE - Show retry button if weather fetch failed
  if (error && !weather) {
    return (
      <TouchableOpacity style={styles.widget} onPress={refreshWeather}>
        <View style={styles.errorContainer}>
          <Ionicons name="refresh" size={20} color="#FF6B6B" />
          <MyFont style={styles.errorText}>Tap to retry</MyFont>
        </View>
      </TouchableOpacity>
    );
  }

  // NO DATA STATE - Show message if no weather data available
  if (!weather) {
    return (
      <View style={styles.widget}>
        <MyFont style={styles.errorText}>No weather data available</MyFont>
      </View>
    );
  }

  // MAIN WEATHER DISPLAY - Show weather info when data is available
  return (
    <TouchableOpacity style={styles.widget} onPress={onPress}>
      <View style={styles.content}>
        {/* Left section: Weather icon and temperature/description */}
        <View style={styles.leftSection}>
          <Ionicons
            name={getWeatherIcon(weather.condition)}
            size={32}
            color="#007AFF"
          />
          <View style={styles.weatherInfo}>
            {/* Temperature with color coding */}
            <MyFont
              style={[
                styles.temperature,
                { color: getTemperatureColor(weather.temperature) }
              ]}
            >
              {weather.temperature}°C
            </MyFont>

            {/* Weather description (e.g., "Partly cloudy") */}
            <MyFont style={styles.description}>
              {weather.description}
            </MyFont>
          </View>
        </View>

        {/* Right section: Location and refresh button */}
        <View style={styles.rightSection}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            {/* City name from GPS location */}
            <MyFont style={styles.city}>
              {weather.city}
            </MyFont>
          </View>

          {/* Manual refresh button */}
          <TouchableOpacity onPress={refreshWeather} style={styles.refreshButton}>
            <Ionicons name="refresh" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Show warning if there was an error but we have cached data */}
      {error && (
        <MyFont style={styles.warningText}>Using default location</MyFont>
      )}
    </TouchableOpacity>
  );
};

export default WeatherWidget;
