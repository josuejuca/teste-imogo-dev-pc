import { useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserAgent = () => {
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes('safari') && !ua.includes('chrome')) {
      return 'Safari Browser';
    } else if (ua.includes('chrome')) {
      return 'Chrome Browser';
    } else {
      return 'Web Browser';
    }
  }

  return Platform.OS === 'ios' ? 'iOS App' : 'Android App';
};

const logAccess = async (screenName) => {
  const userId = await AsyncStorage.getItem('usuario_id');
  const userAgent = getUserAgent();

  // await fetch('https://log-pwa.imogo.com.br/log_access', {
  //   method: 'POST',
  //   headers: { 
  //     'Content-Type': 'application/json',
  //     'User-Agent': userAgent
  //   },
  //   body: JSON.stringify({ page: screenName, user_id: userId || 'anon' }),
  // });
};

export const useLogScreen = (screenName) => {
  useEffect(() => {
    logAccess(screenName);
  }, [screenName]);
};
