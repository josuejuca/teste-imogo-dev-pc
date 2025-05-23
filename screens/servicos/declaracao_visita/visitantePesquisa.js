import React, { useState, useRef } from 'react';
import { Alert, View, Text, TouchableOpacity, TextInput, ScrollView, StatusBar, Dimensions, SafeAreaView, Platform, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Modal } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import { TextInputMask } from 'react-native-masked-text';
import Svg, { Path, G, Rect, Mask, Ellipse, ClipPath } from 'react-native-svg';
import MaskInput, { Masks } from 'react-native-mask-input'; // Para aplicar máscara no CPF
import DescricaoModal from '../../modal/DescricaoModal';
import NaoGostouModal from '../../modal/NaoGostouModal';
import GostouModal from '../../modal/OqueGostouModal';
import { useLogScreen } from '../../../useLogScreen';
const { width, height } = Dimensions.get('window');
import { FontAwesome } from '@expo/vector-icons'; // Certifique-se de ter instalado


const starSize = width < 400 ? 28 : 32; // Responsivo

// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path fillRule="evenodd" clipRule="evenodd" d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z" fill="#730d83" />
    </Svg>
);

const icons = {

    Não: {
        default: require('../../../assets/icons/close.png'),
        selected: require('../../../assets/icons/close_white.png'),
    },
    Sim: {
        default: require('../../../assets/icons/check.png'),
        selected: require('../../../assets/icons/check_white.png'),
    }
};

const visitantePesquisa = ({ route, navigation }) => {
    useLogScreen('visitantePesquisa');
    const { usuario_id, email_solicitante, endereco_imovel, nome_corretor, creci_corretor, isImob, name_imob, number_creci } = route.params || {};

    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento

    const [isSubmitting, setIsSubmitting] = useState(false);


    const [nomeCompleto, setNomeCompleto] = useState(''); // OK 
    const [cpf, setCpf] = useState(''); // OK
    const [email, setEmail] = useState(''); // OK
    const [tel, setTel] = useState(''); // OK
    const [erroNome, setErroNome] = useState('');

    const [oQueGostou, setOqueGostou] = useState('');  // Estado para a descrição
    const [oQueNaoGostou, setOqueNaoGostou] = useState('');  // Estado para a descrição
    const [compraria, setCompraria] = useState('');  // Estado para a descrição

    const [precoNPS, setprecoNPS] = useState('');  // Estado para a descrição
    const [areasNPS, setareasNPS] = useState('');  // Estado para a descrição
    const [estadoNPS, setestadoNPS] = useState('');  // Estado para a descrição
    const [qualidadeNPS, setqualidadeNPS] = useState('');  // Estado para a descrição
    const [plantaNPS, setplantaNPS] = useState('');  // Estado para a descrição
    const [tamanhoNPS, settamanhoNPS] = useState('');  // Estado para a descrição
    const [localizacaoNPS, setlocalizacaoNPS] = useState('');  // Estado para a descrição

    // ref useRef(null);
    const nomeCompletoRef = useRef(null);

    const cpfRef = useRef(null);
    const telRef = useRef(null);
    const emailRef = useRef(null);
    // Controle de exibição das listas de opções

    const [isModalVisibleNaoGostouModal, setIsModalVisibleNaoGostouModal] = useState(false);

    const toggleModalNaoGostouModal = () => {
        setIsModalVisibleNaoGostouModal(!isModalVisibleNaoGostouModal);
    };
    const [isModalVisibleGostouModal, setIsModalVisibleGostouModal] = useState(false);

    const toggleModalGostouModal = () => {
        setIsModalVisibleGostouModal(!isModalVisibleGostouModal);
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const isFormValid = () => {
        const nomeValido = nomeCompleto.trim().split(' ').length >= 2;
        return (
            nomeValido &&
            cpf &&
            oQueGostou &&
            oQueNaoGostou &&
            compraria &&
            precoNPS &&
            areasNPS &&
            estadoNPS &&
            qualidadeNPS &&
            plantaNPS &&
            tamanhoNPS &&
            localizacaoNPS
        );
    };
    // Função para enviar os dados do imóvel para a API

    // const handleSaveImovel = async () => {
    //     if (!isFormValid()) {
    //         Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
    //         return;
    //     }

    //     if (isSubmitting) return; // Impede múltiplos envios

    //     setIsSubmitting(true); // Desativa o botão
    //     setLoading(true);

    //     const formatarNumero = (valor) => Number(valor.replace(/[R$\.\s]/g, '').replace(',', '.'));

    //     try {
    //         const payload = {
    //             "vendedor": nomeCompleto,
    //             "cpf_mask": cpf,
    //             "razao_corretor": nomeRazao,
    //             "cnpj_mask_corretor": cnpj,
    //             "creci_corretor": creci,
    //             "cartorio_number": cartorio,
    //             "mat_number": mat,
    //             "valor": formatarNumero(valorVendaImovel),
    //             "corretagem_number": corretagem,
    //             "pendencia": naoGravame,
    //             "pendencia_texto": descricao,
    //             "tipo_template": compraria === "Imobiliária" ? "autorizacao_imobiliaria" : "autorizacao_corretor"
    //         };

    //         console.log("payload:", payload)

    //         const response = await axios.post('https://docx.imogo.com.br/gerar-pdf/autorizacao', payload);

    //         if (response.status === 200) {
    //             const { pdf_name } = response.data;

    //             if (!pdf_name) {
    //                 throw new Error("pdf_name não encontrado na resposta da API");
    //             }

    //             const docx_name = pdf_name.replace(".pdf", ".docx");

    //             const imprimir_link_pdf = `https://docx.imogo.com.br/download/${pdf_name}`;
    //             const imprimir_link_docx = `https://docx.imogo.com.br/download/${docx_name}`;

    //             const payload_email = {
    //                 email: emailUser,
    //                 tipo_doc: "AUTORIZAÇÃO DE VENDA",
    //                 nome_cliente: nomeCompleto,
    //                 link_word: imprimir_link_docx,
    //                 link_pdf: imprimir_link_pdf
    //             };

    //             const response_email = await axios.post(
    //                 "https://smtp.josuejuca.com/imogo/emails/gerador-de-documentos",
    //                 payload_email
    //             );

    //             if (response_email.status === 200) {
    //                 navigation.navigate("BaixarDocumento", { usuario_id, emailUser, pdf_name, docx_name });
    //             }
    //         } else {
    //             console.log(response.data);
    //             Alert.alert("Erro", "Ocorreu um erro ao fazer o documento");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         Alert.alert('Erro', 'Não foi possível fazer o documento');
    //     } finally {
    //         setIsSubmitting(false); // Reativa o botão
    //         setLoading(false);
    //     }
    // };

    const handleSaveImovel = async () => {
        console.log("Entrou no handleSaveImovel")

        if (!isFormValid()) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
            return;
        }

        if (isSubmitting) return; // Impede múltiplos envios

        setIsSubmitting(true); // Desativa o botão
        setLoading(true);
        try {

            const payload = {
                "endereco_imovel": endereco_imovel,
                "visitantes": [
                    {
                        "nome": nomeCompleto,
                        "cpf": cpf,
                        "email": email,
                        "tel": tel
                    }
                ],
                "nome_corretor": nome_corretor,
                "creci_corretor": creci_corretor,
                "isImob": isImob,
                "name_imob": name_imob,
                "number_creci": number_creci,
                "avaliacao_nps": {
                    "Localização": localizacaoNPS,
                    "Tamanho": tamanhoNPS,
                    "Planta (disposição dos cômodos)": plantaNPS,
                    "Qualidade / Acabamentos": qualidadeNPS,
                    "Estado de Conservação": estadoNPS,
                    "Áreas comuns": areasNPS,
                    "Preço": precoNPS
                },
                "avaliacao_pesquisa": {
                    "mais_gostou": oQueGostou,
                    "menos_gostou": oQueNaoGostou,
                    "compraria": compraria
                }
            }

            console.log("payload:", payload)

            const response = await axios.post('https://docx.imogo.com.br/gerar-pdf/declaracao-visita', payload);

            if (response.status === 200) {
                const { pdf_name } = response.data;

                if (!pdf_name) {
                    throw new Error("pdf_name não encontrado na resposta da API");
                }

                const docx_name = pdf_name.replace(".pdf", ".docx");

                const imprimir_link_pdf = `https://docx.imogo.com.br/download/${pdf_name}`;
                const imprimir_link_docx = `https://docx.imogo.com.br/download/${docx_name}`;

                navigation.navigate("docAssinatura", { usuario_id, email_solicitante, pdf_name, docx_name, imprimir_link_pdf, imprimir_link_docx, nomeCompleto, cpf, email, tel });
                
                // const payload_email = {
                //     email: email_solicitante,
                //     tipo_doc: "DECLARAÇÃO DE VISITA",
                //     nome_cliente: nomeCompleto,
                //     link_word: imprimir_link_docx,
                //     link_pdf: imprimir_link_pdf
                // };

                // const response_email = await axios.post(
                //     "https://smtp.josuejuca.com/imogo/emails/gerador-de-documentos",
                //     payload_email
                // );

                // if (response_email.status === 200) {
                //     navigation.navigate("docAssinatura", { usuario_id, email_solicitante, pdf_name, docx_name, imprimir_link_pdf, imprimir_link_docx, nomeCompleto, cpf, email, tel });
                // }
                
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


    const selectOptions = (option) => {
        setCompraria(option)
        setShowOptions(false);
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>Avaliação de Experiência do Cliente</Text>
            </View>

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
                                <Text style={styles.subLabel} allowFontScaling={false}>Nome do visitante*</Text>
                                <TouchableWithoutFeedback onPress={() => nomeCompletoRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={nomeCompletoRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Nome e Sobrenome"
                                            value={nomeCompleto}
                                            placeholderTextColor="#A9A9A9"
                                            onChangeText={(text) => {
                                                setNomeCompleto(text); // permite digitar com espaços normalmente
                                            }}
                                            onBlur={() => {
                                                const cleaned = nomeCompleto.trim().replace(/\s+/g, ' ');
                                                setNomeCompleto(cleaned);

                                                const palavras = cleaned.split(' ');
                                                if (palavras.length < 2) {
                                                    setErroNome('Informe o nome completo');
                                                } else {
                                                    setErroNome('');
                                                }
                                            }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                                {erroNome !== '' && (
                                    <Text style={styles.errorText} allowFontScaling={false}>{erroNome}</Text>
                                )}
                            </View>
                            {/* CPF */}

                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>CPF do visitante*</Text>
                                <TouchableWithoutFeedback onPress={() => cpfRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <MaskInput
                                            ref={cpfRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            value={cpf}
                                            onChangeText={setCpf}
                                            mask={Masks.BRL_CPF}
                                            placeholderTextColor="#A9A9A9"
                                            keyboardType="numeric"
                                            placeholder="CPF"
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Telefone do visitante*</Text>
                                <TouchableWithoutFeedback onPress={() => telRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <MaskInput
                                            ref={telRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            value={tel}
                                            onChangeText={setTel}
                                            mask={Masks.BRL_PHONE}
                                            placeholderTextColor="#A9A9A9"
                                            keyboardType="numeric"
                                            placeholder="Telefone"
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>E-mail do visitante*</Text>
                                <TouchableWithoutFeedback onPress={() => emailRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <MaskInput
                                            ref={emailRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            value={email}
                                            onChangeText={setEmail}
                                            placeholderTextColor="#A9A9A9"
                                            keyboardType="email-address"
                                            placeholder="E-mail"
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Separador visual (Divisão) */}
                            <View style={styles.divider} />

                            <Text style={styles.classificacaoText} allowFontScaling={false}>
                                O que você achou do imóvel?
                            </Text>

                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Localização</Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity key={star} onPress={() => setlocalizacaoNPS(star)}>
                                            <FontAwesome
                                                name={star <= localizacaoNPS ? 'star' : 'star-o'}
                                                size={starSize}
                                                color="#f1c40f"
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Tamanho</Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity key={star} onPress={() => settamanhoNPS(star)}>
                                            <FontAwesome
                                                name={star <= tamanhoNPS ? 'star' : 'star-o'}
                                                size={starSize}
                                                color="#f1c40f"
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Planta (disposição dos cômodos)</Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity key={star} onPress={() => setplantaNPS(star)}>
                                            <FontAwesome
                                                name={star <= plantaNPS ? 'star' : 'star-o'}
                                                size={starSize}
                                                color="#f1c40f"
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Qualidade / Acabamentos </Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity key={star} onPress={() => setqualidadeNPS(star)}>
                                            <FontAwesome
                                                name={star <= qualidadeNPS ? 'star' : 'star-o'}
                                                size={starSize}
                                                color="#f1c40f"
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Estado de Conservação  </Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity key={star} onPress={() => setestadoNPS(star)}>
                                            <FontAwesome
                                                name={star <= estadoNPS ? 'star' : 'star-o'}
                                                size={starSize}
                                                color="#f1c40f"
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Áreas comuns  </Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity key={star} onPress={() => setareasNPS(star)}>
                                            <FontAwesome
                                                name={star <= areasNPS ? 'star' : 'star-o'}
                                                size={starSize}
                                                color="#f1c40f"
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Preço  </Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity key={star} onPress={() => setprecoNPS(star)}>
                                            <FontAwesome
                                                name={star <= precoNPS ? 'star' : 'star-o'}
                                                size={starSize}
                                                color="#f1c40f"
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>


                            <View style={[styles.row, styles.mt_10]}>
                                <Text style={styles.subLabel} allowFontScaling={false}>O que mais gostou?  </Text>
                                <TouchableOpacity style={styles.descriptionBox} onPress={toggleModalGostouModal}>
                                    <Text style={[styles.descriptionText, oQueGostou ? styles.descriptionFilled : styles.placeholderText]} allowFontScaling={false}>
                                        {truncateText(oQueGostou, 30)}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={styles.helperText} allowFontScaling={false}>
                                    Descreva aqui da melhor forma possível o que você mais gostou no imóvel.
                                </Text>
                            </View>

                            {/* Modal de Descrição */}
                            <GostouModal
                                isVisible={isModalVisibleGostouModal}
                                toggleModal={toggleModalGostouModal}
                                descricao={oQueGostou}
                                setDescricao={setOqueGostou}
                            />
                            <View style={[styles.row, styles.mt_10]}>
                                <Text style={styles.subLabel} allowFontScaling={false}>O que menos gostou?  </Text>
                                <TouchableOpacity style={styles.descriptionBox} onPress={toggleModalNaoGostouModal}>
                                    <Text style={[styles.descriptionText, oQueNaoGostou ? styles.descriptionFilled : styles.placeholderText]} allowFontScaling={false}>
                                        {truncateText(oQueNaoGostou, 30)}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={styles.helperText} allowFontScaling={false}>
                                    Descreva aqui da melhor forma possível o que você menos gostou no imóvel.
                                </Text>
                            </View>

                            {/* Modal de Descrição */}
                            <NaoGostouModal
                                isVisible={isModalVisibleNaoGostouModal}
                                toggleModal={toggleModalNaoGostouModal}
                                descricao={oQueNaoGostou}
                                setDescricao={setOqueNaoGostou}
                            />

                            <View style={styles.row}>
                                <Text style={[styles.subLabel, styles.orientacaoText]} allowFontScaling={false}>Você compraria este imóvel?</Text>
                                <View style={styles.orientationGroup}>
                                    {['Sim', 'Não'].map((opcao) => (
                                        <TouchableOpacity
                                            key={opcao}
                                            style={[styles.orientationButton, compraria === opcao && styles.selectedOptionOrientation]}
                                            onPress={() => setCompraria(compraria === opcao ? '' : opcao)} // Desmarca se já estiver selecionado
                                        >
                                            <Image
                                                source={compraria === opcao ? icons[opcao].selected : icons[opcao].default}
                                                style={{ width: 30, height: 30, marginBottom: 5 }}
                                            />
                                            <Text style={[styles.optionText, compraria === opcao && styles.selectedOptionText]} allowFontScaling={false}>
                                                {opcao}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
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
                                        source={require('../../../assets/icons/home.png')} // Ícone de terminar mais tarde
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
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 30,
    },


    // nps 

    npsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    npsButton: {
        padding: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ccc',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },

    npsButtonSelected: {
        backgroundColor: '#730d83', // cor de destaque
        borderColor: '#730d83',
    },

    npsText: {
        fontSize: 16,
        color: '#000',
    },

    npsTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
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
        fontSize: width * 0.030,
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: width * 0.050,
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
        color: '#1F2024',
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
        color: '#1F2024',
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

export default visitantePesquisa;
