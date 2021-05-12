import AsyncStorage from '@react-native-async-storage/async-storage';

export const onSignIn = (token) => AsyncStorage.setItem('Authorization', token);

export const onSignOut = () => AsyncStorage.removeItem('Authorization');

export const getToken = async () => await AsyncStorage.getItem('Authorization');

export const isSignedIn = async () => {
  const token = await AsyncStorage.getItem('Authorization');

  return (token !== null) ? true : false;
};