import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    SafeAreaView,
    StatusBar,
    Linking,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { useLogScreen } from '../../../useLogScreen';
import axios from 'axios';
const { width, height } = Dimensions.get('window');

const DocAssinatura = ({ navigation, route }) => {
    useLogScreen('docAssinatura');

    const {
        usuario_id,
        email_solicitante,
        pdf_name,
        docx_name,
        imprimir_link_pdf,
        imprimir_link_docx,
        nomeCompleto,
        cpf,
        email,
        tel
    } = route.params || {};

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAssinarDoc = async () => {
        console.log("Entrou no handleSaveImovel")
        if (isSubmitting) return;
        setIsSubmitting(true);
        setLoading(true);

        function removerFormatacaoTelefone(telefone) {
            return telefone.replace(/\D/g, '');
        }

        const telSemFormatacao = removerFormatacaoTelefone(tel);

        try {

            const response = await axios.post('https://api.imogo.com.br/api/v1/zapsign/sandbox/criar-doc', {
                email_solicitante,
                usuario_id,
                telSemFormatacao,
                cpf,
                email,
                nomeCompleto,
                imprimir_link_pdf
            });

            const { sign_url } = response.data;

            navigation.navigate("webViewAssinatura", {
                usuario_id,
                url_assinar: sign_url
            });

        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível fazer o link de assinatura.');
        } finally {
            setIsSubmitting(false); // Reativa o botão
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.progressBarContainer}>
                <View style={styles.progressSegmentHalfFilled}>
                    <View style={styles.progressSegmentHalfFilledInner}></View>
                </View>
                <View style={styles.progressSegment}></View>
                <View style={styles.progressSegment}></View>
                <View style={styles.progressSegment}></View>
                <View style={styles.progressSegment}></View>
            </View>

            <Image
                source={require('../../../assets/img/stape7.png')}
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.title} allowFontScaling={false}>
                Documento criado com sucesso!
            </Text>
            <Text style={styles.description} allowFontScaling={false}>
                Seu documento foi gerado com sucesso. Clique no botão abaixo para assiná-lo.
            </Text>

            <TouchableOpacity style={styles.buttonSecondary} onPress={handleAssinarDoc}>
                <Text style={styles.buttonText} allowFontScaling={false}>
                    {isSubmitting ? 'Criando Link...' : 'Assinar Documento'}
                </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.buttonPrimary} onPress={() => Linking.openURL(imprimir_link_pdf)}>
                <Text style={styles.buttonText} allowFontScaling={false}>Baixar Documento</Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity
                style={styles.laterButton}
                onPress={() => navigation.navigate('Home', { usuario_id })}
            >
                <Image
                    source={require('../../../assets/icons/home.png')}
                    style={styles.laterIcon}
                />
                <Text style={styles.laterButtonText} allowFontScaling={false}>Concluir</Text>
            </TouchableOpacity> */}

            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.loadingText}>Criando Link de Assinatura...</Text>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

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

    buttonSecondary: {
        backgroundColor: '#730d83',
        paddingVertical: height * 0.02, // Padding vertical de 2% da altura da tela
        paddingHorizontal: width * 0.1, // Padding horizontal de 10% da largura da tela
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
        position: 'absolute', // Posiciona o botão como absoluto
        bottom: height * 0.15, // Ajuste da posição do botão em relação ao fundo da tela
    },

    buttonTextSecondary: {
        fontFamily: 'Nunito_700Bold',
        color: '#1F2024',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },

    // completar 

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

    // 
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        paddingHorizontal: width * 0.05,
        paddingTop: Platform.select({
            ios: height * 0.05,
            android: height * 0.05,
        }),
        alignItems: 'center',
    },
    progressBarContainer: {
        marginTop: Platform.select({
            ios: height * 0.02, // Espaço menor no iOS
            android: height * 0.015, // Espaço menor no Android
        }),
        margin: Platform.select({
            ios: height * 0.02, // Espaço menor no iOS
            android: height * 0.015, // Espaço menor no Android
        }),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.04, // Ajuste de margem inferior
    },
    progressSegment: {
        height: height * 0.008, // Ajuste da altura para a barra de progresso
        width: '20%',
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
    },
    progressSegmentFilled: {
        height: height * 0.008,
        width: '20%',
        backgroundColor: '#730d83',
        borderRadius: 4,
    },
    progressSegmentHalfFilled: {
        height: height * 0.008,
        width: '20%',
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressSegmentHalfFilledInner: {
        height: '100%',
        width: '50%',
        backgroundColor: '#730d83',
    },
    image: {
        width: width * 0.7, // Aumentado para 70% da largura da tela
        height: height * 0.4, // Aumentado para 40% da altura da tela
        marginBottom: height * 0.03, // Ajustei o espaço inferior para a imagem
    },
    title: {
        fontSize: Platform.select({
            ios: width * 0.045,
            android: width * 0.042,
        }),
        fontWeight: 'bold',
        color: '#1F2024',
        textAlign: 'center',
        marginBottom: height * 0.01, // Ajuste de margem inferior para o título
        marginHorizontal: width * 0.05, // Margem lateral para alinhar com a imagem
    },
    description: {
        fontSize: Platform.select({
            ios: width * 0.035,
            android: width * 0.035,
        }),
        color: '#2F3036',
        textAlign: 'center',
        marginBottom: height * 0.03,
        marginHorizontal: width * 0.1, // Ajustei a margem lateral para o texto descritivo
    },
    buttonPrimary: {
        backgroundColor: '#730d83',
        paddingVertical: height * 0.02, // Padding vertical de 2% da altura da tela
        paddingHorizontal: width * 0.1, // Padding horizontal de 10% da largura da tela
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
        position: 'absolute', // Posiciona o botão como absoluto
        bottom: height * 0.08, // Ajuste da posição do botão em relação ao fundo da tela
    },
    buttonText: {
        fontSize: Platform.select({
            ios: width * 0.04, // Fonte maior para iOS
            android: width * 0.03, // Fonte ligeiramente menor para Android
        }),
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default DocAssinatura;
