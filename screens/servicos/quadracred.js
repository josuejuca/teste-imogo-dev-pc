import React, { useState, useRef } from 'react';
import { Alert, View, Text, TouchableOpacity, TextInput, ScrollView, StatusBar, Dimensions, SafeAreaView, Platform, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Modal } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import { TextInputMask } from 'react-native-masked-text';
import Svg, { Path, G, Rect, Mask, Ellipse, ClipPath } from 'react-native-svg';
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

const QuadraCred = ({ route, navigation }) => {
    useLogScreen('LaudoQuadraCred');
    const { id = null, status = 1, usuario_id, status_user, emailUser } = route.params || {};
    console.log("user ID aqui:", usuario_id)
    console.log("Email User aqui:", emailUser)

    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [phone, setPhone] = useState('');
    const phoneInputRef = useRef(null);

    const handlePhoneChange = (text) => {
        const numericPhone = text.replace(/\D/g, '');
        if (numericPhone.length <= 11) {
            setPhone(text);
        }
    };

    const isFormValid = () => valorVendaImovel && nomeCompleto && dataNascimento && phone && valorFinanciamentoImovel && rendaBruta && rendaLiq && prazo;
    // Função para enviar os dados do imóvel para a API

    const handleSaveImovel = async () => {
        if (!isFormValid()) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
            return;
        }

        if (isSubmitting) return; // Impede múltiplos envios

        setIsSubmitting(true); // Desativa o botão
        setLoading(true);

        try {
            const payload = {
                nome: nomeCompleto,
                data_nascimento: dataNascimento,
                telefone: phone,
                email: emailUser,
                valor_imovel: valorVendaImovel.replace(/[^\d]/g, '').slice(0, -2),
                valor_afinanciar: valorFinanciamentoImovel.replace(/[^\d]/g, '').slice(0, -2),
                valor_renda_bruta: rendaBruta.replace(/[^\d]/g, '').slice(0, -2),
                valor_renda_liquida: rendaLiq.replace(/[^\d]/g, '').slice(0, -2),
                valor_fgts: valorFGTS.replace(/[^\d]/g, '').slice(0, -2) || '0',
                qtd_parcelas: prazo.toString(),
            };

            const response = await axios.post('https://api.imogo.com.br/submit_simulation', payload);

            if (response.status === 200) {
                const { imprimir_link } = response.data;
                navigation.navigate('BaixarSimulacao', { usuario_id, emailUser, imprimir_link });
            } else {
                console.log(response.data);
                Alert.alert('Erro', 'Ocorreu um erro ao fazer a simulação');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível fazer a simulação');
        } finally {
            setIsSubmitting(false); // Reativa o botão
            setLoading(false);
        }
    };

    const [valorVendaImovel, setValorVendaImovel] = useState('');
    const [rendaBruta, setRendaBruta] = useState('');
    const [rendaLiq, setRendaLiq] = useState('');
    const [prazo, setPrazo] = useState('');
    const [valorFinanciamentoImovel, setValorFinanciamentoImovel] = useState('');
    const [valorEntradaImovel, setValorEntradaImovel] = useState('');
    const [valorCondominio, setValorCondominio] = useState('');
    const [valorFGTS, setValorFGTS] = useState('');
    const [naoPossuiCondominio, setNaoPossuiCondominio] = useState(false);

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [dataNascimento, setdataNascimento] = useState('');

    const [errorMessage, setErrorMessage] = React.useState(''); // Estado para mensagem de erro

    const handleDateChange = (text) => {
        setdataNascimento(text);

        if (text.length === 10) { // Verifica se o formato da data está completo (DD/MM/YYYY)
            const [day, month, year] = text.split('/').map(Number); // Extrai dia, mês e ano
            const birthDate = new Date(year, month - 1, day); // Cria o objeto Date
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const isBirthdayPassed =
                today.getMonth() > birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

            if (age < 18 || (age === 18 && !isBirthdayPassed)) {
                setErrorMessage('Você precisa ter +18 anos');
            } else {
                setErrorMessage(''); // Limpa a mensagem de erro se a idade for válida
            }
        } else {
            setErrorMessage(''); // Limpa a mensagem de erro enquanto a data está incompleta
        }
    };

    const toggleNaoPossuiCondominio = () => {
        setNaoPossuiCondominio(!naoPossuiCondominio);
        if (!naoPossuiCondominio) {
            setValorFGTS(''); // Define o valor como 0 quando marcado
        } else {
            setValorFGTS(''); // Limpa o valor se desmarcado
        }
    };

    // ref useRef(null);
    const nomeCompletoRef = useRef(null);
    const dataNascimentoRef = useRef(null);


    const isWeb = Platform.OS === 'web';



    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
                backgroundColor="#730d83"
                translucent
            />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>Simulador</Text>
            </View>

            <Text style={styles.classificacaoText} allowFontScaling={false}>
                Simulador de crédito imobiliário
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
                                <Text style={styles.subLabel} allowFontScaling={false}>Nome Completo *</Text>
                                <TouchableWithoutFeedback onPress={() => nomeCompletoRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={nomeCompletoRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Nome Completo"
                                            value={nomeCompleto}
                                            placeholderTextColor="#A9A9A9"
                                            onChangeText={setNomeCompleto}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Inputs row */}
                            <View style={styles.areaRow}>
                                {/* Data de nascimento */}
                                <View style={styles.areaColumn}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Data de nascimento *</Text>
                                    <TouchableWithoutFeedback onPress={() => dataNascimentoRef.current.focus()}>
                                        <View>
                                            <TextInputMask
                                                type={'datetime'}
                                                options={{
                                                    format: 'DD/MM/YYYY'
                                                }}
                                                ref={dataNascimentoRef}
                                                style={[styles.areaInput, { zIndex: 1 }]}
                                                placeholder="00/00/0000"
                                                value={dataNascimento}
                                                onChangeText={handleDateChange} // Validação adicionada
                                                placeholderTextColor="#A9A9A9"
                                                returnKeyType="next"
                                                onSubmitEditing={() => dataNascimentoRef.current.focus()}
                                                blurOnSubmit={false}
                                                keyboardType="numeric"
                                                pointerEvents="auto"
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                    {errorMessage ? (
                                        <Text style={styles.errorText}>{errorMessage}</Text> // Exibe a mensagem de erro
                                    ) : null}
                                </View>


                                {/* Telefone */}
                                <View style={styles.areaColumn}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Telefone *</Text>
                                    <TouchableWithoutFeedback onPress={() => phoneInputRef.current.focus()}>
                                        <View>
                                            <TextInputMask
                                                ref={phoneInputRef}
                                                type={'cel-phone'}
                                                options={{
                                                    maskType: 'BRL',
                                                    withDDD: true,
                                                    dddMask: '(99) 9 9999-9999',
                                                }}
                                                style={[styles.areaInput, { zIndex: 1 }]}
                                                placeholder="(00) 0 0000-0000"
                                                value={phone}
                                                onChangeText={handlePhoneChange}
                                                keyboardType="phone-pad"
                                                returnKeyType="done"
                                                placeholderTextColor="#A9A9A9"
                                                maxLength={16}
                                                onSubmitEditing={() => Keyboard.dismiss()}
                                                allowFontScaling={false}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>

                            {/* Separador visual (Divisão) */}
                            <View style={styles.divider} />

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
                            {/* Valor que deseja financiar: */}
                            <View style={styles.areaRow}>
                                {/* Área Privativa */}
                                <View style={styles.areaColumn}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Valor que deseja financiar *</Text>
                                    <TouchableWithoutFeedback onPress={() => { }}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.areaInput}
                                                placeholder="R$"
                                                value={valorFinanciamentoImovel}
                                                onChangeText={(text) => {
                                                    const numericValue = parseFloat(text.replace(/[^\d]/g, '')) || 0; // Converte para número
                                                    const maxValue = parseFloat(valorVendaImovel.replace(/[^\d]/g, '')) * 0.8 || 0; // 80% do valorVendaImovel

                                                    if (numericValue <= maxValue) {
                                                        setValorFinanciamentoImovel(formatCurrency(text));
                                                    } else {
                                                        alert(`O valor máximo permitido é ${formatCurrency(maxValue.toString())}`);
                                                    }
                                                }}
                                                keyboardType="numeric"
                                                allowFontScaling={false}
                                                placeholderTextColor="#A9A9A9"
                                                pointerEvents="auto"
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>

                                {/* Prazo */}
                                <View style={styles.areaColumn}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Prazo *</Text>
                                    <TouchableWithoutFeedback onPress={() => { }}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.areaInput}
                                                placeholder="420x"
                                                value={prazo}
                                                onChangeText={(text) => {
                                                    // Remove caracteres não numéricos
                                                    const numericValue = text.replace(/[^0-9]/g, '');
                                                    // Limita o valor entre 0 e 420
                                                    const limitedValue = Math.min(Math.max(parseInt(numericValue || '0', 10), 0), 420);
                                                    setPrazo(String(limitedValue));
                                                }}
                                                keyboardType="numeric"
                                                allowFontScaling={false}
                                                placeholderTextColor="#A9A9A9"
                                                pointerEvents="auto"
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                            {/* Inputs de Área */}
                            <View style={styles.areaRow}>
                                {/* Área Privativa */}
                                <View style={styles.areaColumn}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Valor da entrada</Text>
                                    <TouchableWithoutFeedback onPress={() => { }}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.areaInput}
                                                placeholder="R$"
                                                value={
                                                    valorVendaImovel && valorFinanciamentoImovel
                                                        ? `${new Intl.NumberFormat('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL',
                                                        }).format(
                                                            (parseFloat(valorVendaImovel.replace(/[^\d]/g, '')) / 100 || 0) -
                                                            (parseFloat(valorFinanciamentoImovel.replace(/[^\d]/g, '')) / 100 || 0)
                                                        )}`
                                                        : '' // Exibe vazio se qualquer campo estiver incompleto
                                                }
                                                keyboardType="numeric"
                                                allowFontScaling={false}
                                                placeholderTextColor="#A9A9A9"
                                                pointerEvents="none" // Desativa interações com o campo
                                                editable={false} // Torna o campo não editável
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>

                                {/* Prazo */}
                                <View style={styles.areaColumn}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Valor do FGTS *</Text>
                                    <TouchableWithoutFeedback onPress={() => { }}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.areaInput}
                                                placeholder="R$"
                                                value={valorFGTS}
                                                onChangeText={(text) => setValorFGTS(formatCurrency(text))}
                                                keyboardType="numeric"
                                                allowFontScaling={false}
                                                editable={!naoPossuiCondominio}
                                                placeholderTextColor="#A9A9A9"
                                                pointerEvents="auto"
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>

                            {/* Separador visual (Divisão) */}
                            <View style={styles.divider} />
                            {/* Inputs de Área */}
                            <View style={[styles.areaRow, styles.mt_10]}>
                                {/* Área Privativa */}
                                <View style={styles.areaColumn}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Renda Bruta *</Text>
                                    <TouchableWithoutFeedback onPress={() => { }}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.areaInput}
                                                placeholder="R$"
                                                value={rendaBruta}
                                                onChangeText={(text) => setRendaBruta(formatCurrency(text))}
                                                keyboardType="numeric"
                                                allowFontScaling={false}
                                                placeholderTextColor="#A9A9A9"
                                                pointerEvents="auto"
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>

                                {/* Área Total */}
                                <View style={styles.areaColumn}>
                                    <Text style={styles.subLabel} allowFontScaling={false}>Renda Líquida *</Text>
                                    <TouchableWithoutFeedback onPress={() => { }}>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.areaInput}
                                                placeholder="R$"
                                                value={rendaLiq}
                                                onChangeText={(text) => setRendaLiq(formatCurrency(text))}
                                                keyboardType="numeric"
                                                allowFontScaling={false}
                                                placeholderTextColor="#A9A9A9"
                                                pointerEvents="auto"
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>


                            {/* Valor do FGTS
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Valor do FGTS</Text>
                                <TouchableWithoutFeedback onPress={() => { }}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.areaInput}
                                            placeholder="R$"
                                            value={valorFGTS}
                                            onChangeText={(text) => setValorFGTS(formatCurrency(text))}
                                            keyboardType="numeric"
                                            allowFontScaling={false}
                                            editable={!naoPossuiCondominio}
                                            placeholderTextColor="#A9A9A9"
                                            pointerEvents="auto"
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View> */}
                            {/* Checkbox "Não possui condomínio" */}
                            {/* <View style={styles.checkboxRow}>
                                <Checkbox
                                    value={naoPossuiCondominio}
                                    onValueChange={toggleNaoPossuiCondominio}
                                    color={naoPossuiCondominio ? '#730d83' : undefined}
                                />
                                <Text style={styles.checkboxLabel} allowFontScaling={false}>Não possui FGTS</Text>
                            </View> */}

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
                                        {isSubmitting ? 'Enviando...' : 'Fazer Simulação'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.laterButton}>
                                    <Image
                                        source={require('../../assets/icons/bookmark.png')} // Ícone de terminar mais tarde
                                        style={styles.laterIcon}
                                    />
                                    <Text style={styles.laterButtonText} allowFontScaling={false}
                                        onPress={() => navigation.navigate('Home', { usuario_id })}
                                    >Terminar mais tarde</Text>
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
                    <Text style={styles.loadingText}>Gerando Simulação...</Text>
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
        textAlign: 'center',
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
        width: 15,
        height: 20,
        marginRight: 8,
    },
    laterButtonText: {
        color: '#730d83',
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.04 }), // Ajuste no tamanho da fonte
        fontWeight: '600',
    },
};

export default QuadraCred;