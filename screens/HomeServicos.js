import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, Dimensions, Platform, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; // Importando useFocusEffect
import ImovelClassificacao from './modal/imovelClassificacaoModal';
import TutorialModal from './modal/TutorialModal'
import ImoveisList from './ImoveisListModal';
import axios from 'axios'; // Importando axios para fazer a requisição à API
import AsyncStorage from '@react-native-async-storage/async-storage';
import SupportModal from './modal/SupportModal';
import { useLogScreen } from '../useLogScreen';
// 
const { width, height } = Dimensions.get('window');

const Home = ({ route, navigation }) => {
    useLogScreen('HomePWA');
    const { usuario_id } = route.params || {}; // Obtendo o ID do usuário vindo da tela anterior
    console.log("Na Home ID: ", { usuario_id });

    // Verificar se é web e largura da tela
    // if (Platform.OS === 'web' && width > 768) {
    //     return (
    //         <View style={styles.webContainer}>
    //             <Text style={styles.webMessage}>
    //                 Este app foi projetado para ser usado em dispositivos móveis. Por favor, acesse-o em um celular.
    //             </Text>
    //         </View>
    //     );
    // }

    const [userInfo, setUserInfo] = useState(null); // Estado para armazenar as informações do usuário
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [modalVisible, setModalVisible] = useState(false); // Controla o primeiro modal (categoria)
    const [classificationModalVisible, setClassificationModalVisible] = useState(false); // Controla o segundo modal (tipo de imóvel)
    const [categoria, setCategoria] = useState('');
    const [tipoImovel, setTipoImovel] = useState('');

    // tutorial
    // tutorial
    const [tutorialVisible, setTutorialVisible] = useState(false); // Tutorial começa invisível
    const [buttonLayout, setButtonLayout] = useState(null); // Armazena as dimensões do botão

    // Verifica se o tutorial já foi exibido

    // menu 
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    // end menu

    // Função para fechar o tutorial e salvar no AsyncStorage
    const handleCloseTutorial = async () => {
        await AsyncStorage.setItem('hasSeenTutorial', 'true'); // Salva que o tutorial foi visto
        setTutorialVisible(false); // Fecha o modal
    };
    // end Tutorial

    // Se o usuario_id for indefinido, redireciona o usuário para a tela de login
    useEffect(() => {
        if (!usuario_id) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }

        const checkTutorial = async () => {
            const hasSeenTutorial = await AsyncStorage.getItem('hasSeenTutorial');
            if (!hasSeenTutorial) {
                setTutorialVisible(true); // Exibe o tutorial se ainda não foi visto
            }
        };

        checkTutorial();
    }, [usuario_id, navigation]);

    // Função para buscar os dados do usuário
    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://api.imogo.com.br/api/v1/corretores/${usuario_id}`);
            setUserInfo(response.data); // Armazena as informações do usuário
        } catch (error) {

            console.error('Erro ao buscar informações do usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hook para buscar os dados do usuário toda vez que a tela entra em foco
    useFocusEffect(
        useCallback(() => {
            if (usuario_id) {
                fetchUserInfo(); // Chama a função para buscar os dados do usuário
            }
        }, [usuario_id])
    );

    const handleCategorySelect = (selectedCategoria) => {
        setCategoria(selectedCategoria);
        setModalVisible(false); // Fecha o primeiro modal
        setTimeout(() => setClassificationModalVisible(true), 300); // Abre o segundo modal após 300ms
    };

    // Exibindo um indicador de carregamento enquanto busca as informações do usuário
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#730d83" />
            </View>
        );
    }


    const status_user = userInfo?.status
    const emailUser = userInfo?.email

    console.log("COE:", emailUser)

    // sair 

    const handleLogout = async () => {
        try {
            // Remove o usuario_id do AsyncStorage ao sair
            await AsyncStorage.removeItem('usuario_id');
            // Redefine a navegação e define "Login" como a única tela no histórico
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (error) {
            console.error('Error during logout', error);
        }
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StatusBar
                    barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
                    backgroundColor="#730d83"
                    translucent
                />
                {/* Header com logo e notificação */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={openMenu}>
                        <Image
                            source={require('../assets/icons/menu.png')}
                            style={styles.IconFooter}
                        />
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/img/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>                    
                </View>

                {/* Linha de separação do header */}
                <View style={styles.headerLine} />

                {/* Banners Interativos */}
                <View style={styles.bannersContainer}>
                    <TouchableOpacity style={styles.banner} onPress={() => navigation.navigate('AvaliadorScreen', { usuario_id, emailUser })}>
                        <Image
                            source={require('../assets/banners/1.png')} // Substitua pelo caminho correto
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.banner} onPress={() => navigation.navigate('QuadraCred', { usuario_id, emailUser })}>
                        <Image
                            source={require('../assets/banners/3.png')} // Substitua pelo caminho correto
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    {/* planejamento de redes sociais */}
                    <TouchableOpacity style={styles.banner} onPress={() => navigation.navigate('PlanejamentoRedes', { usuario_id, emailUser })}>
                        <Image
                            source={require('../assets/banners/5.png')} // Substitua pelo caminho correto
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    {/* analise de certidões */}
                    {/* onPress={() => navigation.navigate('PreAnaliseDocumental', { usuario_id, emailUser })} */}
                    <TouchableOpacity style={styles.banner} onPress={() => navigation.navigate('PreAnaliseDocumental', { usuario_id, emailUser })}>
                        <Image
                            source={require('../assets/banners/2.png')} // Substitua pelo caminho correto
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    {/* trilha do conhecimento */}
                    <TouchableOpacity style={styles.banner} onPress={() => navigation.navigate('TrilhaDoConhecimento', { usuario_id })}>
                        <Image
                            source={require('../assets/banners/11.png')} // Substitua pelo caminho correto
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.banner} onPress={() => navigation.navigate('CelerView', { usuario_id })}>
                        <Image
                            source={require('../assets/banners/13.png')} // Substitua pelo caminho correto
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    {/* gerador de contratos */}
                    <TouchableOpacity style={styles.banner} onPress={() => navigation.navigate('GeradorContratos', { usuario_id, emailUser })}>
                        <Image
                            source={require('../assets/banners/4.png')} // Substitua pelo caminho correto
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>

                    {/* gerador de anuncios */}
                    <TouchableOpacity style={styles.banner}>
                        <Image
                            source={require('../assets/banners/8.png')} // Substitua pelo caminho correto
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    
                </View>
            </View>
            {/* Menu */}
            <Modal
                animationType="none" // Desative a animação padrão
                transparent={true}
                visible={menuVisible}
                onRequestClose={closeMenu}
            >
                <TouchableOpacity
                    style={styles.menuOverlay}
                    activeOpacity={1}
                    onPress={closeMenu}>
                    <View style={[styles.menuContainer, { transform: [{ translateX: menuVisible ? 0 : -300 }] }]}>
                        <TouchableOpacity onPress={closeMenu} style={styles.closeMenuButton}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>

                        <View style={styles.menuHeader}>
                            <Image
                                source={{ uri: userInfo?.foto_conta || 'https://juca.eu.org/img/icon_dafault.jpg' }}
                                style={styles.userAvatar}
                            />
                            <Text style={styles.userName}>{userInfo?.nome_social || 'Usuário'}</Text>
                            <Text style={styles.userEmail}>{userInfo?.email || 'Email não disponível'}</Text>
                        </View>

                        <View style={styles.menuItems}>
                            <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); navigation.navigate('Home', { usuario_id }); }}>
                                <Ionicons name="home-outline" size={24} color="#000" />
                                <Text style={styles.menuItemText}>Home</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); navigation.navigate('ProfileScreen', { usuario_id }); }}>
                                <Ionicons name="person-outline" size={24} color="#000" />
                                <Text style={styles.menuItemText}>Perfil</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity style={styles.menuItem} onPress={() => alert('Em breve!')}>
                                <Ionicons name="settings-outline" size={24} color="#000" />
                                <Text style={styles.menuItemText}>Configurações</Text>
                            </TouchableOpacity> */}

                            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                                <Ionicons name="log-out-outline" size={24} color="#D9534F" />
                                <Text style={[styles.menuItemText, styles.logoutText]}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
            <SupportModal />
        </SafeAreaView>
    );
};

// Estilização
const styles = StyleSheet.create({

    // menu
    menuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    menuContainer: {
        width: '75%',
        height: '100%',
        backgroundColor: '#FFF',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeMenuButton: {
        alignSelf: 'flex-end',
        marginBottom: height * 0.025,
    },
    menuHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    menuItems: {
        marginTop: 20,
        paddingHorizontal: 10,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15, // Espaçamento vertical entre os itens
        paddingHorizontal: 10, // Espaçamento horizontal interno
        borderBottomWidth: 1,
        borderBottomColor: '#EDEDED', // Linha de separação entre os itens
    },

    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginLeft: 15, // Espaço entre o ícone e o texto
    },

    logoutItem: {
        borderBottomWidth: 0, // Remove a linha inferior do último item
        marginTop: 20, // Dá um espaço maior para o item "Sair"
    },

    logoutText: {
        color: '#D9534F', // Cor vermelha para o texto "Sair"
        fontWeight: '600',
    },
    // end menu

    // banners

    bannersContainer: {
        marginTop: 20, // Espaço após o divisor
        paddingHorizontal: 16, // Espaçamento lateral proporcional
        alignItems: 'center', // Centraliza os itens horizontalmente
    },
    banner: {
        width: width * 0.9, // 90% da largura da tela
        height: (width * 0.9) * (710 / 3350), // Mantém a proporção original do banner
        marginVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain', // Evita cortes no texto do banner
    },
    // fim banners

    IconFooter: {
        width: 24,
        height: 24
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        width: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        backgroundColor: '#F5F5F5',
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: width * 0.55,
        height: height * 0.05,
    },
    headerLine: {
        height: 1,
        backgroundColor: '#E9E9E9',
        width: '100%',
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


export default Home;
