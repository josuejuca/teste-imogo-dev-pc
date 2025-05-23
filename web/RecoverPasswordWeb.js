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

export default function RecoverPassword({ navigation }) {
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
        document.title = 'imoGo | Recuperar Senha';
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




  const handleRecoverPassword = async () => {
    try {
      // Requisição PUT para a API
      const response = await axios.post(`https://api-imogo.josuejuca.com/api/v1/recuperar-senha`, {
        email: email
      });

      if (response.status === 200) {
        console.log(response);
        navigation.navigate('SuccessScreenNewSenha');
      } else {
        if (response.status === 404) {
          showAlert('Erro', 'E-mail não encontrado.');
        } else {
          showAlert('Erro', 'Não foi possível enviar os dados.');
        }
      }

    } catch (error) {
      if (error.response) {
        showAlert('Erro', error.response.data.detail || 'E-mail não existe.');
      } else if (error.request) {
        showAlert('Erro de Conexão', 'Não foi possível conectar ao servidor. ', error);
      } else {
        showAlert('Erro', 'Ocorreu um erro ao recupera a senha.');
      }
    } finally {
      setIsSubmitting(false); // Reativa o botão
      setLoading(false);
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
       
            <Text style={styles.title}>Esqueceu sua senha?</Text>
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


            <TouchableOpacity style={styles.buttonPrimary} onPress={handleRecoverPassword}>
              <Text style={styles.buttonPrimaryText}>Enviar nova senha</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.laterButton}>
              <Text
                style={styles.laterButtonText}
                allowFontScaling={false}
                onPress={() => navigation.navigate('LoginWeb')}
              >
                Fazer Login
              </Text>
            </TouchableOpacity>
   
        
      </View>
    </ImageBackground>
  );
}

