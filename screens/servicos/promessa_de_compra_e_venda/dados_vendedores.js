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

// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
            d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z"
            fill="#730d83"
        />
    </Svg>
);

const DadosVendedores = ({ route, navigation }) => {
    useLogScreen('DadosVendedores');
    const { usuario_id, email_solicitante } = route.params || {};
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

    const nomeCompletoRef = useRef([]);
    const cpfRef = useRef([]);
    const cepRef = useRef([]);

    const atualizarProprietario = (index, campo, valor) => {
        const novosProprietarios = [...proprietarios];
        novosProprietarios[index][campo] = valor;
        setProprietarios(novosProprietarios);
    };

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
        return proprietarios.every((p) => {
            const nomeValido = p.nomeCompleto.trim().split(' ').length >= 2;
            return (
                nomeValido &&
                p.cpf_contratante &&
                p.cep_contratante &&
                p.rg_number &&
                p.ssp_rg &&
                p.tel_contratante &&
                p.nacionalidade &&
                p.estado_civil &&
                p.endereco_contratante &&
                p.cidadeUf_contratante &&
                p.bairro_contratante
            );
        });
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
       
        navigation.navigate('EtapasPromessa', {usuario_id, email_solicitante, payload_vendedores: contratantesFormatados, status: 2});
        setIsSubmitting(true);
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
                Promitente Vendedor(es)
            </Text>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        {proprietarios.map((p, index) => (
                            <View key={index} style={styles.proprietarioContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Nome Completo</Text>
                                    <TouchableWithoutFeedback onPress={() => nomeCompletoRef.current[index]?.focus()}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                ref={(ref) => (nomeCompletoRef.current[index] = ref)}
                                                allowFontScaling={false}
                                                style={styles.areaInput}
                                                placeholder="Nome e Sobrenome"
                                                value={p.nomeCompleto}
                                                placeholderTextColor="#A9A9A9"
                                                onChangeText={(text) => {
                                                    atualizarProprietario(index, 'nomeCompleto', text);
                                                }}
                                                onBlur={() => {
                                                    const cleaned = (p.nomeCompleto || '').trim().replace(/\s+/g, ' ');
                                                    atualizarProprietario(index, 'nomeCompleto', cleaned);

                                                    const palavras = cleaned.split(' ');
                                                    if (palavras.length < 2) {
                                                        atualizarProprietario(index, 'erroNome', 'Informe o nome completo');
                                                    } else {
                                                        atualizarProprietario(index, 'erroNome', '');
                                                    }
                                                }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>

                                    {typeof p.erroNome === 'string' && p.erroNome.trim() !== '' && (
                                        <Text style={styles.errorText} allowFontScaling={false}>
                                            {p.erroNome}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>CPF</Text>
                                    <MaskInput
                                        ref={(ref) => (cpfRef.current[index] = ref)}
                                        style={styles.areaInput}
                                        value={p.cpf_contratante}
                                        onChangeText={(text) => atualizarProprietario(index, 'cpf_contratante', text)}
                                        mask={Masks.BRL_CPF}
                                        placeholder="000.000.000-00"
                                        placeholderTextColor="#A9A9A9"
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>RG</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.rg_number}
                                        onChangeText={(text) => atualizarProprietario(index, 'rg_number', text)}
                                        placeholder="1234567"
                                        keyboardType="numeric"
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Órgão Emissor (SSP/UF)</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.ssp_rg}
                                        onChangeText={(text) => atualizarProprietario(index, 'ssp_rg', text)}
                                        placeholder="SSP-DF"
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Nacionalidade</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.nacionalidade}
                                        onChangeText={(text) => atualizarProprietario(index, 'nacionalidade', text)}
                                        placeholder="brasileiro(a), etc"
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Telefone</Text>
                                    <MaskInput
                                        style={styles.areaInput}
                                        value={p.tel_contratante}
                                        onChangeText={(text) => atualizarProprietario(index, 'tel_contratante', text)}
                                        mask={Masks.BRL_PHONE}
                                        placeholder="(00) 00000-0000"
                                        placeholderTextColor="#A9A9A9"
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Estado Civil</Text>
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            const updated = [...proprietarios];
                                            updated[index].showEstadoCivilOptions = !updated[index].showEstadoCivilOptions;
                                            setProprietarios(updated);
                                        }}
                                    >
                                        <View style={[styles.areaInput, { justifyContent: 'center' }]}>
                                            <Text style={{ color: '#1F2024' }}>
                                                {p.estado_civil ? p.estado_civil : 'Selecionar'}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>



                                    {p.showEstadoCivilOptions && (
                                        <View style={styles.optionsContainer}>
                                            {['solteiro', 'casado', 'divorciado', 'viúvo'].map((option) => (
                                                <TouchableOpacity
                                                    key={option}
                                                    style={styles.optionItem}
                                                    onPress={() => {
                                                        const updated = [...proprietarios];
                                                        updated[index].estado_civil = option;
                                                        updated[index].showEstadoCivilOptions = false;
                                                        setProprietarios(updated);
                                                    }}
                                                >
                                                    <Text style={styles.optionText}>{option}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                {p.estado_civil.toLowerCase() === 'casado' && (
                                    <>
                                        <View style={styles.row}>
                                            <Text style={styles.subLabel}>Nome do cônjuge</Text>
                                            <TextInput
                                                style={styles.areaInput}
                                                value={p.nome_conjuge}
                                                onChangeText={(text) => atualizarProprietario(index, 'nome_conjuge', text)}
                                                placeholder="Nome completo"
                                                placeholderTextColor="#A9A9A9"
                                            />
                                        </View>

                                        <View style={styles.row}>
                                            <Text style={styles.subLabel}>Nacionalidade do cônjuge</Text>
                                            <TextInput
                                                style={styles.areaInput}
                                                value={p.nacionalidade_conjuge}
                                                onChangeText={(text) => atualizarProprietario(index, 'nacionalidade_conjuge', text)}
                                                placeholder="brasileira, etc"
                                                placeholderTextColor="#A9A9A9"
                                            />
                                        </View>

                                        <View style={styles.row}>
                                            <Text style={styles.subLabel}>RG do cônjuge</Text>
                                            <TextInput
                                                style={styles.areaInput}
                                                value={p.rg_conjuge}
                                                onChangeText={(text) => atualizarProprietario(index, 'rg_conjuge', text)}
                                                placeholder="1234567"
                                                placeholderTextColor="#A9A9A9"
                                            />
                                        </View>

                                        <View style={styles.row}>
                                            <Text style={styles.subLabel}>SSP do cônjuge</Text>
                                            <TextInput
                                                style={styles.areaInput}
                                                value={p.ssp_rg_conjuge}
                                                onChangeText={(text) => atualizarProprietario(index, 'ssp_rg_conjuge', text)}
                                                placeholder="SSP-DF"
                                                placeholderTextColor="#A9A9A9"
                                            />
                                        </View>

                                        <View style={styles.row}>
                                            <Text style={styles.subLabel}>CPF do cônjuge</Text>
                                            <MaskInput
                                                style={styles.areaInput}
                                                value={p.cpf_conjuge}
                                                onChangeText={(text) => atualizarProprietario(index, 'cpf_conjuge', text)}
                                                mask={Masks.BRL_CPF}
                                                placeholder="000.000.000-00"
                                                placeholderTextColor="#A9A9A9"
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </>
                                )}


                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>CEP</Text>
                                    <TextInput
                                        ref={(ref) => (cepRef.current[index] = ref)}
                                        style={styles.areaInput}
                                        value={p.cep_contratante}
                                        onChangeText={(text) => handleCepChange(text, index)}
                                        placeholder="00.000-000"
                                        placeholderTextColor="#A9A9A9"
                                        keyboardType="numeric"
                                        maxLength={9}
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Endereço</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.endereco_contratante}
                                        onChangeText={(text) => atualizarProprietario(index, 'endereco_contratante', text)}
                                        placeholder="Rua, Avenida..."
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Complemento</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.complemento_contratante}
                                        onChangeText={(text) => atualizarProprietario(index, 'complemento_contratante', text)}
                                        placeholder="Apto, Bloco..."
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Bairro</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.bairro_contratante}
                                        onChangeText={(text) => atualizarProprietario(index, 'bairro_contratante', text)}
                                        placeholder="Bairro"
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Cidade/UF</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.cidadeUf_contratante}
                                        onChangeText={(text) => atualizarProprietario(index, 'cidadeUf_contratante', text)}
                                        placeholder="Cidade/UF"
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>


                                {proprietarios.length > 1 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const novaLista = proprietarios.filter((_, i) => i !== index);
                                            setProprietarios(novaLista);
                                        }}
                                        style={{ alignSelf: 'flex-end', marginBottom: 10 }}
                                    >
                                        <Text style={{ color: 'red', fontWeight: 'bold' }}>Remover</Text>
                                    </TouchableOpacity>
                                )}
                                <View style={styles.divider} />
                            </View>
                        ))}

                        <TouchableOpacity style={styles.laterButton} onPress={adicionarProprietario}>
                            <Text style={styles.laterButtonText}>Incluir novo proponente</Text>
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

export default DadosVendedores;
