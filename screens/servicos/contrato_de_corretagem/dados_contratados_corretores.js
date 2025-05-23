import React, { useEffect, useState, useRef } from 'react';

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

const DadosContratados = ({ route, navigation }) => {
    useLogScreen('DadosContratados');
    const { usuario_id, email_solicitante, payload_prop, endereco_imovel } = route.params || {};
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [corretores, setCorretores] = useState([
        {
            nomeCompleto: '',
            cnpj_contratado: '',
            creci: '',
            participacao: '',
            tel_contratado: '',
            cep_contratado: '',
            endereco_contratado: '',
            complemento_contratado: '',
            bairro_contratado: '',
            cidadeUf_contratado: '',
        },
    ]);

    const nomeCompletoRef = useRef([]);
    const cnpjRef = useRef([]);
    const cepRef = useRef([]);

    const atualizarCorretor = (index, campo, valor) => {
        const novoscorretores = [...corretores];
        novoscorretores[index][campo] = valor;
        setCorretores(novoscorretores);
    };

    const adicionarCorretor = () => {
        setCorretores([
            ...corretores,
            {
                nomeCompleto: '',
                cnpj_contratado: '',
                creci: '',
                participacao: '',
                tel_contratado: '',
                cep_contratado: '',
                endereco_contratado: '',
                complemento_contratado: '',
                bairro_contratado: '',
                cidadeUf_contratado: '',
            },
        ]);
    };

    const handleCepChange = (text, index) => {
        const formattedCep = text.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
        atualizarCorretor(index, 'cep_contratado', formattedCep);
        if (formattedCep.length === 9) {
            atualizarEnderecoViaCep(formattedCep, index);
        }
    };

    const atualizarEnderecoViaCep = async (cep, index) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
            if (response.data) {
                const novoscorretores = [...corretores];
                const p = { ...novoscorretores[index] };

                // Atualiza com base no que foi retornado, mantendo campo editável
                p.endereco_contratado = response.data.logradouro || p.endereco_contratado;
                p.bairro_contratado = response.data.bairro || p.bairro_contratado;
                p.cidadeUf_contratado = `${response.data.localidade}/${response.data.uf}` || p.cidadeUf_contratado;

                novoscorretores[index] = p;
                setCorretores(novoscorretores);
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
        const totalParticipacao = corretores.reduce((sum, p) => sum + Number(p.participacao || 0), 0);
        const camposOk = corretores.every((p) =>
            p.nomeCompleto && p.cnpj_contratado && p.cep_contratado && p.creci && p.participacao
        );
        return camposOk && totalParticipacao === 100;
    };

    const handleSaveImovel = async () => {
        const totalParticipacao = corretores.reduce((sum, p) => sum + Number(p.participacao || 0), 0);

        if (corretores.length > 1 && totalParticipacao !== 100) {
            return corretores.reduce((total, p) => total + Number(p.participacao || 0), 0);
        }
        const corretoresFormatados = corretores.map((p) => {
            const [cidade, uf] = (p.cidadeUf_contratado || '').split('/');

            return {
                nome: p.nomeCompleto,
                cnpj: p.cnpj_contratado,
                endereco: `${p.endereco_contratado} ${p.complemento_contratado}`,
                telefone: p.tel_contratado,
                creci: p.creci,
                participacao: Number(p.participacao),
                cidade: cidade?.trim() || '',
                cep: p.cep_contratado,
                uf: uf?.trim() || '',
            };
        });

        const payloadCompleto = {
            ...payload_prop,
            corretores: corretoresFormatados
        };

        navigation.navigate('EtapasCorretagem', { status: 4, usuario_id, email_solicitante, payload_corretores: payloadCompleto  , endereco_imovel});

        console.log('Payload Final:', JSON.stringify(payloadCompleto, null, 2));
    };

    useEffect(() => {
        if (corretores.length === 1) {
            setCorretores([{ ...corretores[0], participacao: '100' }]);
        }
    }, [corretores.length]);

    const somaParticipacao = () => {
        return corretores.reduce((total, p) => total + Number(p.participacao || 0), 0);
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

            <Text style={styles.classificacaoText} allowFontScaling={false}>
                Dados do(s) contratado(s)
            </Text>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        {corretores.map((p, index) => (
                            <View key={index} style={styles.CorretorContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Nome ou Razão Social</Text>
                                    <TextInput
                                        ref={(ref) => (nomeCompletoRef.current[index] = ref)}
                                        style={styles.areaInput}
                                        placeholder="Nome ou Razão Social"
                                        value={p.nomeCompleto}
                                        onChangeText={(text) => atualizarCorretor(index, 'nomeCompleto', text)}
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>CNPJ</Text>
                                    <MaskInput
                                        ref={(ref) => (cnpjRef.current[index] = ref)}
                                        style={styles.areaInput}
                                        value={p.cnpj_contratado}
                                        onChangeText={(text) => atualizarCorretor(index, 'cnpj_contratado', text)}
                                        mask={Masks.BRL_CNPJ}
                                        placeholder="00.000.000/0000-00"
                                        placeholderTextColor="#A9A9A9"
                                        keyboardType="numeric"
                                    />
                                </View>

                                {/* Novo: CRECI */}
                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>CRECI</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.creci}
                                        onChangeText={(text) => atualizarCorretor(index, 'creci', text.replace(/\D/g, ''))}
                                        placeholder="Número do CRECI"
                                        placeholderTextColor="#A9A9A9"
                                        keyboardType="numeric"
                                        maxLength={10}
                                    />
                                </View>

                                {/* Novo: Participação */}
                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Participação (%)</Text>
                                    <TextInput
                                        style={[styles.areaInput, corretores.length === 1 && { backgroundColor: '#eee' }]}
                                        value={p.participacao}
                                        onChangeText={(text) => atualizarCorretor(index, 'participacao', text.replace(/\D/g, ''))}
                                        placeholder="Ex: 50"
                                        placeholderTextColor="#A9A9A9"
                                        keyboardType="numeric"
                                        maxLength={3}
                                        editable={corretores.length !== 1}
                                    />
                                    {corretores.length > 1 && index === corretores.length - 1 && (
                                        <Text
                                            style={{
                                                color: somaParticipacao() === 100 ? '#077755' : 'red',
                                                marginTop: 5,
                                                fontSize: 12,
                                            }}
                                        >
                                            Total de participação: {somaParticipacao()}% {somaParticipacao() !== 100 && '(precisa ser 100%)'}
                                        </Text>
                                    )}
                                </View>



                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Telefone</Text>
                                    <MaskInput
                                        style={styles.areaInput}
                                        value={p.tel_contratado}
                                        onChangeText={(text) => atualizarCorretor(index, 'tel_contratado', text)}
                                        mask={Masks.BRL_PHONE}
                                        placeholder="(00) 00000-0000"
                                        placeholderTextColor="#A9A9A9"
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>CEP</Text>
                                    <TextInput
                                        ref={(ref) => (cepRef.current[index] = ref)}
                                        style={styles.areaInput}
                                        value={p.cep_contratado}
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
                                        value={p.endereco_contratado}
                                        onChangeText={(text) => atualizarCorretor(index, 'endereco_contratado', text)}
                                        placeholder="Rua, Avenida..."
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Complemento</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.complemento_contratado}
                                        onChangeText={(text) => atualizarCorretor(index, 'complemento_contratado', text)}
                                        placeholder="Apto, Bloco..."
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Bairro</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.bairro_contratado}
                                        onChangeText={(text) => atualizarCorretor(index, 'bairro_contratado', text)}
                                        placeholder="Bairro"
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.subLabel}>Cidade/UF</Text>
                                    <TextInput
                                        style={styles.areaInput}
                                        value={p.cidadeUf_contratado}
                                        onChangeText={(text) => atualizarCorretor(index, 'cidadeUf_contratado', text)}
                                        placeholder="Cidade/UF"
                                        placeholderTextColor="#A9A9A9"
                                    />
                                </View>

                                <View style={styles.divider} />
                            </View>
                        ))}

                        <TouchableOpacity style={styles.laterButton} onPress={adicionarCorretor}>
                            <Text style={styles.laterButtonText}>Adicionar Pessoa</Text>
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

export default DadosContratados;
