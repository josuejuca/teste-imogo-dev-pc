import React, { useState, useRef } from 'react';
import {
    Alert,
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
} from 'react-native';
import axios from 'axios';
import MaskInput, { Masks } from 'react-native-mask-input';
import Svg, { Path } from 'react-native-svg';
const { width, height } = Dimensions.get('window');
import { useLogScreen } from '../../../useLogScreen';
import Checkbox from 'expo-checkbox';
import { use } from 'react';
// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
            d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z"
            fill="#730d83"
        />
    </Svg>
);

const DadosNegociacao = ({ route, navigation }) => {
    useLogScreen('DadosNegociacao');
    const { usuario_id, email_solicitante, payload_vendedores } = route.params || {};
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [proprietarios, setProprietarios] = useState([
        {
            nomeCompleto: '',
            email_contratante: '',
            cpf_contratante: '',
            tel_contratante: '',
            cep_contratante: '',
            endereco_contratante: '',
            complemento_contratante: '',
            bairro_contratante: '',
            cidadeUf_contratante: '',
            estado_civil: '',
            nome_conjuge: '',
            nacionalidade_conjuge: '',
            rg_conjuge: '',
            ssp_rg_conjuge: '',
            cpf_conjuge: '',
            nacionalidade: '',
            rg_number: '',
            ssp_rg: '',
            erroNome: '',
        },
    ]);

    const [pagamentos, setPagamentos] = useState([
        {
            tipo: '',
            vencimento: '',
            valor: '',
            forma_pagamento: '',
            juros: ''
        },
    ]);
    const matriculaImovelRef = useRef(null);
    const [matriculaImovel, setMatriculaImovel] = useState('');
    const nomeCompletoRef = useRef([]);
    const cpfRef = useRef([]);
    const cepRef = useRef([]);
    const [valor_venda, setValor_venda] = useState('');
    const valor_vendaRef = useRef(null);
    const [valor_sinal, setValor_sinal] = useState('');
    const valor_sinalRef = useRef(null);
    const [valor_comissao, setValor_comissao] = useState('');
    const valor_comissaoRef = useRef(null);
    const [pagamentoSialTipo, setPagamentoSialTipo] = useState('');
    const pagamentoSialTipoRef = useRef(null);
    const [imob, setImob] = useState('');
    const imobRef = useRef(null);
    const [fgts, setFgts] = useState(false);

    const toggleFgts = () => setFgts(prev => !prev);

    const [isImob, setIsImob ]= useState(false);

    const toggleIsImob = () => setIsImob(prev => !prev);

    const atualizarProprietario = (index, campo, valor) => {
        const novosProprietarios = [...proprietarios];
        novosProprietarios[index][campo] = valor;
        setProprietarios(novosProprietarios);
    };

    const atulizaPagamentos = (index, campo, valor) => {
        const novosPagamentos = [...pagamentos];
        novosPagamentos[index][campo] = valor;
        setPagamentos(novosPagamentos)
    }

    const adicionarProprietario = () => {
        setProprietarios([
            ...proprietarios,
            {
                nomeCompleto: '',
                email_contratante: '',
                cpf_contratante: '',
                tel_contratante: '',
                cep_contratante: '',
                endereco_contratante: '',
                complemento_contratante: '',
                bairro_contratante: '',
                cidadeUf_contratante: '',
                estado_civil: '',
                nome_conjuge: '',
                nacionalidade_conjuge: '',
                rg_conjuge: '',
                ssp_rg_conjuge: '',
                cpf_conjuge: '',
                nacionalidade: '',
                rg_number: '',
                ssp_rg: '',
                erroNome: '',
            },
        ]);
    };
    const adicionarPagamentos = () => {
        setPagamentos([
            ...pagamentos,
            {
                tipo: '',
                vencimento: '',
                valor: '',
                forma_pagamento: '',
                juros: ''
            },
        ]);
    };

    const handleCepChange = (text, index) => {
        const formattedCep = text.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
        atualizarProprietario(index, 'cep_contratante', formattedCep);
        if (formattedCep.length === 9) {
            atualizarEnderecoViaCep(formattedCep, index);
        }
    };

    const atualizarEnderecoViaCep = async (cep, index) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
            if (response.data) {
                const novosProprietarios = [...proprietarios];
                const p = { ...novosProprietarios[index] };

                // Atualiza com base no que foi retornado, mantendo campo editável
                p.endereco_contratante = response.data.logradouro || p.endereco_contratante;
                p.bairro_contratante = response.data.bairro || p.bairro_contratante;
                p.cidadeUf_contratante = `${response.data.localidade}/${response.data.uf}` || p.cidadeUf_contratante;

                novosProprietarios[index] = p;
                setProprietarios(novosProprietarios);
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível buscar o CEP');
        }
    };

    const isEmailValido = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const isFormValid = () => {
        return proprietarios.every((p) => p.nomeCompleto && p.cpf_contratante && p.cep_contratante);
    };

    const handleSaveImovel = async () => {
        const contratantesFormatados = proprietarios.map((p) => {
            const [cidade, uf] = (p.cidadeUf_contratante || '').split('/');

            const base = {
                nome: p.nomeCompleto,
                cpf: p.cpf_contratante,
                rg_number: p.rg_number,
                ssp_rg: p.ssp_rg,
                estado_civil: p.estado_civil,
                endereco: `${p.endereco_contratante} ${p.complemento_contratante}`.trim(),
                telefone: p.tel_contratante,
                nacionalidade: p.nacionalidade || 'brasileiro(a)',
            };

            if (p.estado_civil.toLowerCase() === 'casado') {
                return {
                    ...base,
                    nome_conjuge: p.nome_conjuge,
                    nacionalidade_conjuge: p.nacionalidade_conjuge,
                    rg_conjuge: p.rg_conjuge,
                    ssp_rg_conjuge: p.ssp_rg_conjuge,
                    cpf_conjuge: p.cpf_conjuge,
                };
            }

            return base;
        });

        // navigation.navigate('EtapasPromessa', { usuario_id, email_solicitante, payload_vendedores, payload_compradores: contratantesFormatados, status: 3 });
        setIsSubmitting(true);

    };
    console.log(isImob)
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
                Negociação
            </Text>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        {/* <View style={styles.divider} /> */}
                        <View style={styles.row}>
                            <Text style={styles.subLabel} allowFontScaling={false}>Valor de venda do imóvel *</Text> 
                            <TouchableWithoutFeedback onPress={() => valor_vendaRef.current.focus()}>
                                <View style={styles.inputContainer}>
                                    <MaskInput
                                        ref={valor_vendaRef}
                                        allowFontScaling={false}
                                        keyboardType='number-pad'
                                        mask={Masks.BRL_CURRENCY}
                                        style={styles.areaInput}
                                        placeholder="R$"
                                        placeholderTextColor="#A9A9A9"
                                        value={valor_venda}
                                        onChangeText={setValor_venda}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.subLabel} allowFontScaling={false}>Valor do sinal *</Text>
                            <TouchableWithoutFeedback onPress={() => valor_sinalRef.current.focus()}>
                                <View style={styles.inputContainer}>
                                    <MaskInput
                                        ref={valor_sinalRef}
                                        allowFontScaling={false}
                                        keyboardType='number-pad'
                                        mask={Masks.BRL_CURRENCY}
                                        style={styles.areaInput}
                                        placeholder="R$"
                                        placeholderTextColor="#A9A9A9"
                                        value={valor_sinal}
                                        onChangeText={setValor_sinal}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        {/* Matrícula do Imóvel */}
                        <View style={styles.row}>
                            <Text style={styles.subLabel} allowFontScaling={false}>Forma de pagamento do sinal *</Text>
                            <TouchableWithoutFeedback onPress={() => pagamentoSialTipoRef.current.focus()}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={pagamentoSialTipoRef}
                                        allowFontScaling={false}
                                        keyboardType='number-pad'
                                        style={styles.areaInput}
                                        placeholder="Ex: Pix, boleto ..."
                                        placeholderTextColor="#A9A9A9"
                                        value={pagamentoSialTipo}
                                        onChangeText={setPagamentoSialTipo}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.subLabel} allowFontScaling={false}>Valor da commisão *</Text>
                            <TouchableWithoutFeedback onPress={() => valor_comissaoRef.current.focus()}>
                                <View style={styles.inputContainer}>
                                    <MaskInput
                                        ref={valor_comissaoRef}
                                        allowFontScaling={false}
                                        keyboardType='number-pad'
                                        mask={Masks.BRL_CURRENCY}
                                        style={styles.areaInput}
                                        placeholder="R$"
                                        placeholderTextColor="#A9A9A9"
                                        value={valor_comissao}
                                        onChangeText={setValor_comissao}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        {/* Checkbox "Não possui condomínio" */}
                        <View style={styles.checkboxRow}>
                            <Checkbox
                                value={fgts}
                                onValueChange={toggleFgts}
                                color={fgts ? '#730d83' : undefined}
                            />
                            <Text style={styles.checkboxLabel} allowFontScaling={false}>Vai ser usado FGTS como uma forma de pagamento? </Text>
                        </View>
                        <View style={styles.checkboxRow}>
                            <Checkbox
                                value={isImob}
                                onValueChange={toggleIsImob}
                                color={isImob ? '#730d83' : undefined}
                            />
                            <Text style={styles.checkboxLabel} allowFontScaling={false}>Possui vínculo com imobiliária? </Text>
                        </View>
                        {isImob && (
                            <View style={[styles.row, styles.mt_20]}>
                                <View style={styles.row}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Nome da imobiliária*</Text>
                                    <TouchableWithoutFeedback onPress={() => imobRef.current.focus()}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                ref={imobRef}
                                                style={[styles.areaInput]}
                                                multiline
                                                value={imob}
                                                onChangeText={setImob}
                                                placeholder="Nome da imobiliária "
                                                placeholderTextColor="#A9A9A9"
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        )}
                        <View style={styles.divider} />
                        <Text style={styles.subLabel} allowFontScaling={false}>Pagamentos</Text>
                        {pagamentos.map((p, index) => (
                            <View key={index} style={styles.proprietarioContainer}>


                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Tipo de pagamento</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.tipo}
                                        onChangeText={(text) => atulizaPagamentos(index, 'tipo', text)}
                                        placeholder="EX: Financiamento, FGTS..."
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Data de vencimento</Text>
                                    <MaskInput
                                        style={styles.areaInput}
                                        keyboardType='number-pad'
                                        value={p.vencimento}
                                        mask={Masks.DATE_DDMMYYYY}
                                        onChangeText={(text) => atulizaPagamentos(index, 'vencimento', text)}
                                        placeholder="EX: 19/12/2025"
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Valor do pagamento</Text>
                                    <MaskInput
                                        style={styles.areaInput}
                                        value={p.valor}
                                        mask={Masks.BRL_CURRENCY}
                                        onChangeText={(text) => atulizaPagamentos(index, 'valor', text)}
                                        placeholder="R$"
                                        keyboardType='number-pad'
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Forma de pagamento</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.forma_pagamento}
                                        onChangeText={(text) => atulizaPagamentos(index, 'forma_pagamento', text)}
                                        placeholder="EX: Boleto, Pix, TED..."
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>


                                {pagamentos.length > 1 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const novaLista = pagamentos.filter((_, i) => i !== index);
                                            setPagamentos(novaLista);
                                        }}
                                        style={{ alignSelf: 'flex-end', marginBottom: 10 }}
                                    >
                                        <Text style={{ color: 'red', fontWeight: 'bold' }}>Remover</Text>
                                    </TouchableOpacity>
                                )}
                                <View style={styles.divider} />
                            </View>
                        ))}



                        <TouchableOpacity style={styles.laterButton} onPress={adicionarPagamentos}>
                            <Text style={styles.laterButtonText}>Incluir novo pagamento</Text>
                        </TouchableOpacity>

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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

};

const styles = {
    errorText: {
        marginTop: 5,
        color: 'red',
        fontSize: 14,
    },

    subTitulo: {
        fontSize: Platform.select({ ios: width * 0.039, android: width * 0.036, web: width * 0.036 }),
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: 10,
        textAlign: 'left',
        // paddingLeft: 20,
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

export default DadosNegociacao;
