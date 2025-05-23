// ./TutorialPWA.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, Platform, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogScreen } from '../useLogScreen';
// Obter a largura e altura da tela
const { width, height } = Dimensions.get('window');

const TutorialPWA = ({ navigation }) => {
    useLogScreen('TutorialPWA');
    const [currentTutorial, setCurrentTutorial] = useState(null);
    const [showTutorial, setShowTutorial] = useState(false);

    // Carregar as fontes
    let [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_700Bold,
    });

    // Verificar se o tutorial já foi concluído
    useEffect(() => {
        const checkTutorialStatus = async () => {
            const tutorialCompleted = await AsyncStorage.getItem('tutorialCompleted');
            if (tutorialCompleted) {
                navigation.navigate('Welcome'); // Se já foi concluído, vai direto para Login
            } else {
                setShowTutorial(true); // Caso contrário, mostra o tutorial
            }
        };
        checkTutorialStatus();
    }, []);

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#730d83" />
            </View>
        );
    }

    if (Platform.OS === 'web' && width > 768) {
        return navigation.navigate('Welcome');
    }

    if (currentTutorial === 'ios') {
        return (
            <TutorialInstallIOS
                onBack={() => setCurrentTutorial(null)}
                onFinish={async () => {
                    await AsyncStorage.setItem('tutorialCompleted', 'true'); // Salva no AsyncStorage
                    navigation.navigate('Welcome'); // Navega para Welcome
                }}
            />
        );
    }

    if (currentTutorial === 'android') {
        return (
            <TutorialInstallAndroid
                onBack={() => setCurrentTutorial(null)}
                onFinish={async () => {
                    await AsyncStorage.setItem('tutorialCompleted', 'true'); // Salva no AsyncStorage
                    navigation.navigate('Welcome'); // Navega para Welcome
                }}
            />
        );
    }

    if (showTutorial) {
        return (
            <ImageBackground
                source={require('../assets/img/Splashcreen.png')}
                style={styles.background}
            >
                <StatusBar
                    barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
                    backgroundColor="transparent"
                    translucent
                />
                <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/img/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.whiteContainer}>
                        <Text style={styles.title} allowFontScaling={false}>Bem-vindo!</Text>
                        <Text style={styles.subtitle} allowFontScaling={false}>
                            Siga o tutorial para instalar o aplicativo conforme o seu dispositivo mobile
                        </Text>

                        <TouchableOpacity
                            style={styles.buttonSecondary}
                            onPress={() => setCurrentTutorial('ios')}
                        >
                            <Ionicons
                                name="logo-apple"
                                size={24}
                                color="#000000"
                                style={styles.socialIcon}
                            />
                            <Text style={styles.buttonTextSecondary} allowFontScaling={false}>iOS</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonSecondary}
                            onPress={() => setCurrentTutorial('android')}
                        >
                            <Ionicons
                                name="logo-android"
                                size={24}
                                color="#A4C439"
                                style={styles.socialIcon}
                            />
                            <Text style={styles.buttonTextSecondary} allowFontScaling={false}>Android</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        );
    }

    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#730d83" />
        </View>
    ); // Enquanto verifica o estado, não renderiza nada
};

const TutorialInstallIOS = ({ onBack, onFinish }) => {
    const [currentStep, setCurrentStep] = useState(0); // Controla a etapa atual

    // Dados das etapas
    const steps = [
        {
            text: "Clique no ícone central conforme a imagem acima.",
            image: require('../assets/img/tutorial_ios_1.png'),
            stage: (
                <View style={styles_tutorial.progressBarContainer}>
                    <View style={styles_tutorial.progressSegmentHalfFilled}>
                        <View style={styles_tutorial.progressSegmentHalfFilledInner}></View>
                    </View>
                    <View style={styles_tutorial.progressSegment}></View>
                    <View style={styles_tutorial.progressSegment}></View>
                </View>
            ),
        },
        {
            text: "Em seguida, deslize a tela para cima e clique em “Adicionar à Tela de Início”.",
            image: require('../assets/img/tutorial_ios_2.png'),
            stage: (
                <View style={styles_tutorial.progressBarContainer}>
                    <View style={styles_tutorial.progressSegmentFilled}></View>
                    <View style={styles_tutorial.progressSegmentHalfFilled}>
                        <View style={styles_tutorial.progressSegmentHalfFilledInner}></View>
                    </View>
                    <View style={styles_tutorial.progressSegment}></View>
                </View>
            ),
        },
        {
            text: "Clique em “Adicionar” e pronto. O app já estará na sua tela inicial.",
            image: require('../assets/img/tutorial_ios_3.png'),
            stage: (
                <View style={styles_tutorial.progressBarContainer}>
                    <View style={styles_tutorial.progressSegmentFilled}></View>
                    <View style={styles_tutorial.progressSegmentFilled}></View>
                    <View style={styles_tutorial.progressSegmentHalfFilled}>
                        <View style={styles_tutorial.progressSegmentHalfFilledInner}></View>
                    </View>
                </View>
            ),
        },
    ];

    // Funções para avançar ou voltar
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onFinish(); // Última etapa vai para Login
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            onBack(); // Volta para TutorialPWA
        }
    };

    return (
        <SafeAreaView style={styles_tutorial.safeArea}>
            <View style={styles_tutorial.container}>
                <StatusBar barStyle="dark-content" />

                {/* Barra de progresso */}
                {steps[currentStep].stage}

                {/* Imagem */}
                <View style={styles_tutorial.imageContainer}>
                    <Image
                        source={steps[currentStep].image}
                        style={styles_tutorial.image}
                        resizeMode="contain"
                    />
                </View>

                {/* Texto do tutorial */}
                <Text style={styles.subtitle} allowFontScaling={false}>
                    {steps[currentStep].text}
                </Text>

                {/* Botões */}
                <View style={styles_tutorial.buttonContainer}>
                    <TouchableOpacity style={styles_tutorial.cancelButton} onPress={handleBack}>
                        <Text style={styles_tutorial.cancelButtonText} allowFontScaling={false}>Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles_tutorial.okButton}
                        onPress={handleNext}
                    >
                        <Text style={styles_tutorial.okButtonText} allowFontScaling={false}>
                            {currentStep < steps.length - 1 ? 'Próximo' : 'Finalizar'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const TutorialInstallAndroid = ({ onBack, onFinish }) => {
    const [currentStep, setCurrentStep] = useState(0); // Controla a etapa atual

    // Dados das etapas
    const steps = [
        {
            text: "Clique nos 3 pontinhos no canto superior direito conforme a imagem acima.",
            image: require('../assets/img/tutorial_android_1.png'),
            stage: (
                <View style={styles_tutorial.progressBarContainer}>
                    <View style={styles_tutorial.progressSegmentHalfFilled}>
                        <View style={styles_tutorial.progressSegmentHalfFilledInner}></View>
                    </View>
                    <View style={styles_tutorial.progressSegment}></View>
                    <View style={styles_tutorial.progressSegment}></View>
                </View>
            ),
        },
        {
            text: "Em seguida, clique em “Adicionar à tela inicial”.",
            image: require('../assets/img/tutorial_android_2.png'),
            stage: (
                <View style={styles_tutorial.progressBarContainer}>
                    <View style={styles_tutorial.progressSegmentFilled}></View>
                    <View style={styles_tutorial.progressSegmentHalfFilled}>
                        <View style={styles_tutorial.progressSegmentHalfFilledInner}></View>
                    </View>
                    <View style={styles_tutorial.progressSegment}></View>
                </View>
            ),
        },
        {
            text: "Clique em “Instalar” e pronto. O app já estará na sua tela inicial.",
            image: require('../assets/img/tutorial_android_3.png'),
            stage: (
                <View style={styles_tutorial.progressBarContainer}>
                    <View style={styles_tutorial.progressSegmentFilled}></View>
                    <View style={styles_tutorial.progressSegmentFilled}></View>
                    <View style={styles_tutorial.progressSegmentHalfFilled}>
                        <View style={styles_tutorial.progressSegmentHalfFilledInner}></View>
                    </View>
                </View>
            ),
        },
    ];

    // Funções para avançar ou voltar
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onFinish(); // Última etapa vai para Login
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            onBack(); // Volta para TutorialPWA
        }
    };

    return (
        <SafeAreaView style={styles_tutorial.safeArea}>
            <View style={styles_tutorial.container}>
                <StatusBar barStyle="dark-content" />

                {/* Barra de progresso */}
                {steps[currentStep].stage}

                {/* Imagem */}
                <View style={styles_tutorial.imageContainer}>
                    <Image
                        source={steps[currentStep].image}
                        style={styles_tutorial.image}
                        resizeMode="contain"
                    />
                </View>

                {/* Texto do tutorial */}
                <Text style={styles.subtitle} allowFontScaling={false}>
                    {steps[currentStep].text}
                </Text>

                {/* Botões */}
                <View style={styles_tutorial.buttonContainer}>
                    <TouchableOpacity style={styles_tutorial.cancelButton} onPress={handleBack}>
                        <Text style={styles_tutorial.cancelButtonText} allowFontScaling={false}>Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles_tutorial.okButton}
                        onPress={handleNext}
                    >
                        <Text style={styles_tutorial.okButtonText} allowFontScaling={false}>
                            {currentStep < steps.length - 1 ? 'Próximo' : 'Finalizar'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    // Tutorial 

    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    },

    progressBarContainer: {
        marginTop: Platform.select({
            ios: height * 0.02, // Espaço menor no iOS
            android: height * 0.015, // Espaço menor no Android
        }),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.04, // Ajuste de margem inferior
    },
    progressSegment: {
        height: height * 0.008, // Ajuste da altura para a barra de progresso
        width: '33%',
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
    },
    progressSegmentFilled: {
        height: height * 0.008,
        width: '33%',
        backgroundColor: '#730d83',
        borderRadius: 4,
    },
    progressSegmentHalfFilled: {
        height: height * 0.008,
        width: '33%',
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressSegmentHalfFilledInner: {
        height: '100%',
        width: '50%',
        backgroundColor: '#730d83',
    },

    // 
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
    logoContainer: {
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: width * 0.35,
        height: height * 0.12,
    },
    whiteContainer: {
        width: '100%',
        height: height * 0.5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: width * 0.06,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
    },
    title: {
        fontFamily: 'Nunito_700Bold',
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: height * 0.01,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Nunito_400Regular',
        fontSize: Platform.select({
            ios: width * 0.038,
            android: width * 0.038,
            web: width * 0.038,
        }),
        color: '#8F9098',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: Platform.select({
            ios: height * 0.045,
            android: height * 0.04,
            web: height * 0.04,
        }),
    },
    buttonTextPrimary: {
        fontFamily: 'Nunito_700Bold',
        color: '#F5F5F5',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    buttonTextSecondary: {
        fontFamily: 'Nunito_700Bold',
        color: '#1F2024',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    buttonPrimary: {
        backgroundColor: '#730d83',
        paddingVertical: height * 0.012,
        paddingHorizontal: width * 0.1,
        borderRadius: 30,
        marginBottom: height * 0.012,
        width: '100%',
        alignItems: 'center',
    },
    buttonSecondary: {
        borderColor: '#1F2024',
        borderWidth: 1,
        paddingVertical: height * 0.012,
        marginBottom: height * 0.012,
        paddingHorizontal: width * 0.1,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row', // Alinha o ícone e texto em uma linha
        justifyContent: 'center', // Centraliza o conteúdo
    },
    socialIcon: {
        marginRight: 10, // Adiciona espaço entre o ícone e o texto
    },

    // Estilo para web
    webContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    webMessage: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 24,
        color: '#1F2024',
        textAlign: 'center',
    },
});

const styles_tutorial = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    },

    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        paddingHorizontal: width * 0.05, // Reduzi o padding horizontal
        paddingTop: Platform.select({
            ios: height * 0.07, // Aproximadamente 7% da altura da tela no iOS
            android: height * 0.05, // Aproximadamente 5% da altura da tela no Android
        }),
    },
    progressBarContainer: {
        marginTop: Platform.select({
            ios: height * 0.02, // Espaço menor no iOS
            android: height * 0.015, // Espaço menor no Android
        }),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.04, // Ajuste de margem inferior
    },
    progressSegment: {
        height: height * 0.008, // Ajuste da altura para a barra de progresso
        width: '33%',
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
    },
    progressSegmentFilled: {
        height: height * 0.008,
        width: '33%',
        backgroundColor: '#730d83',
        borderRadius: 4,
    },
    progressSegmentHalfFilled: {
        height: height * 0.008,
        width: '33%',
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressSegmentHalfFilledInner: {
        height: '100%',
        width: '50%',
        backgroundColor: '#730d83',
    },

    // botão 

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: height * 0.02,
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        borderColor: '#1F2024',
        borderWidth: 1,
        borderRadius: 25,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.15,
        alignItems: 'center',
    },
    okButton: {
        backgroundColor: '#730d83',
        borderRadius: 25,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.15,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: Platform.select({
            ios: width * 0.035, // Menor em iOS para melhor aparência
            android: width * 0.04,
        }),
        color: '#1F2024',
    },
    okButtonText: {
        fontSize: Platform.select({
            ios: width * 0.035,
            android: width * 0.04,
        }),
        color: '#F5F5F5',
    },

    //   img

    imageContainer: {
        justifyContent: "center", // Centraliza verticalmente
        alignItems: "center", // Centraliza horizontalmente
    },

    image: {
        width: width * 0.9, // 70% da largura da tela
        height: height * 0.6, // 40% da altura da tela
        resizeMode: "contain", // Mantém a proporção da imagem
        marginBottom: height * 0.03, // Espaço inferior
    },
});

export default TutorialPWA;
