import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    Keyboard,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Modal,
    Image,
    Dimensions
} from 'react-native';
import axios from 'axios';
import MaskInput, { Masks } from 'react-native-mask-input'; // Para aplicar máscara no CPF
import Svg, { Path } from 'react-native-svg';
import Checkbox from 'expo-checkbox';

import { useLogScreen } from '../../../useLogScreen';

const { width, height } = Dimensions.get('window');

const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z" fill="#730d83" />
    </Svg>
);

const DadosImovelPromessa = ({ route, navigation }) => {
    useLogScreen('DadosImovelPromessa');
    const { usuario_id, email_solicitante, payload_vendedores, payload_compradores } = route.params || {};

    const cepInputRef = useRef(null);
    const enderecoInputRef = useRef(null);
    const complementoInputRef = useRef(null);
    const bairroInputRef = useRef(null);
    const cidadeUfInputRef = useRef(null);
    const matriculaImovelRef = useRef(null);

    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidadeUf, setCidadeUf] = useState('');
    const [complemento, setComplemento] = useState('');

    const [matriculaImovel, setMatriculaImovel] = useState('');
    const [numeroCartorio, setNumeroCartorio] = useState('');
    const [showCartorioOptions, setShowCartorioOptions] = useState(false);
    const [isImob, setIsImob] = useState(false); // OK 
    const toggleIsImob = () => setIsImob(prev => !prev);

    const toggleGravame = () => setGravame(prev => !prev);
    const tipoGravameRef = useRef(null);
    const beneficiarioGravameRef = useRef(null);
    const beneficiarioGravameCnpjRef = useRef(null);
    const registroGravameRef = useRef(null);
    const relacaoMoveisRef = useRef(null);
    // GRAVAME
    const [gravame, setGravame] = useState(false);
    const [modalGravameVisible, setModalGravameVisible] = useState(false);
    const [tipoGravame, setTipoGravame] = useState('');
    const [beneficiarioGravame, setBeneficiarioGravame] = useState('');
    const [beneficiarioCnpjGravame, setBeneficiarioCnpjGravame] = useState('');
    const [registroGravame, setRegistroGravame] = useState('');

    // ITENS DO IMÓVEL
    const [temItensImovel, setTemItensImovel] = useState(false);
    const [modalItensVisible, setModalItensVisible] = useState(false);
    const [relacaoMoveis, setRelacaoMoveis] = useState('');

    const handleCepChange = (text) => {
        const formattedCep = text.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
        setCep(formattedCep);
        if (formattedCep.length === 9) {
            buscaCep(formattedCep);
        }
    };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSaveImovel = async () => {        
        const enderecoFull = `${endereco}, ${complemento}, ${bairro} - ${cidadeUf}`;
        const payload = {            
            "endereco_imovel": enderecoFull,
            "matricula_imovel": matriculaImovel,
            "numero_cartorio": numeroCartorio,
            "gravame": gravame,
            "tipo_gravame": tipoGravame,
            "beneficiario_gravame": beneficiarioGravame,
            "beneficiario_cnpj_gravame": beneficiarioCnpjGravame,
            "registro_gravame": registroGravame,
            "relacao_movies": relacaoMoveis                        
        };

        console.log(payload)
        navigation.navigate('EtapasPromessa', { usuario_id, email_solicitante, payload_vendedores, payload_compradores, status: 4, payload_imovel_one: payload });
        setIsSubmitting(true);
    };

    const isFormValid = () => cep && endereco && bairro && cidadeUf && matriculaImovel && numeroCartorio;

    const buscaCep = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
            if (response.data) {
                setEndereco(response.data.logradouro);
                setBairro(response.data.bairro);
                setCidadeUf(`${response.data.localidade}/${response.data.uf}`);
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível buscar o CEP');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>
                    Promessa de Compra e Venda
                </Text>
            </View>
            <Text style={styles.classificacaoText} allowFontScaling={false}>
                Informações do Imóvel
            </Text>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.container}>
                            {/* CEP */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel}>CEP *</Text>
                                <TouchableWithoutFeedback onPress={() => cepInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={cepInputRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="00000-000"
                                            placeholderTextColor="#A9A9A9"
                                            value={cep}
                                            onChangeText={handleCepChange}
                                            keyboardType="numeric"
                                            maxLength={9}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Endereço */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel}>Endereço *</Text>
                                <TouchableWithoutFeedback onPress={() => enderecoInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={enderecoInputRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Rua, Avenida..."
                                            placeholderTextColor="#A9A9A9"
                                            value={endereco}
                                            onChangeText={setEndereco}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Complemento */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel}>Complemento (opcional)</Text>
                                <TouchableWithoutFeedback onPress={() => complementoInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={complementoInputRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Apto, Bloco..."
                                            placeholderTextColor="#A9A9A9"
                                            value={complemento}
                                            onChangeText={setComplemento}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Bairro */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel}>Bairro *</Text>
                                <TouchableWithoutFeedback onPress={() => bairroInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={bairroInputRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Bairro"
                                            placeholderTextColor="#A9A9A9"
                                            value={bairro}
                                            onChangeText={setBairro}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Cidade/UF */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel}>Cidade/UF *</Text>
                                <TouchableWithoutFeedback onPress={() => cidadeUfInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={cidadeUfInputRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Cidade/UF"
                                            placeholderTextColor="#A9A9A9"
                                            value={cidadeUf}
                                            onChangeText={setCidadeUf}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={styles.divider} />
                            {/* Matrícula do Imóvel */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Matrícula do Imóvel *</Text>
                                <TouchableWithoutFeedback onPress={() => matriculaImovelRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={matriculaImovelRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Digite o número da matrícula"
                                            placeholderTextColor="#A9A9A9"
                                            value={matriculaImovel}
                                            onChangeText={setMatriculaImovel}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Número do Cartório (Select personalizado) */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Cartório de Registro do Imóvel*</Text>
                                <TouchableWithoutFeedback onPress={() => setShowCartorioOptions(!showCartorioOptions)}>
                                    <View style={[styles.areaInput, { justifyContent: 'center' }]}>
                                        <Text style={{ color: numeroCartorio ? '#1F2024' : '#A9A9A9' }}>
                                            {numeroCartorio || 'Selecionar cartório'}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>

                                {showCartorioOptions && (
                                    <View style={styles.optionsContainer}>
                                        {[
                                            '1º Ofício de Registro de Imóveis do DF',
                                            '2º Ofício de Registro de Imóveis do DF',
                                            '3º Ofício de Registro de Imóveis do DF',
                                            '4º Ofício de Registro de Imóveis do DF',
                                            '5º Ofício de Registro de Imóveis do DF',
                                            '6º Ofício de Registro de Imóveis do DF',
                                            '7º Ofício de Registro de Imóveis do DF',
                                            '8º Ofício de Registro de Imóveis do DF',
                                            '9º Ofício de Registro de Imóveis do DF',
                                        ].map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                style={styles.optionItem}
                                                onPress={() => {
                                                    setNumeroCartorio(option);
                                                    setShowCartorioOptions(false);
                                                }}
                                            >
                                                <Text style={styles.optionText}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            {/* Checkbox "Não possui condomínio" */}
                            <View style={styles.checkboxRow}>
                                <Checkbox
                                    value={gravame}
                                    onValueChange={toggleGravame}
                                    color={gravame ? '#730d83' : undefined}
                                />
                                <Text style={styles.checkboxLabel} allowFontScaling={false}>O imóvel possui gravame? </Text>
                            </View>
                            {gravame && (
                                <View style={[styles.row, styles.mt_20]}>
                                    <Text style={styles.subTitulo} allowFontScaling={false}>Informações do gravame</Text>
                                    <View style={styles.row}>
                                        <Text style={styles.subLabel} allowFontScaling={false}>Tipo de Gravame*</Text>
                                        <TouchableWithoutFeedback onPress={() => tipoGravameRef.current.focus()}>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    ref={tipoGravameRef}
                                                    allowFontScaling={false}
                                                    style={styles.areaInput}
                                                    placeholder="Ex: Alienação Fiduciária"
                                                    value={tipoGravame}
                                                    placeholderTextColor="#A9A9A9"
                                                    onChangeText={setTipoGravame}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.subLabel} allowFontScaling={false}>Beneficiario do Gravame*</Text>
                                        <TouchableWithoutFeedback onPress={() => beneficiarioGravameRef.current.focus()}>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    ref={beneficiarioGravameRef}
                                                    allowFontScaling={false}
                                                    style={styles.areaInput}
                                                    placeholder="Razão Social"
                                                    value={beneficiarioGravame}
                                                    placeholderTextColor="#A9A9A9"
                                                    onChangeText={setBeneficiarioGravame}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.subLabel} allowFontScaling={false}>CNPJ do Beneficiário*</Text>
                                        <TouchableWithoutFeedback onPress={() => beneficiarioGravameCnpjRef.current.focus()}>
                                            <View style={styles.inputContainer}>
                                                <MaskInput
                                                    ref={beneficiarioGravameCnpjRef}
                                                    allowFontScaling={false}
                                                    style={styles.areaInput}
                                                    value={beneficiarioCnpjGravame}
                                                    onChangeText={setBeneficiarioCnpjGravame}
                                                    mask={Masks.BRL_CNPJ}
                                                    placeholderTextColor="#A9A9A9"
                                                    keyboardType="numeric"
                                                    placeholder="12.345.678/0001-90"
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.subLabel} allowFontScaling={false}>Número de registro no gravame*</Text>
                                        <TouchableWithoutFeedback onPress={() => registroGravameRef.current.focus()}>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    ref={registroGravameRef}
                                                    allowFontScaling={false}
                                                    style={styles.areaInput}
                                                    placeholder="R-12345"
                                                    value={registroGravame}
                                                    keyboardType='number-pad'
                                                    placeholderTextColor="#A9A9A9"
                                                    onChangeText={setRegistroGravame}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            )}
                            <View style={styles.checkboxRow}>
                                <Checkbox
                                    value={isImob}
                                    onValueChange={toggleIsImob}
                                    color={isImob ? '#730d83' : undefined}
                                />
                                <Text style={styles.checkboxLabel} allowFontScaling={false}>Possui vínculo com imobiliária </Text>
                            </View>
                            {isImob && (
                                <View style={[styles.row, styles.mt_20]}>
                                    <View style={styles.row}>
                                        <Text style={styles.subLabel} allowFontScaling={false}>Relação de móveis*</Text>
                                        <TouchableWithoutFeedback onPress={() => relacaoMoveisRef.current.focus()}>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    ref={relacaoMoveisRef}
                                                    style={[styles.areaInput]}
                                                    multiline
                                                    value={relacaoMoveis}
                                                    onChangeText={setRelacaoMoveis}
                                                    placeholder="Ex: Fogão embutido, armários planejados..."
                                                    placeholderTextColor="#A9A9A9"
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>


                                </View>
                            )}

                            <View style={styles.divider} />

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.saveButton,
                                        (!isFormValid() || isSubmitting) && { backgroundColor: '#ccc' },
                                    ]}
                                    onPress={handleSaveImovel}
                                    disabled={!isFormValid() || isSubmitting}
                                >
                                    <Text style={styles.saveButtonText}>
                                        {isSubmitting ? 'Enviando...' : 'Próximo'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.laterButton}
                                    onPress={() => navigation.navigate('Home', { usuario_id })}
                                >
                                    <Image source={require('../../../assets/icons/home.png')} style={styles.laterIcon} />
                                    <Text style={styles.laterButtonText}>Voltar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const styles = {
    mt_30: {
        marginTop: 30
    },
    mt_20: {
        marginTop: 20
    },
    mt_10: {
        marginTop: 10
    },
    modalWrapper: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },

    modalButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },

    cancelButton: {
        flex: 1,
        marginRight: 8,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
    },

    cancelButtonText: {
        color: '#333',
        fontSize: 15,
        fontWeight: '600',
    },

    // saveButton: {
    //     flex: 1,
    //     marginLeft: 8,
    //     paddingVertical: 12,
    //     borderRadius: 10,
    //     backgroundColor: '#730d83',
    //     alignItems: 'center',
    // },



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

    // 
    subTitulo: {
        fontSize: Platform.select({ ios: width * 0.039, android: width * 0.036, web: width * 0.036 }),
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: 10,
        textAlign: 'left',
        // paddingLeft: 20,
    },

    // voltar 
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
        fontSize: width * 0.035,
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
    areaInput: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#FFF',
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

    // pagamento 
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 15,
        width: '100%',
    },

    // valores

    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#7A7A7A',
        marginLeft: 10,
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
        marginTop: 10,
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
        color: '#FFF',
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
};

export default DadosImovelPromessa;