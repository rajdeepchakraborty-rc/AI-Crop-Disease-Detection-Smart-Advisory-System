import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen            from '../screens/SplashScreen';
import HomeScreen              from '../screens/HomeScreen';
import UploadScreen            from '../screens/UploadScreen';
import LoadingScreen           from '../screens/LoadingScreen';
import ResultScreen            from '../screens/ResultScreen';
import HistoryScreen           from '../screens/HistoryScreen';
// ── Detail Screens ─────────────────────────────────────────────────
import XaiDetailScreen         from '../screens/XaiDetailScreen';
import TreatmentDetailScreen   from '../screens/TreatmentDetailScreen';
import SupplyChainDetailScreen from '../screens/SupplyChainDetailScreen';
import WeatherForecastScreen   from '../screens/WeatherForecastScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Splash"   component={SplashScreen} />
        <Stack.Screen name="Home"     component={HomeScreen} />
        <Stack.Screen name="Upload"   component={UploadScreen}   options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Loading"  component={LoadingScreen}  options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="Result"   component={ResultScreen}   options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="History"  component={HistoryScreen}  options={{ animation: 'slide_from_right' }} />

        {/* Detail screens — slide from right for drill-down feel */}
        <Stack.Screen name="XaiDetail"         component={XaiDetailScreen}         options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="TreatmentDetail"   component={TreatmentDetailScreen}   options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="SupplyChainDetail" component={SupplyChainDetailScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="WeatherForecast"   component={WeatherForecastScreen}   options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
