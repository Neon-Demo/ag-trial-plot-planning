import axios from 'axios';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

// Constants - would normally be imported from environment variables
const WEATHER_API_KEY = 'YOUR_API_KEY'; // Replace with actual OpenWeatherMap API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

// Weather data types
export interface WeatherData {
  location: string;
  date: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  day: string;
  high: number;
  low: number;
  icon: string;
}

// Helper function to convert OpenWeatherMap icon to Ionicons name
const mapWeatherIconToIonicon = (iconCode: string): string => {
  const iconMap: Record<string, string> = {
    '01d': 'sunny', // clear sky day
    '01n': 'moon', // clear sky night
    '02d': 'partly-sunny', // few clouds day
    '02n': 'cloudy-night', // few clouds night
    '03d': 'cloudy', // scattered clouds
    '03n': 'cloudy',
    '04d': 'cloudy', // broken clouds
    '04n': 'cloudy',
    '09d': 'rainy', // shower rain
    '09n': 'rainy',
    '10d': 'rainy', // rain
    '10n': 'rainy',
    '11d': 'thunderstorm', // thunderstorm
    '11n': 'thunderstorm',
    '13d': 'snow', // snow
    '13n': 'snow',
    '50d': 'cloud', // mist
    '50n': 'cloud',
  };

  return iconMap[iconCode] || 'help-circle';
};

// Format date for display
const formatDay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
};

export const WeatherService = {
  // Get current weather and forecast using device location
  getCurrentWeather: async (): Promise<WeatherData | null> => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch local weather.');
        return null;
      }
      
      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Make API request to OpenWeatherMap
      const response = await axios.get(`${WEATHER_API_URL}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          units: 'metric', // Use metric for Celsius
          appid: WEATHER_API_KEY,
        },
      });
      
      // Get 5-day forecast
      const forecastResponse = await axios.get(`${WEATHER_API_URL}/forecast`, {
        params: {
          lat: latitude,
          lon: longitude,
          units: 'metric',
          appid: WEATHER_API_KEY,
        },
      });
      
      // Process forecast data (get one entry per day)
      const dailyForecasts: ForecastDay[] = [];
      const processedDays = new Set<string>();
      
      // Start from index 1 to skip today (we already have today's weather)
      for (let i = 1; i < forecastResponse.data.list.length && dailyForecasts.length < 3; i++) {
        const item = forecastResponse.data.list[i];
        const day = formatDay(item.dt);
        
        // Skip if we already have this day
        if (processedDays.has(day)) continue;
        
        processedDays.add(day);
        dailyForecasts.push({
          day,
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          icon: mapWeatherIconToIonicon(item.weather[0].icon),
        });
      }
      
      // Convert response to our WeatherData format
      const weatherData: WeatherData = {
        location: response.data.name,
        date: 'Today',
        temperature: Math.round(response.data.main.temp),
        condition: response.data.weather[0].main,
        icon: mapWeatherIconToIonicon(response.data.weather[0].icon),
        humidity: response.data.main.humidity,
        precipitation: response.data.rain ? 
          Math.round(response.data.rain['1h'] * 100) || 0 : 
          Math.round(response.data.clouds.all / 5), // Rough estimate based on cloud cover if rain data isn't available
        windSpeed: Math.round(response.data.wind.speed),
        forecast: dailyForecasts,
      };
      
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  },
  
  // Get weather for a specific location by name
  getWeatherByLocation: async (locationName: string): Promise<WeatherData | null> => {
    try {
      // Make API request to OpenWeatherMap
      const response = await axios.get(`${WEATHER_API_URL}/weather`, {
        params: {
          q: locationName,
          units: 'metric', // Use metric for Celsius
          appid: WEATHER_API_KEY,
        },
      });
      
      // Get coordinates for forecast
      const { lat, lon } = response.data.coord;
      
      // Get 5-day forecast
      const forecastResponse = await axios.get(`${WEATHER_API_URL}/forecast`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: WEATHER_API_KEY,
        },
      });
      
      // Process forecast data (get one entry per day)
      const dailyForecasts: ForecastDay[] = [];
      const processedDays = new Set<string>();
      
      // Start from index 1 to skip today (we already have today's weather)
      for (let i = 1; i < forecastResponse.data.list.length && dailyForecasts.length < 3; i++) {
        const item = forecastResponse.data.list[i];
        const day = formatDay(item.dt);
        
        // Skip if we already have this day
        if (processedDays.has(day)) continue;
        
        processedDays.add(day);
        dailyForecasts.push({
          day,
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          icon: mapWeatherIconToIonicon(item.weather[0].icon),
        });
      }
      
      // Convert response to our WeatherData format
      const weatherData: WeatherData = {
        location: response.data.name,
        date: 'Today',
        temperature: Math.round(response.data.main.temp),
        condition: response.data.weather[0].main,
        icon: mapWeatherIconToIonicon(response.data.weather[0].icon),
        humidity: response.data.main.humidity,
        precipitation: response.data.rain ? 
          Math.round(response.data.rain['1h'] * 100) || 0 : 
          Math.round(response.data.clouds.all / 5), // Rough estimate based on cloud cover if rain data isn't available
        windSpeed: Math.round(response.data.wind.speed),
        forecast: dailyForecasts,
      };
      
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data for location:', error);
      return null;
    }
  },
};