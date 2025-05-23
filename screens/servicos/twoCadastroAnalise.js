import React, { useState, useRef } from 'react';
import { Alert, Image, View, Text, TouchableOpacity, TextInput, ScrollView, StatusBar, SafeAreaView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import axios from 'axios';
import Svg, { Path } from 'react-native-svg';
import { useLogScreen } from '../../useLogScreen';
const { width, height } = Dimensions.get('window');

// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z" fill="#730d83" />
    </Svg>
);

const TwoCadastroAnalise = ({ route, navigation }) => {
    useLogScreen('TwoCadastroAnalise');
    const { id, classificacao = '', tipo = '', usuario_id, status_user, analise_id } = route.params || {};
    console.log("USUARIO ID", usuario_id)
    console.log("analise ID", analise_id)
    // Referências para os inputs
    const cepInputRef = useRef(null);
    const enderecoInputRef = useRef(null);
    const complementoInputRef = useRef(null);
    const bairroInputRef = useRef(null);
    const cidadeUfInputRef = useRef(null);
    const IptuInputRef = useRef(null);
    const CartorioInputRef = useRef(null);
    const MatInputRef = useRef(null);
    // Estado dos campos
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidadeUf, setCidadeUf] = useState('');
    const [complemento, setComplemento] = useState('');
    const [iptu, setIptu] = useState('');
    const [cartorio, setCartorio] = useState('');
    const [mat, setMat] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imovelData, setImovelData] = useState(null);
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
    const isFormValid = () => cep && endereco && bairro && cidadeUf && iptu;

    const handleSaveImovel = async () => {

        if (isSubmitting) return; // Previne múltiplos cliques
        setIsSubmitting(true);


        if (!isFormValid()) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const cidade = cidadeUf.split('/')[0];
            const uf = cidadeUf.split('/')[1];
            const enderecoFull = `${endereco}, ${complemento}`;
            const payload = {
                cep: cep.replace('-', ''),
                endereco: enderecoFull,
                status: 10, // 3
                inscricao_iptu: iptu,
                cartorio: cartorio,
                matricula: mat
            };

            const response = await axios.put(`https://analise2.imogo.com.br/analises/etapa2/${analise_id}/`, payload, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                navigation.navigate('AnaliseSuccessScreen', {
                    usuario_id,
                });
            } else {
                Alert.alert('Erro', 'Ocorreu um erro ao atualizar o endereço.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar o endereço.');
        }
    };

    console.log(status_user)

    // const fetchImovelInfo = async (iptu) => {

    //     console.log(iptu)
    //     if (!iptu) {
    //         console.log("Erro", "Por favor, insira o número de inscrição do IPTU.");
    //         return;
    //     }

    //     console.log("Iniciando a busca pelo imóvel..."); // Log para verificar a chamada da função

    //     try {
    //         const response = await axios.post('https://fichacadastral.vercel.app/consulta-imovel/', {
    //             InscricaoImovel: iptu,
    //         }, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //             }
    //         });

    //         console.log("Resposta da API:", response.data); // Log para exibir a resposta da API

    //         if (response.data.status === "sucesso") {
    //             setImovelData(response.data.dados);
    //             Alert.alert("Sucesso", "Dados do imóvel carregados com sucesso.");
    //         } else {
    //             Alert.alert("Erro", "Não foi possível carregar os dados do imóvel.");
    //         }
    //     } catch (error) {
    //         console.error("Erro ao buscar dados do imóvel:", error); // Log para capturar erros na requisição
    //         Alert.alert("Erro", "Ocorreu um erro ao buscar os dados do imóvel.");
    //     }
    // };



    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>Dados do imóvel</Text>
            </View>
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
                                <Text style={styles.subLabel} allowFontScaling={false}>Nº do Matricula  *</Text>
                                <TouchableWithoutFeedback onPress={() => MatInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={MatInputRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Ex: 12345"
                                            placeholderTextColor="#A9A9A9"
                                            value={mat}
                                            onChangeText={setMat}
                                        // onBlur={() => {
                                        //     console.log("Chamando fetchImovelInfo com inscrição:", iptu); // Log para verificar se o evento é acionado
                                        //     fetchImovelInfo(iptu);
                                        // }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Nº do cartorio  *</Text>
                                <TouchableWithoutFeedback onPress={() => CartorioInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={CartorioInputRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Ex: 1° Ofício"
                                            placeholderTextColor="#A9A9A9"
                                            value={cartorio}
                                            onChangeText={setCartorio}
                                        // onBlur={() => {
                                        //     console.log("Chamando fetchImovelInfo com inscrição:", iptu); // Log para verificar se o evento é acionado
                                        //     fetchImovelInfo(iptu);
                                        // }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={styles.row}>

                                <Text style={styles.subLabel} allowFontScaling={false}>Nº de inscrição do IPTU *</Text>
                                <TouchableWithoutFeedback onPress={() => IptuInputRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={IptuInputRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder=""
                                            placeholderTextColor="#A9A9A9"
                                            value={iptu}
                                            onChangeText={setIptu}
                                        // onBlur={() => {
                                        //     console.log("Chamando fetchImovelInfo com inscrição:", iptu); // Log para verificar se o evento é acionado
                                        //     fetchImovelInfo(iptu);
                                        // }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>


                            {/* Exibindo dados do imóvel (exemplo)
                            {imovelData && (
                                <View>
                                    <Text>Cartorio: {imovelData.CartorioRegistroImoveis}</Text>
                                    <Text>Matricula: {imovelData.Matricula}</Text>
                                </View>
                            )} */}

                            {/* Botão Salvar */}
                            <View style={styles.buttonContainer}>
                                {/* <TouchableOpacity
                                    style={[styles.saveButton, !isFormValid() && { backgroundColor: '#ccc' }]}
                                    onPress={handleSaveImovel}
                                    disabled={!isFormValid()}
                                >
                                    <Text style={styles.saveButtonText} allowFontScaling={false}>Salvar endereço</Text>
                                </TouchableOpacity> */}

                                {/*  */}

                                <TouchableOpacity
                                    style={[
                                        styles.saveButton,
                                        (!isFormValid() || isSubmitting) && { backgroundColor: '#ccc' },
                                    ]}
                                    onPress={handleSaveImovel}
                                    disabled={!isFormValid() || isSubmitting} // Desabilita durante a submissão
                                >
                                    <Text style={styles.saveButtonText} allowFontScaling={false}>
                                        {isSubmitting ? "Enviando..." : "Salvar"}
                                    </Text>
                                </TouchableOpacity>

                                {/*  */}
                                <TouchableOpacity style={styles.laterButton}>
                                    <Image
                                        source={require('../../assets/icons/bookmark.png')} // Ícone de terminar mais tarde
                                        style={styles.laterIcon}
                                    />
                                    <Text
                                        style={styles.laterButtonText}
                                        allowFontScaling={false}
                                        onPress={() => navigation.navigate('Home', { usuario_id })}
                                    >
                                        Terminar mais tarde
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
    subTitulo: {
        fontSize: Platform.select({ ios: width * 0.039, android: width * 0.036, web: width * 0.036 }),
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: 10,
        textAlign: 'left',
        // paddingLeft: 20,
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
        width: 15,
        height: 20,
        marginRight: 8,
    },
    laterButtonText: {
        color: '#730d83',
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.03 }), // Ajuste no tamanho da fonte
        fontWeight: '600',
    },
};

export default TwoCadastroAnalise;