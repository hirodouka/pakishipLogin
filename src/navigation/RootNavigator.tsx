import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import HomeScreen from '../features/home/screens/HomeScreen';
import EditProfileScreen from '../features/profile/screens/EditProfileScreen';
import HistoryScreen from '../features/history/screens/HistoryScreen';
import RateReviewScreen from '../features/reviews/screens/RateReviewScreen';
import SendParcelScreen from '../features/parcel/screens/SendParcelScreen';
import TrackPackageScreen from '../features/parcel/screens/TrackPackageScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="RateReview" component={RateReviewScreen} />
      <Stack.Screen name="SendParcel" component={SendParcelScreen} />
      <Stack.Screen name="TrackPackage" component={TrackPackageScreen} />
    </Stack.Navigator>
  );
}
