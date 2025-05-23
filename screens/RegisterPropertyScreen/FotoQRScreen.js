import React, { useState, useEffect } from 'react';
import {
    Alert,
    View,
    Text,
    TouchableOpacity,
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
    Image
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

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

const FotoQRScreen = ({ route, navigation }) => {
    const { usuario_id, tipo_documento, galeria = false } = route.params || {};

    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [titleDocumento, setTitleDocumento] = useState('');
    const [labelDocumento, setLabelDocumento] = useState('');
    const [textoDocumento, setTextoDocumento] = useState('');

    // Definir título e label com base no tipo de documento
    useEffect(() => {
        if (tipo_documento !== 'CNH') {
            setTitleDocumento("Envio da Frente do RG");
            setLabelDocumento("Por favor, envie a foto da parte da frente do RG do proprietário para prosseguirmos com a validação.");
        } else {
            setTitleDocumento("Primeiro o QR Code");
            setLabelDocumento("Vamos validar o QR Code da CNH do proprietário. Ele está na parte de trás do documento.");
        }

        setTextoDocumento(galeria ? "Abrir Galeria" : "Tirar Foto");
    }, [tipo_documento, galeria]);

    // Função para capturar imagem da câmera
    // const openCamera = async () => {
    //     const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    //     if (!permissionResult.granted) {
    //         Alert.alert("Permissão negada", "É necessária a permissão para acessar a câmera.");
    //         return;
    //     }

    //     const result = await ImagePicker.launchCameraAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         quality: 1,
    //     });

    //     if (!result.canceled && result.assets.length > 0) {
    //         const imageUri = result.assets[0].uri;
    //         handleImageSelection(imageUri);
    //     }
    // };

    // Função para escolher imagem da galeria
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permissão negada", "É necessária a permissão para acessar a galeria.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            handleImageSelection(imageUri);
        }
    };

    // Função para converter URI da imagem em Blob e enviar para a API
    // const handleImageSelection = async (uri) => {
    //     try {
    //         setLoading(true); // Exibir o modal de carregamento
    //         const response = await fetch(uri);
    //         const blob = await response.blob();
    //         await sendImageToAPI(blob);
    //     } catch (error) {
    //         console.error("Erro ao processar a imagem:", error);
    //         Alert.alert("Erro", "Falha ao processar a imagem. Tente novamente.");
    //     } finally {
    //         setLoading(false); // Ocultar o modal de carregamento após a conclusão
    //     }
    // };

    // Função para enviar a imagem para a API
    // const sendImageToAPI = async (imageBlob) => {
    //     const formData = new FormData();
    //     formData.append(tipo_documento === 'CNH' ? 'qr_cnh_file' : 'rg_frente_file', imageBlob, 'image.jpg');

    //     try {
    //         const response = await axios.post(
    //             `http://api-pwa.josuejuca.com/api/v2/usuarios/${usuario_id}/upload_${tipo_documento === 'CNH' ? 'cnh_qr' : 'rg_frente'}/`,
    //             formData,
    //             {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                 },
    //             }
    //         );

    //         if (response.status === 200) {
    //             Alert.alert("Sucesso", "Imagem enviada com sucesso!");
    //             navigation.navigate('FotoInteraScreen', { usuario_id, tipo_documento, galeria });
    //         } else {
    //             throw new Error(`Erro: Código de status ${response.status}`);
    //         }
    //     } catch (error) {
    //         console.error('Erro ao enviar a imagem:', error.response ? error.response.data : error.message);
    //         Alert.alert("Erro", "Falha ao enviar a imagem. Tente novamente.");
    //     }
    // };

    // 

    // Função para capturar imagem da câmera com a câmera frontal no PWA
    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permissão negada", "É necessária a permissão para acessar a câmera.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            cameraType: ImagePicker.CameraType.Front, // Define a câmera frontal
        });

        if (!result.canceled && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            handleImageSelection(imageUri);
        }
    };

    // Função para converter URI da imagem em Blob e enviar para a API
    const handleImageSelection = async (uri) => {
        try {
            setLoading(true);

            // No PWA (web), o URI pode estar no formato base64; para mobile, usamos Blob
            let imageBlob;
            if (Platform.OS === 'web') {
                imageBlob = await fetch(uri).then((res) => res.blob());
            } else {
                const response = await fetch(uri);
                imageBlob = await response.blob();
            }

            await sendImageToAPI(imageBlob);
        } catch (error) {
            console.error("Erro ao processar a imagem:", error);
            Alert.alert("Erro", "Falha ao processar a imagem. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    // Função para enviar a imagem para a API
    const sendImageToAPI = async (imageBlob) => {
        const formData = new FormData();
        formData.append(tipo_documento === 'CNH' ? 'qr_cnh_file' : 'rg_frente_file', imageBlob, 'image.jpg');

        try {
            const response = await axios.post(
                `https://api.imogo.com.br/api/v2/corretor/${usuario_id}/upload_${tipo_documento === 'CNH' ? 'cnh_qr' : 'rg_frente'}/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                Alert.alert("Sucesso", "Imagem enviada com sucesso!");
                navigation.navigate('FotoInteraScreen', { usuario_id, tipo_documento, galeria });
            } else {
                throw new Error(`Erro: Código de status ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao enviar a imagem:', error.response ? error.response.data : error.message);
            Alert.alert("Erro", "Falha ao enviar a imagem. Tente novamente.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Instruções de envio</Text>
            </View>
            <Text style={styles.classificacaoText}>{titleDocumento}</Text>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.container}>
                            <View style={styles.row}>
                                <Text style={styles.checkboxLabel}>{labelDocumento}</Text>
                            </View>
                            {/* Botão de ação */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.saveButton} onPress={galeria ? pickImage : openCamera}>
                                    <Text style={styles.saveButtonText}>{textoDocumento}</Text>
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
                    <ActivityIndicator size="large" color="#730d83" />
                    <Text style={styles.loadingText}>Enviando imagem...</Text>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = {

    // Botao de terminar dps
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

    //   fim botao 
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: width * 0.055
    },
    headerTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#1F2024',
        textAlign: 'center'
    },
    classificacaoText: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: 10,
        textAlign: 'center',
        paddingLeft: 20,
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
    checkboxLabel: {
        textAlign: "center",
        fontSize: 14,
        color: '#7A7A7A',
        marginLeft: 10,
    },
    buttonContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#730d83',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingText: {
        color: '#FFF',
        marginTop: 10,
        fontSize: 16,
    },
    backButton: {
        position: 'absolute',
        left: 20,
    },
};

export default FotoQRScreen;
