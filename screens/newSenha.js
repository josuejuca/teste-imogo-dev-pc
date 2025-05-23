import React, { useState, useRef } from 'react';
import {
    Alert as MobileAlert,
    Image,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    Dimensions,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    ActivityIndicator
} from 'react-native';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import MaskInput, { Masks } from 'react-native-mask-input'; // Para aplicar máscara no CPF
import Svg, { Path } from 'react-native-svg';
import { useLogScreen } from '../useLogScreen';

const { width, height } = Dimensions.get('window');
// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
            d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z"
            fill="#730d83"
        />
    </Svg>
);

const RecoverPasswordScreen = ({ route, navigation }) => {
    const { id, classificacao = '', tipo = '', usuario_id, status, status_user } = route.params || {};
    useLogScreen('RecoverPasswordScreen');


    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Referências para os inputs
    const nomeCompletoRef = useRef(null);
    const cpfRef = useRef(null);
    const estadoCivilRef = useRef(null);
    const tipoDocumentoRef = useRef(null);

    // Estado dos campos
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('');

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    // Controle de exibição das listas de opções
    const [showEstadoCivilOptions, setShowEstadoCivilOptions] = useState(false);
    const [showTipoDocumentoOptions, setShowTipoDocumentoOptions] = useState(false);

    const estadoCivilOptions = ['Solteiro', 'Casado', 'Viúvo', 'Divorciado', 'Separado'];
    const tipoDocumentoOptions = ['CNH', 'RG', 'Outros'];

    const emailInputRef = useRef(null);

    const handleEmailChange = (text) => {
        setEmail(text);
        if (!validateEmail(text)) {
            setEmailError('Por favor, insira um e-mail válido.');
        } else {
            setEmailError('');
        }
    };

    // Função para selecionar uma opção e fechar a lista
    const selectEstadoCivil = (option) => {
        setEstadoCivil(option);
        setShowEstadoCivilOptions(false);
    };

    const selectTipoDocumento = (option) => {
        setTipoDocumento(option);
        setShowTipoDocumentoOptions(false);
    };

    // Validação para habilitar o botão "Salvar"
    // const isFormValid = () => email;

    const isFormValid = () => {
        return validateEmail(email);  // Verifica se o e-mail é válido
    };

    const handleSaveImovel = async () => {
        if (!isFormValid()) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
            return;
        }

        if (isSubmitting) return; // Impede múltiplos envios

        setIsSubmitting(true); // Desativa o botão
        setLoading(true);

        try {
            // Requisição PUT para a API
            const response = await axios.post(`https://api.imogo.com.br/api/v1/recuperar-senha`, {
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

    // Função para mostrar o alert (com suporte a web)
    const showAlert = (title, message) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}: ${message}`);
        } else {
            MobileAlert.alert(title, message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>
                    Esqueceu sua senha?
                </Text>
            </View>
            {/* <Text style={styles.classificacaoText} allowFontScaling={false}>
                Dados do Corretor
            </Text> */}
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.container}>
                            {/* Nome Completo */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Não se preocupe, vamos enviar uma nova senha para você através do seu e-mail. </Text>
                            </View>

                            {/* Inputs de E-mail, Senha e Confirmar Senha */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.subLabel} allowFontScaling={false}>E-mail</Text>
                                {/* <Text style={styles.label} allowFontScaling={false}>Email</Text> */}
                                <TouchableOpacity
                                    activeOpacity={0.7}  // Controla a opacidade ao clicar
                                    onPress={() => emailInputRef.current.focus()}  // Garante que o foco seja no campo de e-mail
                                >
                                    <TextInput
                                        ref={emailInputRef}
                                        style={[styles.input, emailError && styles.inputError]}
                                        placeholder="exemplo@email.com"
                                        keyboardType="email-address"
                                        placeholderTextColor="#A9A9A9"
                                        value={email}
                                        onChangeText={handleEmailChange}
                                        returnKeyType="next"
                                        onSubmitEditing={() => handleSubmitEditing(passwordInputRef)}
                                        allowFontScaling={false}
                                    />
                                </TouchableOpacity>

                                {emailError ? <Text style={styles.errorText} allowFontScaling={false}>{emailError}</Text> : null}
                            </View>

                            {/* Botão Salvar */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.saveButton, (!isFormValid() || isSubmitting) && { backgroundColor: '#ccc' }]}
                                    onPress={handleSaveImovel}
                                    disabled={!isFormValid() || isSubmitting}
                                >
                                    <Text style={styles.saveButtonText} allowFontScaling={false}>{isSubmitting ? 'Enviando...' : 'Enviar'}</Text>
                                </TouchableOpacity>
                                {/*  */}

                                {/*  */}
                                <TouchableOpacity style={styles.laterButton}>
                                    <Image
                                        source={require('../assets/icons/home.png')} // Ícone de terminar mais tarde
                                        style={styles.laterIcon}
                                    />
                                    <Text
                                        style={styles.laterButtonText}
                                        allowFontScaling={false}
                                        onPress={() => navigation.goBack()}
                                    >
                                        Voltar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
                {/* Modal de carregamento */}
                <Modal transparent={true} animationType="fade" visible={loading}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="white" />
                        <Text style={styles.loadingText}>Enviando nova senha...</Text>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const styles = {

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

    // teste 

    errorText: {
        color: 'red',
        fontSize: Platform.select({
            ios: width * 0.03, // Ajuste para iOS
            android: width * 0.035, // Ajuste para Android
        }),
        marginTop: height * 0.005, // Margem superior do erro
    },

    input: {
        width: '100%',
        height: height * 0.06, // Ajuste da altura dos inputs
        borderColor: '#C4C4C4',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: width * 0.03, // Ajuste do padding interno
        fontSize: Platform.select({
            ios: width * 0.04, // Ajuste para iOS
            android: width * 0.045, // Ajuste para Android
        }),
        backgroundColor: '#F4F4F4',
    },
    inputError: {
        borderColor: 'red',
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
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: '#1F2024',
        textAlign: 'center'
    },
    classificacaoText: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: 10,
        textAlign: 'left',
        paddingLeft: 20,
    },
    stepsContainer: {
        flex: 1,
        paddingHorizontal: width * 0.05,
    },
    backButton: {
        position: 'absolute',
        left: 20,
    },
    //
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    container: {
        width: '90%',
    },
    row: {
        marginBottom: 20,
        width: '100%',
    },
    subLabel: {
        fontSize: Platform.select({ ios: width * 0.037, android: width * 0.035 }),
        fontWeight: '600',
        color: '#1F2024',
        marginBottom: 10,
    },
    titleLabel: {
        fontSize: Platform.select({ ios: width * 0.057, android: width * 0.055 }),
        fontWeight: '600',
        color: '#1F2024',
        marginBottom: 10,
    },
    orientacaoText: {
        fontSize: Platform.select({ ios: width * 0.033, android: width * 0.035 }),
    },
    optionGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionGroupSuite: {
        marginLeft: Platform.select({ ios: width * -0.01, android: width * 0.01 }),
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'start',
    },
    optionButton: {
        borderWidth: 1,
        borderColor: '#E9E9E9',
        borderRadius: 25,
        marginHorizontal: 6,
        backgroundColor: '#E9E9E9',
        width: Platform.select({ ios: width * 0.11, android: width * 0.11 }),
        height: Platform.select({ ios: width * 0.11, android: width * 0.11 }),
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#730d83',
        borderColor: '#730d83',
    },
    optionText: {
        fontSize: width * 0.029,
        color: '#494A50',
    },
    selectedOptionText: {
        color: '#FFF',
    },
    suitesGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: Platform.select({ ios: -10, android: 10 }),
        marginTop: 10,
    },
    suitesNumberContainer: {
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    suitesText: {
        fontSize: width * 0.04,
        color: '#1F2024',
        textAlign: 'center',
    },
    incrementDecrementButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        width: 44,
        height: 44,
    },
    incrementDecrementButtonText: {
        fontSize: 20,
        color: '#494A50',
    },
    orientationGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    orientationButton: {
        borderRadius: 25,
        backgroundColor: '#E9E9E9',
        padding: 10,
        alignItems: 'center',
        width: '30%',
    },
    selectedOptionOrientation: {
        backgroundColor: '#730d83',
    },
    areaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10
    },
    areaColumn: {
        width: '48%',
    },


    // modal 

    detalhesWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        marginTop: 10,
        maxWidth: '100%',  // Definir tamanho máximo para o container
        justifyContent: 'flex-start',
    },
    detalheItem: {
        backgroundColor: '#E9E9E9',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 8,
    },
    detalheText: {
        color: '#000',
        fontSize: 14,
        maxWidth: Platform.select({ ios: 100, android: 90 }), // Controla a largura máxima do texto
    },
    detalheAddButton: {
        backgroundColor: '#E9E9E9',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 8,
    },
    detalheAddText: {
        fontSize: 20,
        color: '#000',
    },
    detalheExtra: {
        backgroundColor: '#730d83',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 8,
    },
    detalheExtraText: {
        color: '#FFF',
    },

    // descrição 

    descriptionBox: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#F5F5F5',
        minHeight: 50,
        justifyContent: 'center',
    },
    descriptionText: {
        fontSize: 14,
        color: '#494A50',
    },
    placeholderText: {
        color: '#D3D3D3',  // Estilo de placeholder
    },
    descriptionFilled: {
        color: '#1F2024',  // Cor do texto quando preenchido
    },
    helperText: {
        fontSize: 12,
        color: '#7A7A7A',
        marginTop: 5,
    },
    helperTextEnd: {
        fontSize: 14, // Ajuste dinâmico baseado na largura da tela (4% da largura)
        color: '#F5F5F5',
        backgroundColor: '#C4C4C4', // Ajuste a cor conforme necessário
        paddingVertical: width * 0.03, // Padding vertical responsivo
        paddingHorizontal: width * 0.05, // Padding horizontal responsivo
        borderRadius: 16,
        marginTop: width * 0.03, // Margin top para espaçamento
        textAlign: 'center',
        width: '100%', // Ocupar 90% da largura da tela
        alignSelf: 'center',
    },


    // pagamento 
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 15,
        width: '100%',
    },



    // salvar 

    areaInput: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#F5F5F5',
    },
    inputContainer: {
        width: '100%',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#7A7A7A',
        marginLeft: 10,
    },
    buttonContainer: {
        marginTop: 40, // Ajuste do espaçamento superior
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#730d83',
        paddingVertical: 15,
        paddingHorizontal: width * 0.2, // Mais largura
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    saveButtonText: {
        color: '#F5F5F5',
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.03 }), // Ajuste no tamanho da fonte
        fontWeight: '600',
    },
    laterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    laterIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    laterButtonText: {
        color: '#730d83',
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.03 }), // Ajuste no tamanho da fonte
        fontWeight: '600',
    },
    // input que abre 

    optionsContainer: {
        backgroundColor: '#F5F5F5',
        borderColor: '#D3D3D3',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 5,
    },
    optionItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    optionText: {
        fontSize: 16,
        color: '#1F2024',
    },
};

export default RecoverPasswordScreen;