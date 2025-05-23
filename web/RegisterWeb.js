import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ImageBackground,
    StyleSheet,
    Animated,
    Platform,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import MaskInput, { Masks } from 'react-native-mask-input'; // Para aplicar máscara no CPF
import styles from './styles/loginWebStyles'; // Importar estilos do arquivo de estilos
WebBrowser.maybeCompleteAuthSession();

export default function RegisterWeb({ navigation }) {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [origem, setOrigem] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [formRegister, setFormRegister] = useState(true);
    const [query, setQuery] = useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: 'SEU_ANDROID_CLIENT_ID',
        iosClientId: 'SEU_IOS_CLIENT_ID',
        webClientId: '9139107305-8u2mcvrl6cr63uvjdjip4j6622mu9kit.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (Platform.OS === 'web') {
            setTimeout(() => {
                document.title = 'imoGo | Fazer Cadastro';
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
    console.log(formRegister);
    console.log(query);

    const handleOptionPress = (option) => {
        setSelectedOption(prevOption => (prevOption === option ? null : option));
    };

    const options = ['Facebook', 'Instagram', 'Google', 'Loja de aplicativos', 'Indicação de amigos', 'Outro'];

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95, // Escala para baixo quando pressionado
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1, // Escala de volta ao tamanho original
            useNativeDriver: true,
        }).start();
    };
    const [loading, setLoading] = useState(false); // Estado para controle do carregamento

    const [selectedOption, setSelectedOption] = useState(null);
    const [buttonScale] = useState(new Animated.Value(1));
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
                {query && (
                    <>
                        <Text style={styles.subtitle} allowFontScaling={false}>Só mais uma coisa</Text>
                        <Text style={styles.title} allowFontScaling={false}>Como conheceu a imoGo?</Text>
                        <Text style={styles.description} allowFontScaling={false}>Nos conte como chegou até aqui</Text>

                        {options.map(option => (
                            <TouchableOpacity
                                key={option}
                                style={[styles.optionButton, selectedOption === option && styles.optionButtonSelected]}
                                onPress={() => handleOptionPress(option)}
                            >
                                <Text style={[styles.optionText, selectedOption === option && styles.optionTextSelected]} allowFontScaling={false}>
                                    {option}
                                </Text>
                                {selectedOption === option && (
                                    <Ionicons name="checkmark" size={20} color="#FFF" style={styles.optionIcon} />
                                )}
                            </TouchableOpacity>
                        ))}

                        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
                            <TouchableOpacity
                                style={[styles.buttonPrimary, loading && styles.buttonDisabled]}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                disabled={loading}
                            >
                                <Text style={styles.buttonText} allowFontScaling={false}>
                                    {loading ? 'Criando conta...' : 'Concluir'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>

                    </>
                )}
                {formRegister && (

                    <>
                        <Text style={styles.title}>Crie uma conta!</Text>
                        <View style={styles.row}>
                            <Text style={styles.subLabel}>Nome </Text>
                            <TextInput
                                placeholder=""
                                value={nome}
                                onChangeText={setNome}
                                style={styles.input}
                                placeholderTextColor="#A9A9A9"
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.subLabel}>Telefone</Text>
                            <MaskInput
                                style={styles.input}
                                value={telefone}
                                onChangeText={setTelefone}
                                mask={Masks.BRL_PHONE}
                                placeholder="( )"
                                placeholderTextColor="#A9A9A9"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.hr} />
                        <View style={styles.row}>
                            <Text style={styles.subLabel}>Email</Text>
                            <TextInput
                                placeholder="exemplo@exemplo.com"
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
                                    placeholder="Crie uma senha"
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
                        <View style={styles.row}>
                            <View style={styles.checkboxGroup}>
                                <Checkbox
                                    value={remember}
                                    onValueChange={setRemember}
                                    color="#730d83"
                                />
                                <Text style={styles.checkboxLabel}>Eu li e estou de acordo com os Termos e Condições e com a Política de Privacidade.</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.buttonPrimary} onPress={() => {
                            setQuery(!query);
                            setFormRegister(!formRegister);
                        }}>
                            <Text style={styles.buttonPrimaryText}>Próximo</Text>
                        </TouchableOpacity>
                    </>
                )}

                <Text style={styles.divider}>Ou acesse com</Text>

                <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
                    <Ionicons name="logo-google" size={22} color="#EA4335" style={styles.googleIcon} />
                    <Text style={styles.googleText}>Continuar com Google</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

