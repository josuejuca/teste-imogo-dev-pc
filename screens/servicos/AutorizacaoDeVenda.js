import React, { useState, useRef } from 'react';
import { Alert, View, Text, TouchableOpacity, TextInput, ScrollView, StatusBar, Dimensions, SafeAreaView, Platform, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Modal } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import { TextInputMask } from 'react-native-masked-text';
import Svg, { Path, G, Rect, Mask, Ellipse, ClipPath } from 'react-native-svg';
import MaskInput, { Masks } from 'react-native-mask-input'; // Para aplicar máscara no CPF
import DescricaoModal from '../modal/DescricaoModal';
import { useLogScreen } from '../../useLogScreen';
const { width, height } = Dimensions.get('window');

// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path fillRule="evenodd" clipRule="evenodd" d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z" fill="#730d83" />
    </Svg>
);

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

const icons = {

    Imobiliária: {
        default: require('../../assets/icons/cnpj.png'),
        selected: require('../../assets/icons/cnpj_white.png'),
    },
    Corretor: {
        default: require('../../assets/icons/2perfil.png'),
        selected: require('../../assets/icons/perfil.png'),
    }
};

const AutorizacaoDeVenda = ({ route, navigation }) => {
    useLogScreen('AutorizacaoDeVenda');
    const { id = null, status = 1, usuario_id, status_user, emailUser } = route.params || {};
    console.log("user ID aqui:", usuario_id)
    console.log("Email User aqui:", emailUser)

    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [valorVendaImovel, setValorVendaImovel] = useState(''); // OK    
    const [cpf, setCpf] = useState(''); // OK
    const [creci, setCreci] = useState(''); // ok
    const [corretagem, setCorretagem] = useState(''); // ok
    const [cartorio, setCartorio] = useState(''); // ok
    const [mat, setMat] = useState(''); // ok
    const [cnpj, setCnpj] = useState(''); // OK     
    const [naoGravame, setNaoGravame] = useState(false); // OK 
    const [nomeCompleto, setNomeCompleto] = useState(''); // OK 
    const [nomeRazao, setNomeRazao] = useState(''); // OK 
    const [descricao, setDescricao] = useState('');  // Estado para a descrição

    // ref useRef(null);
    const nomeCompletoRef = useRef(null);
    const nomeCorretorRef = useRef(null);

    const creciRef = useRef(null);
    const cpfRef = useRef(null);
    const cnpjRef = useRef(null);
    const matRef = useRef(null);
    const cartorioRef = useRef(null);
    const corretagemRef = useRef(null);

    const [tipoCorretor, setTipoCorretor] = useState('')
    // Controle de exibição das listas de opções
    const [showOptions, setShowOptions] = useState(false);

    const Options = ['Imobiliária', 'Corretor'];

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleDescricao, setIsModalVisibleDescricao] = useState(false);

    const toggleModalDescricao = () => {
        setIsModalVisibleDescricao(!isModalVisibleDescricao);
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const isFormValid = () => !!(valorVendaImovel && cpf && cnpj && creci && nomeRazao && nomeCompleto && tipoCorretor && corretagem && cartorio && mat);
    // Função para enviar os dados do imóvel para a API

    const handleSaveImovel = async () => {
        if (!isFormValid()) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
            return;
        }

        if (isSubmitting) return; // Impede múltiplos envios

        setIsSubmitting(true); // Desativa o botão
        setLoading(true);

        const formatarNumero = (valor) => Number(valor.replace(/[R$\.\s]/g, '').replace(',', '.'));

        try {
            const payload = {
                "vendedor": nomeCompleto,
                "cpf_mask": cpf,
                "razao_corretor": nomeRazao,
                "cnpj_mask_corretor": cnpj,
                "creci_corretor": creci,
                "cartorio_number": cartorio,
                "mat_number": mat,
                "valor": formatarNumero(valorVendaImovel),
                "corretagem_number": corretagem,
                "pendencia": naoGravame,
                "pendencia_texto": descricao,
                "tipo_template": tipoCorretor === "Imobiliária" ? "autorizacao_imobiliaria" : "autorizacao_corretor"
            };

            console.log("payload:", payload)

            const response = await axios.post('https://docx.imogo.com.br/gerar-pdf/autorizacao', payload);

            if (response.status === 200) {
                const { pdf_name } = response.data;

                if (!pdf_name) {
                    throw new Error("pdf_name não encontrado na resposta da API");
                }

                const docx_name = pdf_name.replace(".pdf", ".docx");

                const imprimir_link_pdf = `https://docx.imogo.com.br/download/${pdf_name}`;
                const imprimir_link_docx = `https://docx.imogo.com.br/download/${docx_name}`;

                const payload_email = {
                    email: emailUser,
                    tipo_doc: "AUTORIZAÇÃO DE VENDA",
                    nome_cliente: nomeCompleto,
                    link_word: imprimir_link_docx,
                    link_pdf: imprimir_link_pdf
                };

                const response_email = await axios.post(
                    "https://smtp.josuejuca.com/imogo/emails/gerador-de-documentos",
                    payload_email
                );

                if (response_email.status === 200) {
                    navigation.navigate("BaixarDocumento", { usuario_id, emailUser, pdf_name, docx_name });
                }
            } else {
                console.log(response.data);
                Alert.alert("Erro", "Ocorreu um erro ao fazer o documento");
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível fazer o documento');
        } finally {
            setIsSubmitting(false); // Reativa o botão
            setLoading(false);
        }
    };

    const togglenaoGravame = () => setNaoGravame(prev => !prev);

    const selectOptions = (option) => {
        setTipoCorretor(option)
        setShowOptions(false);
    }

    const isWeb = Platform.OS === 'web';

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>Gerador de Contratos</Text>
            </View>

            <Text style={styles.classificacaoText} allowFontScaling={false}>
                Autorização de Venda
            </Text>

            <StatusBar
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled={Platform.OS !== 'web'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.container}>
                            {/* Nome Completo */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Nome ou Razão Social do Proprietário*</Text>
                                <TouchableWithoutFeedback onPress={() => nomeCompletoRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={nomeCompletoRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Nome ou Razão Social"
                                            value={nomeCompleto}
                                            placeholderTextColor="#A9A9A9"
                                            onChangeText={setNomeCompleto}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            {/* CPF */}

                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>CPF ou CNPJ do Proprietário*</Text>
                                <TouchableWithoutFeedback onPress={() => cpfRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <MaskInput
                                            ref={cpfRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            value={cpf}
                                            onChangeText={setCpf}
                                            mask={Masks.BRL_CPF_CNPJ}
                                            placeholderTextColor="#A9A9A9"
                                            keyboardType="numeric"
                                            placeholder="CPF ou CNPJ"
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Separador visual (Divisão) */}
                            <View style={styles.divider} />

                            <View style={styles.row}>
                                <Text style={[styles.subLabel, styles.orientacaoText]} allowFontScaling={false}>Você é imobiliária ou corretor de imóveis?</Text>
                                <View style={styles.orientationGroup}>
                                    {['Corretor', 'Imobiliária'].map((opcao) => (
                                        <TouchableOpacity
                                            key={opcao}
                                            style={[styles.orientationButton, tipoCorretor === opcao && styles.selectedOptionOrientation]}
                                            onPress={() => setTipoCorretor(tipoCorretor === opcao ? '' : opcao)} // Desmarca se já estiver selecionado
                                        >
                                            <Image
                                                source={tipoCorretor === opcao ? icons[opcao].selected : icons[opcao].default}
                                                style={{ width: 30, height: 30, marginBottom: 5 }}
                                            />
                                            <Text style={[styles.optionText, tipoCorretor === opcao && styles.selectedOptionText]} allowFontScaling={false}>
                                                {opcao}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            {/*  */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Seu Nome ou Razão Social*</Text>
                                <TouchableWithoutFeedback onPress={() => nomeCorretorRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={nomeCorretorRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Nome ou Razão Social"
                                            value={nomeRazao}
                                            placeholderTextColor="#A9A9A9"
                                            onChangeText={setNomeRazao}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* CNPJ */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Seu CPF ou CNPJ *</Text>
                                <TouchableWithoutFeedback onPress={() => cnpjRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <MaskInput
                                            ref={cnpjRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            value={cnpj}
                                            onChangeText={setCnpj}
                                            mask={Masks.BRL_CPF_CNPJ}
                                            placeholderTextColor="#A9A9A9"
                                            keyboardType="numeric"
                                            placeholder="CPF ou CNPJ"
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            {/* <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Tipo de corretor</Text>
                                <TouchableWithoutFeedback onPress={() => setShowOptions(!showOptions)}>
                                    <View style={styles.inputContainer}>
                                        <Text allowFontScaling={false} style={styles.areaInput}>
                                            {tipoCorretor ? tipoCorretor : 'Selecionar'}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                {showOptions && (
                                    <View style={styles.optionsContainer}>
                                        {Options.map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                style={styles.optionItem}
                                                onPress={() => selectOptions(option)}
                                            >
                                                <Text style={styles.optionText}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View> */}

                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Seu CRECI*</Text>
                                <TouchableWithoutFeedback onPress={() => creciRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={creciRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Número do CRECI"
                                            value={creci}
                                            keyboardType='numeric'
                                            placeholderTextColor="#A9A9A9"
                                            onChangeText={setCreci}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>



                            {/* Separador visual (Divisão) */}
                            <View style={styles.divider} />
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Percentual de Corretagem negociado com o cliente (%)*</Text>
                                <TouchableWithoutFeedback onPress={() => corretagemRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={corretagemRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Percentual (%)"
                                            value={corretagem}
                                            keyboardType='numeric'
                                            placeholderTextColor="#A9A9A9"
                                            onChangeText={setCorretagem}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Valor de venda do imóvel */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Valor de venda do imóvel *</Text>
                                <TouchableWithoutFeedback onPress={() => { }}>
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
                            {/* Inputs de Área */}
                            {/* <View style={[styles.areaRow]}> */}
                            {/* Área Privativa */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Cartório de Registro do Imóvel*</Text>
                                <TouchableWithoutFeedback onPress={() => cartorioRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.areaInput}
                                            placeholder="N° do cartório"
                                            ref={cartorioRef}
                                            allowFontScaling={false}
                                            value={cartorio}
                                            keyboardType='numeric'
                                            placeholderTextColor="#A9A9A9"
                                            onChangeText={setCartorio}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Área Total */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Matrícula do Imóvel*</Text>
                                <TouchableWithoutFeedback onPress={() => matRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.areaInput}
                                            placeholder="N° da matrícula"
                                            ref={matRef}
                                            allowFontScaling={false}
                                            value={mat}
                                            keyboardType='numeric'
                                            placeholderTextColor="#A9A9A9"
                                            onChangeText={setMat}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            {/* </View> */}

                            {/* Checkbox "Não possui condomínio" */}
                            <View style={styles.checkboxRow}>
                                <Checkbox
                                    value={naoGravame}
                                    onValueChange={togglenaoGravame}
                                    color={naoGravame ? '#730d83' : undefined}
                                />
                                <Text style={styles.checkboxLabel} allowFontScaling={false}>Possui gravame</Text>
                            </View>
                            {naoGravame && (
                                <View style={[styles.row, styles.mt_10]}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Descrição do gravame </Text>
                                    <TouchableOpacity style={styles.descriptionBox} onPress={toggleModalDescricao}>
                                        <Text style={[styles.descriptionText, descricao ? styles.descriptionFilled : styles.placeholderText]} allowFontScaling={false}>
                                            {truncateText(descricao, 30)}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={styles.helperText} allowFontScaling={false}>
                                        Descreva aqui da melhor forma possível as pendência que o imóvel possui.
                                    </Text>
                                </View>
                            )}

                            {/* Modal de Descrição */}
                            <DescricaoModal
                                isVisible={isModalVisibleDescricao}
                                toggleModal={toggleModalDescricao}
                                descricao={descricao}
                                setDescricao={setDescricao}
                            />

                            {/* Separador visual (Divisão) */}
                            <View style={styles.divider} />
                            {/* Botões de ação */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.saveButton,
                                        (!isFormValid() || isSubmitting) && { backgroundColor: '#ccc' }
                                    ]}
                                    onPress={handleSaveImovel}
                                    disabled={!isFormValid() || isSubmitting}
                                >
                                    <Text style={styles.saveButtonText} allowFontScaling={false}>
                                        {isSubmitting ? 'Enviando...' : 'Gerar Documento'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.laterButton}>
                                    <Image
                                        source={require('../../assets/icons/home.png')} // Ícone de terminar mais tarde
                                        style={styles.laterIcon}
                                    />
                                    <Text style={styles.laterButtonText} allowFontScaling={false}
                                        onPress={() => navigation.navigate('Home', { usuario_id })}
                                    >Voltar</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            {/* Modal de carregamento */}
            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.loadingText}>Gerando Documento...</Text>
                </View>
            </Modal>
        </SafeAreaView >
    );
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
        justifyContent: 'flex-start',  // Atualizado para 'flex-start'
        alignItems: 'start',
    },

    optionButton: {
        borderWidth: 1,
        borderColor: '#E9E9E9',
        borderRadius: 25,
        marginHorizontal: 6,
        backgroundColor: '#E9E9E9',
        width: Platform.select({ ios: width * 0.11, android: width * 0.11, web: width * 0.11 }),
        height: Platform.select({ ios: width * 0.11, android: width * 0.11, web: width * 0.11 }),
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
        width: '45%',
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
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.04 }), // Ajuste no tamanho da fonte
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
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.04 }), // Ajuste no tamanho da fonte
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

export default AutorizacaoDeVenda;
