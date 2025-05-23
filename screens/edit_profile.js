import React, { useState, useRef, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, TextInput, ScrollView, StatusBar, Dimensions, SafeAreaView, Platform, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Modal } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';
import { useLogScreen } from '../useLogScreen';
import Svg, { Path, G, Rect, Mask, Ellipse, ClipPath } from 'react-native-svg';

import ConfirmationModal from './modal/ConfirmationModal';

const { width, height } = Dimensions.get('window');

// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path fillRule="evenodd" clipRule="evenodd" d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z" fill="#730d83" />
    </Svg>
);

const EditProfile = ({ route, navigation }) => {
    useLogScreen('EditProfile');
    const { usuario_id } = route.params || {};
    const [loading, setLoading] = useState(false); // Estado de carregamento
    console.log("ID:", usuario_id)

    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [tempPhone, setTempPhone] = useState('');
    const [tempEmail, setTempEmail] = useState('');

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditingPas, setIsEditingPas] = useState(false);

    // pas

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    //end pas 


    // mnodal api 

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    
    // fim modal api

    useEffect(() => {
        fetchUserData();

    }, []);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.imogo.com.br/api/v1/corretores/${usuario_id}`);
            setPhone(response.data.telefone);
            setEmail(response.data.email);
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApiResponse = async (response) => {
        if (response.status === 200) {
            const detailData = response.data;
            setModalMessage(detailData.message || 'Dados atualizados com sucesso.');
        } else {
            const errorData = response.data;
    
            // Verifica se a resposta da API é um objeto com mensagem específica
            if (typeof errorData === 'object' && errorData !== null) {
                setModalMessage(errorData.detail || 'Erro desconhecido.');
            } else {
                setModalMessage('Erro ao atualizar os dados');
            }
        }
        setModalVisible(true);
    };

    const handleSavePhone = async () => {
        setLoading(true);
        try {
            const encodedPhone = encodeURIComponent(tempPhone); // Evita problemas com caracteres especiais
            const url = `https://api.imogo.com.br/api/v1/usuarios/corretor/${usuario_id}/telefone?novo_telefone=${encodedPhone}`;
            
            const response = await axios.put(url, {}, {
                headers: { 'accept': 'application/json' }
            });
    
            handleApiResponse(response);
            setPhone(tempPhone);
            setIsEditingPhone(false);
        } catch (error) {
            if (error.response) {
                handleApiResponse(error.response);
            } else {
                setModalMessage('Erro ao conectar com o servidor.');
                setModalVisible(true);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleSaveEmail = async () => {
        setLoading(true);
        try {
            const encodedEmail = encodeURIComponent(tempEmail); // Evita problemas com caracteres especiais
            const url = `https://api.imogo.com.br/api/v1/usuarios/corretor/${usuario_id}/email?novo_email=${encodedEmail}`;
            
            const response = await axios.put(url, {}, {
                headers: { 'accept': 'application/json' }
            });
    
            handleApiResponse(response);
            setEmail(tempEmail);
            setIsEditingEmail(false);
        } catch (error) {
            if (error.response) {
                handleApiResponse(error.response);
            } else {
                setModalMessage('Erro ao conectar com o servidor.');
                setModalVisible(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = () => {
        console.log(password, newPassword, confirmPassword);

        if (!password || !newPassword || !confirmPassword) {
            setPasswordError('Todos os campos são obrigatórios.');
            return false;
        }

        return true;
    };

    const handleSavePassword = async () => {
        if (!validatePassword()) return;

        setLoading(true);
        try {
            const encodedSenha_antiga = encodeURIComponent(password); // Evita problemas com caracteres especiais
            const encodedNewPassword = encodeURIComponent(confirmPassword); // Evita problemas com caracteres especiais
            const url = `https://api.imogo.com.br/api/v1/usuarios/corretor/${usuario_id}/senha?senha_antiga=${encodedSenha_antiga}&nova_senha=${encodedNewPassword}`;
            
            const response = await axios.put(url, {}, {
                headers: { 'accept': 'application/json' }
            });
    
            handleApiResponse(response);          
            setIsEditingEmail(false);
        } catch (error) {
            if (error.response) {
                handleApiResponse(error.response);
            } else {
                setModalMessage('Erro ao conectar com o servidor.');
                setModalVisible(true);
            }
        } finally {
            setLoading(false);
        }
    };



    // e-mail

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const [emailError, setEmailError] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);

    const handleEmailChange = (text) => {
        setTempEmail(text);
        const isValid = validateEmail(text);
        setIsEmailValid(isValid);
        setEmailError(isValid ? '' : 'E-mail inválido');
    };

    const isSaveEmailDisabled = !validateEmail(tempEmail) || tempEmail === email;

    // telefone 

    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const handlePhoneChange = (text) => {
        setTempPhone(text);
        setIsPhoneValid(text.length >= 15);
    };

    const isSavePhoneDisabled = tempPhone === phone || !isPhoneValid;


    const isSavePasswordDisabled = !password || !newPassword || !confirmPassword || newPassword !== confirmPassword;

    // console.log(passwordError)
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>Minha conta</Text>
            </View>

            {/* Linha de separação do header */}
            <View style={styles.headerLine} />


            <StatusBar
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled={Platform.OS === 'ios' || Platform.OS === 'android'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>

                        {/* TELEFONE */}
                        <View style={styles.row}>
                            <Text style={styles.label}>Telefone</Text>
                            {!isEditingPhone ? (
                                <TouchableOpacity onPress={() => { setTempPhone(phone); setIsEditingPhone(true); }}>
                                    <Text style={styles.editText}>Editar</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => setIsEditingPhone(false)}>
                                    <Text style={styles.editText}>Cancelar</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {isEditingPhone ? (
                            <View style={styles.inputContainer}>
                                <TextInputMask
                                    style={[styles.input, { borderColor: isPhoneValid ? '#ccc' : '#ccc' }]}
                                    value={tempPhone}
                                    onChangeText={handlePhoneChange}
                                    type={'cel-phone'}
                                    options={{
                                        maskType: 'BRL',
                                        withDDD: true,
                                        dddMask: '(99) '
                                    }}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity style={[styles.saveButton, isSavePhoneDisabled && { backgroundColor: '#ccc' }]}
                                    onPress={handleSavePhone}
                                    disabled={isSavePhoneDisabled}
                                >
                                    <Text style={styles.saveText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={styles.value}>{phone || '(00) 0 0000-0000'}</Text>
                        )}

                        <View style={styles.headerLine} />

                        {/* E-MAIL */}
                        <View style={styles.row}>
                            <Text style={styles.label}>E-mail</Text>
                            {!isEditingEmail ? (
                                <TouchableOpacity onPress={() => { setTempEmail(email); setIsEditingEmail(true); }}>
                                    <Text style={styles.editText}>Editar</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => setIsEditingEmail(false)}>
                                    <Text style={styles.editText}>Cancelar</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {isEditingEmail ? (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[styles.input, { borderColor: isEmailValid ? '#ccc' : 'red' }]}
                                    value={tempEmail}
                                    onChangeText={handleEmailChange}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {!isEmailValid && <Text style={styles.errorText}>{emailError}</Text>}
                                <TouchableOpacity style={[styles.saveButton, isSaveEmailDisabled && { backgroundColor: '#ccc' }]}
                                    onPress={handleSaveEmail}
                                    disabled={isSaveEmailDisabled}
                                >
                                    <Text style={styles.saveText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={styles.value}>{email || 'exemplo@email.com'}</Text>
                        )}

                        <View style={styles.headerLine} />

                        {/* Alterar Senha */}
                        <View style={styles.row}>
                            <Text style={styles.label}>Alterar Senha</Text>
                            {!isEditingPas ? (
                                <TouchableOpacity onPress={() => setIsEditingPas(true)}>
                                    <Ionicons name="chevron-forward-outline" size={20} color="#7A7A7A" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => setIsEditingPas(false)}>
                                    <Text style={styles.editText}>Cancelar</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {isEditingPas && (
                            <View style={styles.inputContainer}>

                                {/* Senha Atual */}
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={[styles.inputPassword]}
                                        placeholder='Senha Atual'
                                        placeholderTextColor={'#ccc'}
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            setPasswordError('');
                                        }}
                                        secureTextEntry={!isPasswordVisible}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                                        <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
                                    </TouchableOpacity>
                                </View>

                                {/* Nova Senha */}
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={[styles.inputPassword]}
                                        placeholder='Nova Senha'
                                        placeholderTextColor={'#ccc'}
                                        value={newPassword}
                                        onChangeText={(text) => {
                                            setNewPassword(text);
                                            setPasswordError('');
                                        }}
                                        secureTextEntry={!isNewPasswordVisible}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)} style={styles.eyeIcon}>
                                        <Ionicons name={isNewPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
                                    </TouchableOpacity>
                                </View>

                                {/* Confirmar Senha */}
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={[styles.inputPassword]}
                                        placeholder='Confirmar Senha'
                                        placeholderTextColor={'#ccc'}
                                        value={confirmPassword}
                                        onChangeText={(text) => {
                                            setConfirmPassword(text);
                                            setPasswordError('');
                                            validatePassword();
                                        }}
                                        secureTextEntry={!isConfirmPasswordVisible}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIcon}>
                                        <Ionicons name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
                                    </TouchableOpacity>
                                </View>

                                {/* Exibir mensagem de erro ou sucesso */}
                                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                                <TouchableOpacity
                                    style={[styles.saveButton, (!password || !newPassword || !confirmPassword || newPassword !== confirmPassword) && { backgroundColor: '#ccc' }]}
                                    onPress={handleSavePassword}
                                    disabled={!password || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                >
                                    <Text style={styles.saveText}>Salvar Senha</Text>
                                </TouchableOpacity>

                            </View>
                        )}


                        <View style={[styles.headerLine, { marginTop: "5%" }]} />

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Modal de carregamento */}
            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.loadingText}>Atualizando dados...</Text>
                </View>
            </Modal>

            <ConfirmationModal
                visible={modalVisible}
                message={modalMessage}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView >
    );
};

const styles = {

    // senhas 

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },

    eyeIcon: {
        position: 'absolute',
        right: 10,
        padding: 10,
    },

    input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
    },

    inputPassword: {
        flex: 1,
        height: height * 0.055,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: width * 0.04,
        fontSize: Platform.select({
            ios: width * 0.04,
            android: width * 0.038,
            web: width * 0.038,
        }),
        backgroundColor: '#F5F5F5',

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


    // fim senhas

    headerLine: {
        height: 1,
        backgroundColor: '#E9E9E9',
        width: '100%',
        marginBottom: "5%"
    },

    // carregamento 

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo translúcido
    },
    loadingText: {
        color: '#FFF',
        marginTop: 10,
        fontSize: 16,
    },

    // fim carregamento 

    errorText: {
        marginTop: 5,
        color: 'red',
        fontSize: 14,
    },

    mt_10: {
        marginTop: 10
    },
    // voltar 
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        backgroundColor: '#F5F5F5',
    },
    headerTitle: {
        fontSize: Platform.select({
            ios: width * 0.04,
            android: width * 0.04,
            web: width * 0.04,  // Tamanho fixo para web
        }),
        fontWeight: 'bold',
        color: '#1F2024',
        textAlign: 'center'
    },

    backButton: {
        position: 'absolute',
        left: 20,
    },

    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    },
    scrollContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    container: {
        width: '90%',
    },


    // modelo do template 

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    editText: {
        fontSize: 14,
        color: "#007BFF",
    },
    value: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "#730d83",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    saveText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    option: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    optionText: {
        fontSize: 16,
        color: "#333",
    },
};

export default EditProfile;