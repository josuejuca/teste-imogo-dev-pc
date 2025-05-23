import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar, Image, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const PreCompleteCadastroScreen = ({ navigation, route }) => {
    const { id = null, status, classificacao = '', tipo = '', usuario_id, status_user } = route.params || {};
    console.log("Na pre ID: ", {usuario_id});
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={require('../../assets/img/complete.png')} // Substitua pelo caminho correto da imagem
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.content}>
                    <Text style={styles.title} allowFontScaling={false}>Complete seu cadastro</Text>
                    <Text style={styles.subtitle} allowFontScaling={false}>
                        e tenha mais praticidade em mãos
                    </Text>

                    <View style={styles.instructionContainer}>
                        <Text style={styles.instructionText}>Você vai precisar:</Text>
                        <Text style={styles.bulletText}>• Ter algum documento de identidade com foto em mãos;</Text>
                        <Text style={styles.bulletText}>• Tirar uma foto sua para validarmos a veracidade dos dados.</Text>
                        <Text style={styles.bulletText}>ID: {id} | status: {status} | usuario_id: {usuario_id} | status_user: {status_user}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => navigation.navigate('CadastroCompleto', { id, classificacao, tipo, usuario_id, status, status_user })}
                    >
                        <Text style={styles.saveButtonText} allowFontScaling={false}>Completar cadastro</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.laterButton} onPress={() => navigation.navigate('Home', {usuario_id})}>
                            <Image
                                source={require('../../assets/icons/bookmark.png')} // Ícone de terminar mais tarde
                                style={styles.laterIcon}
                            />
                            <Text
                                style={styles.laterButtonText}
                                allowFontScaling={false}
                            >
                                Terminar mais tarde
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.05,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#730d83', // Laranja ajustado
        textAlign: 'center',
        marginBottom: height * 0.01,
    },
    subtitle: {
        fontSize: width * 0.04,
        color: '#1F2024', // Cinza ajustado 8F9098
        textAlign: 'center',
        marginBottom: height * 0.02,
    },
    instructionContainer: {
        marginHorizontal: width * 0.1,
        marginBottom: height * 0.05,
    },
    instructionText: {
        fontSize: width * 0.035, // Mesma fonte para o texto da lista
        fontWeight: 'bold',
        color: '#8F9098', // Preto ajustado
        marginBottom: height * 0.01,
    },
    bulletText: {
        fontSize: width * 0.035, // Mesma fonte para o texto da lista
        color: '#8F9098', // Preto ajustado
        textAlign: 'left',
    },
    saveButton: {
        backgroundColor: '#730d83', // Laranja ajustado
        paddingVertical: 15,
        paddingHorizontal: width * 0.2,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.04 }),
        fontWeight: '600',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 40,
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
        color: '#730d83', // Laranja ajustado
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.04 }),
        fontWeight: '600',
    },
});

export default PreCompleteCadastroScreen;
