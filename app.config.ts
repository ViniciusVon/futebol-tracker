import { ConfigContext, ExpoConfig } from '@expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'futebol-tracker',
  slug: 'futebol-tracker',
  version: '1.0.0',
  sdkVersion: '53.0.0',
  extra: {
    API_KEY_FUTEBOL: process.env.EXPO_PUBLIC_API_KEY_FUTEBOL,
  },
});
