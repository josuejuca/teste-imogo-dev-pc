import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  StyleSheet,
  Alert as MobileAlert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useLogScreen } from '../useLogScreen';

const { width, height } = Dimensions.get('window');
WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
  useLogScreen('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [emailError, setEmailError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  // Configuração do login com Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "SEU_ANDROID_CLIENT_ID",
    iosClientId: "SEU_IOS_CLIENT_ID",
    webClientId: "9139107305-8u2mcvrl6cr63uvjdjip4j6622mu9kit.apps.googleusercontent.com",
  });


  if (Platform.OS === 'web' && width > 768) {
    return navigation.replace('LoginWeb');
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  const getUserInfo = async (token) => {
    try {
      const userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await userInfoResponse.json();

      // Exibindo um alerta com o e-mail do usuário autenticado
      // showAlert("Login bem-sucedido", `Bem-vindo, ${userInfo.name}`);
      console.log(userInfo);

      // Preparar os dados para enviar à API
      const googleLoginData = {
        id_google: userInfo.id,
        nome: userInfo.name,
        email: userInfo.email,
        foto_conta: userInfo.picture,
      };

      // Enviar dados para a API e fazer login
      await handleGoogleLogin(googleLoginData);
    } catch (error) {
      showAlert("Erro de Login", "Não foi possível obter informações do usuário.");
    }
  };

  // Função para fazer o login via Google na API
  const handleGoogleLogin = async (googleData) => {
    try {
      // Verifique se todos os campos estão presentes e são válidos
      if (!googleData.id_google || !googleData.nome || !googleData.email || !googleData.foto_conta) {
        showAlert('Erro de Login', 'Informações incompletas recebidas do Google.');
        return;
      }

      // Fazer a requisição POST para a API com os dados como query parameters
      const response = await axios.post(`https://api.imogo.com.br/api/v1/login/google/corretor`, null, {
        params: {
          id_google: googleData.id_google,
          nome: googleData.nome,
          email: googleData.email,
          foto_conta: googleData.foto_conta,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('Resposta da API Google:', data);

        if (data.usuario_id) {
          await saveLoginInfo(String(data.usuario_id));

          navigation.reset({
            index: 0,
            routes: [{ name: 'Home', params: { usuario_id: data.usuario_id } }],
          });
        } else {
          showAlert('Erro de Login', 'ID de usuário não encontrado. Tente novamente.');
        }
      } else {
        showAlert('Erro de Login', 'Não foi possível concluir o login com o Google.');
      }
    } catch (error) {
      if (error.response) {
        console.log('Erro de Resposta da API:', error.response.data);
        showAlert('Erro de Login', error.response.data.detail || 'Erro ao fazer login com o Google.');
      } else if (error.request) {
        showAlert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
      } else {
        showAlert('Erro', 'Ocorreu um erro ao fazer login com o Google.');
      }
    }
  };

  // Validação de email usando regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para salvar login no AsyncStorage
  const saveLoginInfo = async (usuario_id) => {
    try {
      await AsyncStorage.setItem('usuario_id', usuario_id);
    } catch (error) {
      console.error('Error saving user ID', error);
    }
  };

  const removeLoginInfo = async () => {
    try {
      await AsyncStorage.removeItem('usuario_id');
    } catch (error) {
      console.error('Error removing user ID', error);
    }
  };

  // Função para mostrar o alert (com suporte a web)
  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      MobileAlert.alert(title, message);
    }
  };

  // Função para lidar com o login via API utilizando axios
  const handleLogin = async () => {
    try {
      const response = await axios.post('https://api.imogo.com.br/login/corretor', {
        email: email,
        senha: password,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('Resposta da API:', data);

        if (data.usuario_id) {
          if (remember) {
            await AsyncStorage.setItem('usuario_id', String(data.usuario_id));
          } else {
            await removeLoginInfo();
          }
          // TESTE
          try {
            const response_user = await axios.get(`https://api.imogo.com.br/api/v1/corretores/${data.usuario_id}`);

            if (response_user.status === 200) {
              const { status } = response_user.data;

              if (status === 1) {
                // navigation.reset({

                //   routes: [{ name: 'PreCompleteCadastroScreen', params: { usuario_id: data.usuario_id, status_user: status } }],
                // });
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home', params: { usuario_id: data.usuario_id } }],
                });
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home', params: { usuario_id: data.usuario_id } }],
                });
              }
            } else {
              console.error("Erro ao buscar os dados do usuário:", error);
            }

          } catch (error) {
            console.error("Perdemo:", error);
          }
          // end TESTE

        } else {
          showAlert('Erro de Login', 'ID de usuário não encontrado. Tente novamente.');
        }
      } else {
        showAlert('Erro de Login', 'E-mail ou senha erradas, tente novamente.');
      }
    } catch (error) {
      if (error.response) {
        showAlert('Erro de Login', error.response.data.detail || 'E-mail ou senha erradas.');
      } else if (error.request) {
        showAlert('Erro de Conexão', 'Não foi possível conectar ao servidor. ', error);
      } else {
        showAlert('Erro', 'Ocorreu um erro ao fazer login.');
      }
    }
  };

  const handleEmailChange = (emailInput) => {
    setEmail(emailInput);
    if (!validateEmail(emailInput)) {
      setEmailError('Por favor, insira um email válido.');
    } else {
      setEmailError('');
    }
  };

  return (
    <TouchableWithoutFeedback>
      <View style={styles.background}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
          backgroundColor="transparent"
          translucent
        />
        <ImageBackground
          source={require('../assets/img/Splashcreen.png')}
          style={styles.imageBackground}
          imageStyle={styles.imageBackgroundStyle}
        >
          <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding', android: 'height', web: undefined })}
            style={styles.container}
            keyboardVerticalOffset={Platform.select({ ios: 0, android: -150 })}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
              scrollEnabled={false}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require('../assets/img/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.whiteContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title} allowFontScaling={false}>
                    Bem-Vindo!
                  </Text>
                </View>

                {/* Email Input */}
                <TextInput
                  style={[styles.input, emailError ? styles.inputError : null]}
                  placeholder="Email"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  allowFontScaling={false}
                  placeholderTextColor="#A9A9A9"
                />
                {emailError ? (
                  <Text style={styles.errorText} allowFontScaling={false}>
                    {emailError}
                  </Text>
                ) : null}

                {/* Password Input */}
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    allowFontScaling={false}
                    placeholderTextColor="#A9A9A9"
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={isPasswordVisible ? 'eye-off' : 'eye'}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.rememberContainer}>
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      value={remember}
                      onValueChange={setRemember}
                      color={remember ? '#730d83' : '#730d83'}
                    />
                    <Text style={styles.rememberText} allowFontScaling={false}>
                      Manter Login
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('RecoverPasswordScreen')}
                  >
                    <Text style={styles.forgotText} allowFontScaling={false}>
                      Esqueceu sua senha?
                    </Text>
                  </TouchableOpacity>
                </View>

                <Animated.View style={{ width: '100%' }}>
                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={handleLogin}
                  >
                    <Text
                      style={styles.buttonTextPrimary}
                      allowFontScaling={false}
                    >
                      Entrar
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                <Text style={styles.separatorText} allowFontScaling={false}>
                  Ou acesse com
                </Text>

                <TouchableOpacity
                  style={styles.buttonSocial}
                  onPress={() => promptAsync()}
                >
                  <Ionicons
                    name="logo-google"
                    size={24}
                    color="#EA4335"
                    style={styles.socialIcon}
                  />
                  <Text
                    style={styles.buttonTextSocial}
                    allowFontScaling={false}
                  >
                    Continuar com Google
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  imageBackgroundStyle: {
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.35,
    height: height * 0.08,
  },
  whiteContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
    minHeight: height * 0.75,
    paddingBottom: height * 0.05,
    flexGrow: 1,
    flexShrink: 0,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: Platform.select({
      ios: width * 0.055,
      android: width * 0.05,
      web: width * 0.05,
    }),
    fontWeight: 'bold',
    color: '#1F2024',
    marginBottom: height * 0.015,
    textAlign: 'left',
  },
  input: {
    width: '100%',
    height: height * 0.055,
    borderColor: '#EAEAEA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    fontSize: Platform.select({
      ios: width * 0.04,
      android: width * 0.038,
      web: width * 0.038,
    }),
    marginBottom: height * 0.022,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.03,
    marginBottom: height * 0.012,
    alignSelf: 'flex-start',
  },
  inputPassword: {
    flex: 1,
    height: height * 0.055,
    borderColor: '#EAEAEA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    fontSize: Platform.select({
      ios: width * 0.04,
      android: width * 0.038,
      web: width * 0.038,
    }),
    backgroundColor: '#fff',

  },
  passwordContainer: {
    marginBottom: height * 0.022,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: height * 0.01,
    marginBottom: height * 0.022,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: Platform.select({
      ios: width * 0.033,
      android: width * 0.032,
      web: width * 0.032,
    }),
    color: '#730d83',
    marginLeft: 10,
  },
  forgotText: {
    fontSize: Platform.select({
      ios: width * 0.033,
      android: width * 0.032,
      web: width * 0.032,
    }),
    color: '#730d83',
  },
  buttonPrimary: {
    backgroundColor: '#730d83',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.1,
    borderRadius: 30,
    marginBottom: height * 0.022,
    width: '100%',
    alignItems: 'center',
  },
  buttonTextPrimary: {
    fontFamily: 'Nunito_700Bold',
    color: '#F5F5F5',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  separatorText: {
    fontSize: Platform.select({
      ios: width * 0.038,
      android: width * 0.037,
      web: width * 0.037,
    }),
    color: '#71727A',
    marginVertical: height * 0.015,
  },
  buttonSocial: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 30,
    paddingVertical: height * 0.014,
    width: '100%',
    marginBottom: height * 0.012,
    justifyContent: 'center',
  },
  buttonTextSocial: {
    fontSize: Platform.select({
      ios: width * 0.043,
      android: width * 0.04,
    }),
    color: '#333',
    fontWeight: 'bold',
  },
  socialIcon: {
    marginRight: 10,
  },
});

export default Login;
