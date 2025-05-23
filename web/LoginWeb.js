import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Platform,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import styles from './styles/loginWebStyles'; // Importar estilos do arquivo de estilos
WebBrowser.maybeCompleteAuthSession();

export default function LoginWeb({ navigation }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'SEU_ANDROID_CLIENT_ID',
    iosClientId: 'SEU_IOS_CLIENT_ID',
    webClientId: '9139107305-8u2mcvrl6cr63uvjdjip4j6622mu9kit.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      setTimeout(() => {
        document.title = 'imoGo | Fazer Login';
      }, 100);
    }
  }, []);


  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  const showAlert = (title, message) => {
    window.alert(`${title}: ${message}`);
  };

  const validateEmail = (emailInput) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailInput);
  };

  const handleEmailChange = (emailInput) => {
    setEmail(emailInput);
    setEmailError(validateEmail(emailInput) ? '' : 'Por favor, insira um email válido.');
  };

  const saveLoginInfo = async (usuario_id) => {
    try {
      await AsyncStorage.setItem('usuario_id', usuario_id);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const removeLoginInfo = async () => {
    try {
      await AsyncStorage.removeItem('usuario_id');
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://api-imogo.josuejuca.com/login/corretor', {
        email: email,
        senha: password,
      });

      const data = response.data;

      if (data.usuario_id) {
        if (remember) {
          await saveLoginInfo(String(data.usuario_id));
        } else {
          await removeLoginInfo();
        }

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home', params: { usuario_id: data.usuario_id } }],
        });
      } else {
        showAlert('Erro de Login', 'ID de usuário não encontrado.');
      }
    } catch (error) {
      const msg = error?.response?.data?.detail || 'Erro ao fazer login.';
      showAlert('Erro de Login', msg);
    }
  };

  const getUserInfo = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await res.json();

      const googleLoginData = {
        id_google: userInfo.id,
        nome: userInfo.name,
        email: userInfo.email,
        foto_conta: userInfo.picture,
      };

      await handleGoogleLogin(googleLoginData);
    } catch (error) {
      showAlert('Erro de Login', 'Erro ao obter dados do Google.');
    }
  };

  const handleGoogleLogin = async (googleData) => {
    try {
      const response = await axios.post(
        `https://api-imogo.josuejuca.com/api/v1/login/google/corretor`,
        null,
        { params: googleData }
      );

      const data = response.data;

      if (data.usuario_id) {
        await saveLoginInfo(String(data.usuario_id));

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home', params: { usuario_id: data.usuario_id } }],
        });
      } else {
        showAlert('Erro de Login', 'ID de usuário não encontrado.');
      }
    } catch (error) {
      showAlert('Erro de Login', error?.response?.data?.detail || 'Erro ao fazer login com o Google.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img/bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.card}>
        <Image
          source={require('../assets/img/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Bem-Vindo!</Text>
        <View style={styles.row}>
          <Text style={styles.subLabel}>Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            style={styles.input}
            placeholderTextColor="#A9A9A9"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>
        <View style={styles.row}>
          <Text style={styles.subLabel}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              style={styles.input}
              placeholderTextColor="#A9A9A9"
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color="#888" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.row, {flexDirection: 'row',justifyContent: 'space-between'}]}>
          <View style={styles.checkboxGroup}>
            <Checkbox
              value={remember}
              onValueChange={setRemember}
              color="#730d83"
            />
            <Text style={styles.checkboxLabel}>Lembrar senha.</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('RecoverPasswordWeb')}>
            <Text style={styles.forgot}>Esqueceu sua senha?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
          <Text style={styles.buttonPrimaryText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.divider}>Ou acesse com</Text>

        <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
          <Ionicons name="logo-google" size={22} color="#EA4335" style={styles.googleIcon} />
          <Text style={styles.googleText}>Continuar com Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

