import React, { useState } from 'react';
import {
    Alert,
    Image,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    StatusBar,
    Dimensions,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Linking
} from 'react-native';
import axios from 'axios';
import { useLogScreen } from '../useLogScreen';
import Svg, { Path } from 'react-native-svg';
const { width, height } = Dimensions.get('window');

// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
            d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z"
            fill="#730d83"
        />
    </Svg>
);

const CelerView = ({ route, navigation }) => {
    useLogScreen('CelerView');
    const { usuario_id } = route.params || {};

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>
                    Home Staging
                </Text>
            </View>
            <Text style={styles.classificacaoText} allowFontScaling={false}>
                {/*  */}
            </Text>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.container}>

                            <View style={styles.row}>
                                <Text style={styles.classificacaoText} allowFontScaling={false}>
                                    O que é Home Staging?
                                </Text>
                                <Text style={styles.checkboxLabel} allowFontScaling={false}>Home Staging virtual é a técnica de decorar digitalmente um imóvel, criando imagens realistas e atraentes para anúncios online. Com essa estratégia, é possível transformar espaços vazios ou antigos em ambientes modernos e acolhedores, ajudando os compradores a visualizar o potencial da propriedade.</Text>
                                {/* <Text style={styles.classificacaoText} allowFontScaling={false}>
                                    Porque usar o Home Staging da imoGo?
                                </Text>
                                <View>
                                    <Text style={styles.checkboxLabel} allowFontScaling={false}>
                                        <Text style={{ fontWeight: 'bold', color: "#1F2024" }}>Venda mais rápido:</Text> Imóveis bem apresentados geram mais interesse e visitas.
                                    </Text>
                                    <Text style={styles.checkboxLabel} allowFontScaling={false}>
                                        <Text style={{ fontWeight: 'bold', color: "#1F2024" }}>Maior visibilidade:</Text> Fotos atraentes se destacam em plataformas de venda.
                                    </Text>
                                    <Text style={styles.checkboxLabel} allowFontScaling={false}>
                                        <Text style={{ fontWeight: 'bold', color: "#1F2024" }}>Economia:</Text> Mais barato que reformas ou decorações físicas (primeiro uso gratuito).
                                    </Text>
                                    <Text style={styles.checkboxLabel} allowFontScaling={false}>
                                       Acelere suas vendas destaque-se no mercado com as soluções práticas da imoGo!
                                    </Text>
                                    <Text style={styles.checkboxLabel} allowFontScaling={false}>
                                        Siga as instruções contidas no manual ao solicitar seu projeto.
                                    </Text>
                                </View> */}
                            </View>

                            <View style={styles.row}>
                                {/* Os inputs de tirar foto */}
                                <View style={styles.optionButtonsContainer}>


                                    <TouchableOpacity style={styles.optionButton} onPress={() => {
                                        Linking.openURL('https://cdn.imogo.com.br/manuais/manual_celer_imogo.pdf');
                                    }}>
                                        <Image
                                            source={require('../assets/icons/info.png')} // Ícone de "Carregar um arquivo"
                                            style={styles.optionIcon}
                                        />
                                        <View style={styles.optionTextContainer}>
                                            <Text style={styles.optionTextTitle} allowFontScaling={false}>Manual Home Staging</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.optionButton} onPress={() => {
                                        Linking.openURL('https://wa.me/5531971354449?text=Ol%C3%A1,%20gostaria%20de%20solicitar%20um%20projeto%20com%20a%20imoGo.');
                                    }}>
                                        <Image
                                            source={require('../assets/icons/whatsapp.png')} // Ícone de "Carregar um arquivo"
                                            style={styles.optionIcon}
                                        />
                                        <View style={styles.optionTextContainer}>
                                            <Text style={styles.optionTextTitle} allowFontScaling={false}>Solicitar novo projeto</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('MeusProjetos', { usuario_id })}>
                                        <Image
                                            source={require('../assets/icons/files.png')} // Ícone de "Carregar um arquivo"
                                            style={styles.optionIcon}
                                        />
                                        <View style={styles.optionTextContainer}>
                                            <Text style={styles.optionTextTitle} allowFontScaling={false}>Meus projetos</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* Botão Salvar */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.laterButton}>
                                    <Image
                                        source={require('../assets/icons/home.png')} // Ícone de terminar mais tarde
                                        style={styles.laterIcon}
                                    />
                                    <Text
                                        style={styles.laterButtonText}
                                        allowFontScaling={false}
                                        onPress={() => navigation.navigate('Home', { usuario_id })}
                                    >
                                        Voltar pra home
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
        marginTop: 10,
        textAlign: 'center',
        paddingLeft: 20,
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

    optionText: {
        fontSize: width * 0.029,
        color: '#494A50',
    },


    checkboxLabel: {
        textAlign: "justify",
        fontSize: 14,
        color: 'black',
        marginLeft: 10,
    },
    buttonContainer: {
        marginTop: 40, // Ajuste do espaçamento superior
        alignItems: 'center',
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

    optionButtonsContainer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#F5F5F5',
        borderColor: '#D3D3D3',
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        padding: 15,
        marginBottom: 10,
    },
    optionIcon: {
        width: 24,
        height: 24,
        marginRight: 15,
        // tintColor: '#730d83', // Deixa a cor dos ícones laranja
    },
    optionTextContainer: {
        flexDirection: 'column',
    },
    optionTextTitle: {
        fontSize: width * 0.03,
        fontWeight: 'bold',
        color: '#1F2024',
    },
    optionTextSubtitle: {
        fontSize: width * 0.03,
        color: '#7A7A7A',
    },

};

export default CelerView;
