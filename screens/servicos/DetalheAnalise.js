import React, { useState, useRef, useEffect } from 'react';
import { Alert, View, Text, Linking, TouchableOpacity, TextInput, ScrollView, StatusBar, Dimensions, SafeAreaView, Platform, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Modal } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import { TextInputMask } from 'react-native-masked-text';
import { useLogScreen } from '../../useLogScreen';
import Svg, { Path, G, Rect, Mask, Ellipse, ClipPath } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path fillRule="evenodd" clipRule="evenodd" d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z" fill="#730d83" />
    </Svg>
);


const DetalheAnalise = ({ route, navigation }) => {
    useLogScreen('DetalheAnalise');
    const { id = null, usuario_id, status_user, emailUser } = route.params || {};
    console.log("user ID aqui:", usuario_id)
    console.log("Email User aqui:", emailUser)
    const [analiseData, setAnaliseData] = useState({}); // Estado para armazenar os dados do imóvel
    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
    const [proprietario, setProprietario] = useState([]); // Estado para armazenar o nome do proprietário
    const status = analiseData.status_analise;
    const isWeb = Platform.OS === 'web';

    const getStatusText = (status) => {
        switch (status) {
            case 'em_progresso':
                return 'Em Progresso';
            case 'concluida':
                return 'Concluída';
            case 'pendente':
                return 'Pendente';
            default:
                return status;
        }
    };

    const formatDate = () => {
        const data = analiseData.data_analise;
        if (data) {
            const [year, month, day] = data.split('-');
            return `${day}/${month}/${year}`;
        }
        return 'Data inválida';
    };

    useEffect(() => {
        // Chamada para buscar dados do imóvel pela API
        const fetchAnaliseData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://analise2.imogo.com.br/analises/${id}`);
                const data = response.data;
                setAnaliseData(data);

                if (response.status == 200) {
                    console.log("resposta da API: ", data)
                }
            } catch (error) {
                console.error('Erro ao buscar os dados da analise:', error);
            }

            try {
                const response = await axios.get(`https://analise2.imogo.com.br/analises/${id}/proprietarios`);
                const data = response.data[0];
                setProprietario(data);

                if (response.status == 200) {
                    console.log("resposta da API 3: ", data)
                }
            } catch (error) {
                console.error('Erro ao buscar os dados do prop:', error);
            } finally {
                setLoading(false);
            }

        };
        fetchAnaliseData();
    }, [id]);

    if (!analiseData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#730d83" />
            </View>
        );
    }



    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>Análise #{id}</Text>
            </View>

            {/* Linha de separação do header */}
            <View style={styles.headerLine} />
            <Text style={styles.classificacaoText} allowFontScaling={false}>
                Análise de certidões
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


                            {/* Inputs row */}
                            <View style={styles.areaRow}>
                                {/* Data de nascimento */}
                                <View style={styles.areaColumn}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Endereço do imóvel: {analiseData.endereco}</Text>

                                </View>


                                {/* Telefone */}
                                <View style={styles.areaColumn}>
                                    <Text style={[styles.subLabel, styles.cardStatus(status)]} allowFontScaling={false}>Status: {getStatusText(analiseData.status_analise)}</Text>

                                </View>
                            </View>

                            <View style={styles.areaRow}>
                                {/* Telefone */}
                                <View style={styles.areaColumn}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Matrícula & Cartorio: {analiseData.matricula} do {analiseData.cartorio}° Oficio</Text>

                                </View>

                                {/* Data de nascimento */}
                                <View style={styles.areaColumn}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Inscrição do IPTU: {analiseData.inscricao_iptu}</Text>

                                </View>
                            </View>

                            {/* Nome Completo */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Nome Completo:  {proprietario.nome_completo} </Text>

                            </View>

                            {/* Separador visual (Divisão) */}
                            <View style={styles.divider} />

                            {/* Valor de venda do imóvel */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Data da solicitação: {formatDate()}</Text>

                            </View>

                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Resumo: {'\n'} "{analiseData.resumo}"</Text>
                            </View>

                            {/* Botões de ação */}
                            {analiseData.link_doc && (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.laterButton}>
                                        <Image
                                            source={require('../../assets/icons/download.png')} // Ícone de terminar mais tarde
                                            style={styles.laterIcon}
                                        />
                                        <Text style={styles.laterButtonText} allowFontScaling={false}
                                            onPress={() => Linking.openURL(analiseData.link_doc)}
                                        >Baixar Analise</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            {/* Modal de carregamento */}
            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5f5f5' }}>
                    <ActivityIndicator size="large" color="#730d83" />
                </View>
            </Modal>
        </SafeAreaView >
    );
};

const styles = {

    cardStatus: (status) => ({
        fontWeight: 'bold',
        color: status === 'concluida' ? '#2E7D32' : status === 'em_progresso' ? '#F9A825' : '#C62828',
    }),

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
    // safeArea: {
    //   flex: 1,
    //   backgroundColor: '#F5F5F5',
    //   paddingTop: Platform.select({
    //     ios: StatusBar.currentHeight + 10,
    //     android: StatusBar.currentHeight + 10,
    //     web: 20,  // Adiciona padding extra para a versão web
    //   }),
    // },
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
};

export default DetalheAnalise;