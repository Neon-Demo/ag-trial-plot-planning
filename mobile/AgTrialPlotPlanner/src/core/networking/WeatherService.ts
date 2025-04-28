import axios from 'axios';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

// Constants - would normally be imported from environment variables
const WEATHER_API_KEY = 'YOUR_API_KEY'; // Replace with actual AccuWeather API key
const WEATHER_BASE_URL = 'https://dataservice.accuweather.com';

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

// Helper function to convert AccuWeather icon to Ionicons name
const mapWeatherIconToIonicon = (iconCode: number): string => {
  // AccuWeather has icon codes from 1-44
  const iconMap: Record<number, string> = {
    1: 'sunny', // Sunny
    2: 'sunny', // Mostly Sunny
    3: 'partly-sunny', // Partly Sunny
    4: 'partly-sunny', // Intermittent Clouds
    5: 'cloudy', // Hazy Sunshine
    6: 'cloudy', // Mostly Cloudy
    7: 'cloudy', // Cloudy
    8: 'cloudy', // Dreary (Overcast)
    11: 'cloudy', // Fog
    12: 'rainy', // Showers
    13: 'rainy', // Mostly Cloudy w/ Showers
    14: 'partly-sunny', // Partly Sunny w/ Showers
    15: 'thunderstorm', // Thunderstorms
    16: 'thunderstorm', // Mostly Cloudy w/ Thunderstorms
    17: 'thunderstorm', // Partly Sunny w/ Thunderstorms
    18: 'rainy', // Rain
    19: 'snow', // Flurries
    20: 'snow', // Mostly Cloudy w/ Flurries
    21: 'snow', // Partly Sunny w/ Flurries
    22: 'snow', // Snow
    23: 'snow', // Mostly Cloudy w/ Snow
    24: 'snow', // Ice
    25: 'rainy', // Sleet
    26: 'rainy', // Freezing Rain
    29: 'rainy', // Rain and Snow
    30: 'sunny', // Hot
    31: 'snow', // Cold
    32: 'wind', // Windy
    33: 'moon', // Clear (night)
    34: 'moon', // Mostly Clear (night)
    35: 'cloudy-night', // Partly Cloudy (night)
    36: 'cloudy-night', // Intermittent Clouds (night)
    37: 'cloudy-night', // Hazy Moonlight
    38: 'cloudy-night', // Mostly Cloudy (night)
    39: 'rainy', // Partly Cloudy w/ Showers (night)
    40: 'rainy', // Mostly Cloudy w/ Showers (night)
    41: 'thunderstorm', // Partly Cloudy w/ Thunderstorms (night)
    42: 'thunderstorm', // Mostly Cloudy w/ Thunderstorms (night)
    43: 'snow', // Mostly Cloudy w/ Flurries (night)
    44: 'snow', // Mostly Cloudy w/ Snow (night)
  };

  return iconMap[iconCode] || 'help-circle';
};

// Format date for display
const formatDay = (date: string): string => {
  const parsedDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  if (parsedDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (parsedDate.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return parsedDate.toLocaleDateString('en-US', { weekday: 'short' });
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
      
      // First get location key from AccuWeather's API
      const locationResponse = await axios.get(`${WEATHER_BASE_URL}/locations/v1/cities/geoposition/search`, {
        params: {
          apikey: WEATHER_API_KEY,
          q: `${latitude},${longitude}`,
        },
      });
      
      const locationKey = locationResponse.data.Key;
      const locationName = locationResponse.data.LocalizedName;
      
      // Get current conditions
      const currentResponse = await axios.get(`${WEATHER_BASE_URL}/currentconditions/v1/${locationKey}`, {
        params: {
          apikey: WEATHER_API_KEY,
          details: true,
        },
      });
      
      // Get 5-day forecast
      const forecastResponse = await axios.get(`${WEATHER_BASE_URL}/forecasts/v1/daily/5day/${locationKey}`, {
        params: {
          apikey: WEATHER_API_KEY,
          metric: true,
        },
      });
      
      // Process forecast data
      const current = currentResponse.data[0];
      const dailyForecasts: ForecastDay[] = [];
      
      // Start from index 1 to skip today (we already have today's current weather)
      for (let i = 1; i < forecastResponse.data.DailyForecasts.length && i <= 3; i++) {
        const forecast = forecastResponse.data.DailyForecasts[i];
        dailyForecasts.push({
          day: formatDay(forecast.Date),
          high: Math.round(forecast.Temperature.Maximum.Value),
          low: Math.round(forecast.Temperature.Minimum.Value),
          icon: mapWeatherIconToIonicon(forecast.Day.Icon),
        });
      }
      
      // Convert response to our WeatherData format
      const weatherData: WeatherData = {
        location: locationName,
        date: 'Today',
        temperature: Math.round(current.Temperature.Metric.Value),
        condition: current.WeatherText,
        icon: mapWeatherIconToIonicon(current.WeatherIcon),
        humidity: current.RelativeHumidity,
        precipitation: current.HasPrecipitation ? 100 : current.PrecipitationProbability || 0,
        windSpeed: Math.round(current.Wind.Speed.Metric.Value),
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
      // Search for location
      const searchResponse = await axios.get(`${WEATHER_BASE_URL}/locations/v1/cities/search`, {
        params: {
          apikey: WEATHER_API_KEY,
          q: locationName,
        },
      });
      
      if (!searchResponse.data || searchResponse.data.length === 0) {
        return null;
      }
      
      const locationKey = searchResponse.data[0].Key;
      const exactLocationName = searchResponse.data[0].LocalizedName;
      
      // Get current conditions
      const currentResponse = await axios.get(`${WEATHER_BASE_URL}/currentconditions/v1/${locationKey}`, {
        params: {
          apikey: WEATHER_API_KEY,
          details: true,
        },
      });
      
      // Get 5-day forecast
      const forecastResponse = await axios.get(`${WEATHER_BASE_URL}/forecasts/v1/daily/5day/${locationKey}`, {
        params: {
          apikey: WEATHER_API_KEY,
          metric: true,
        },
      });
      
      // Process forecast data
      const current = currentResponse.data[0];
      const dailyForecasts: ForecastDay[] = [];
      
      // Start from index 1 to skip today (we already have today's current weather)
      for (let i = 1; i < forecastResponse.data.DailyForecasts.length && i <= 3; i++) {
        const forecast = forecastResponse.data.DailyForecasts[i];
        dailyForecasts.push({
          day: formatDay(forecast.Date),
          high: Math.round(forecast.Temperature.Maximum.Value),
          low: Math.round(forecast.Temperature.Minimum.Value),
          icon: mapWeatherIconToIonicon(forecast.Day.Icon),
        });
      }
      
      // Convert response to our WeatherData format
      const weatherData: WeatherData = {
        location: exactLocationName,
        date: 'Today',
        temperature: Math.round(current.Temperature.Metric.Value),
        condition: current.WeatherText,
        icon: mapWeatherIconToIonicon(current.WeatherIcon),
        humidity: current.RelativeHumidity,
        precipitation: current.HasPrecipitation ? 100 : current.PrecipitationProbability || 0,
        windSpeed: Math.round(current.Wind.Speed.Metric.Value),
        forecast: dailyForecasts,
      };
      
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data for location:', error);
      return null;
    }
  },
};