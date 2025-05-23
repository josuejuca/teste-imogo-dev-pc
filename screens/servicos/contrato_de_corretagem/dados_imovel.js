import React, { useState, useRef } from 'react';
import { Alert, Image, View, Text, TouchableOpacity, TextInput, ScrollView, StatusBar, SafeAreaView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import axios from 'axios';
import Svg, { Path } from 'react-native-svg';
import { useLogScreen } from '../../../useLogScreen';
const { width, height } = Dimensions.get('window');

// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z" fill="#730d83" />
    </Svg>
);

const DadosImovel = ({ route, navigation }) => {
    useLogScreen('DadosImovel');
    const { usuario_id, email_solicitante } = route.params || {};
    console.log("USUARIO ID", usuario_id)
    // Referências para os inputs
    const cepInputRef = useRef(null);
    const enderecoInputRef = useRef(null);
    const complementoInputRef = useRef(null);
    const bairroInputRef = useRef(null);
    const cidadeUfInputRef = useRef(null);
    const IptuInputRef = useRef(null);
    const CorretagemInputRef = useRef(null);
    const MatInputRef = useRef(null);
    // Estado dos campos
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidadeUf, setCidadeUf] = useState('');
    const [complemento, setComplemento] = useState('');
    const [iptu, setIptu] = useState('');
    const [corretagem, setCorretagem] = useState('');
    const [mat, setMat] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imovelData, setImovelData] = useState(null);
    const [valorVendaImovel, setValorVendaImovel] = useState('');
    // Máscara para o CEP
    const handleCepChange = (text) => {
        const formattedCep = text.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
        setCep(formattedCep);
        if (formattedCep.length === 9) {
            buscaCep(formattedCep);
        }
    };

    // Busca endereço pelo CEP
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

    // Validação para habilitar o botão "Salvar"
    const isFormValid = () => cep && endereco && bairro && cidadeUf && corretagem && valorVendaImovel;

    // Função para formatar o valor como moeda (R$)
    const formatCurrency = (value) => {
        if (!value) return '';

        // Remove tudo o que não for número
        const numericValue = value.replace(/[^0-9]/g, '');

        // Converte para número e formata com casas decimais
        const formattedValue = (numericValue / 100).toFixed(2).replace('.', ',');

        // Insere o ponto a cada três dígitos (se necessário)
        return 'R$ ' + formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleSaveImovel = async () => {
        if (!isFormValid()) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
            return;
        }

        setIsSubmitting(true); // Inicia a submissão

        const formattedCorretagem = parseFloat(corretagem.replace(',', '.'));
        const formattedValorVenda = parseFloat(valorVendaImovel.replace('R$ ', '').replace('.', '').replace(',', '.'));
        const enderecoFull = `${endereco} ${complemento}, ${bairro}- ${cidadeUf}`;
        
        navigation.navigate('EtapasCorretagem', { status: 2 ,usuario_id, endereco_imovel: enderecoFull, email_solicitante: email_solicitante, valor_de_venda: formattedValorVenda, percentual_corretagem: formattedCorretagem });
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>
                    Contrato de corretagem
                </Text>
            </View>
            {/* <Text style={styles.classificacaoText} allowFontScaling={false}>
                Dados do imovel
            </Text> */}
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.container}>
                            <Text style={styles.subTitulo} allowFontScaling={false}>Endereço do imóvel</Text>
                            {/* CEP */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>CEP *</Text>
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
                                <Text style={styles.subLabel} allowFontScaling={false}>Endereço *</Text>
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
                                <Text style={styles.subLabel} allowFontScaling={false}>Complemento (opcional)</Text>
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
                                <Text style={styles.subLabel} allowFontScaling={false}>Bairro *</Text>
                                <TouchableWithoutFeedback onPress={() => bairroInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={bairroInputRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholderTextColor="#A9A9A9"
                                            placeholder="Bairro"
                                            value={bairro}
                                            onChangeText={setBairro}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Cidade e UF */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Cidade/UF *</Text>
                                <TouchableWithoutFeedback onPress={() => cidadeUfInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholderTextColor="#A9A9A9"
                                            ref={cidadeUfInputRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Cidade/UF"
                                            value={cidadeUf}
                                            onChangeText={setCidadeUf}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Separador visual (Divisão) */}
                            <View style={styles.divider} />

                            <View style={styles.row}>
                                <Text style={styles.subTitulo} allowFontScaling={false}>Informações adicionais</Text>
                                <Text style={styles.subLabel} allowFontScaling={false}>Valor de venda do imovel  *</Text>
                                <TouchableWithoutFeedback onPress={() => MatInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.areaInput}
                                            placeholder="R$"
                                            value={valorVendaImovel}
                                            onChangeText={(text) => setValorVendaImovel(formatCurrency(text))}
                                            keyboardType="numeric"
                                            allowFontScaling={false}
                                            placeholderTextColor="#A9A9A9"
                                            pointerEvents="auto"
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Percentual de corretagem (%)*</Text>
                                <TouchableWithoutFeedback onPress={() => CorretagemInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={CorretagemInputRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Ex: 5"
                                            keyboardType="numeric"
                                            placeholderTextColor="#A9A9A9"
                                            value={corretagem}
                                            onChangeText={setCorretagem}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Botão Salvar */}
                            <View style={styles.buttonContainer}>

                                <TouchableOpacity
                                    style={[
                                        styles.saveButton,
                                        (!isFormValid() || isSubmitting) && { backgroundColor: '#ccc' },
                                    ]}
                                    onPress={handleSaveImovel}
                                    disabled={!isFormValid() || isSubmitting} // Desabilita durante a submissão
                                >
                                    <Text style={styles.saveButtonText} allowFontScaling={false}>
                                        {isSubmitting ? "Enviando..." : "Próximo"}
                                    </Text>
                                </TouchableOpacity>

                                {/*  */}
                                <TouchableOpacity style={styles.laterButton}>
                                    <Image
                                        source={require('../../../assets/icons/home.png')} // Ícone de terminar mais tarde
                                        style={styles.laterIcon}
                                    />
                                    <Text
                                        style={styles.laterButtonText}
                                        allowFontScaling={false}
                                        onPress={() => navigation.navigate('Home', { usuario_id })}
                                    >
                                        Voltar
                                    </Text>
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

export default DadosImovel;