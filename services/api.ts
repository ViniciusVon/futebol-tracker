import axios from 'axios';
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.API_KEY_FUTEBOL;

export const api = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': apiKey,
  },
});
