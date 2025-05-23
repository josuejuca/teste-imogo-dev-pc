import React, { useState, useEffect, useCallback } from 'react';
import { Linking, View, Text, TouchableOpacity, StatusBar, Image, Dimensions, Platform, Modal, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; // Importando useFocusEffect
import ImovelClassificacao from './modal/imovelClassificacaoModal';
import ImoveisList from './ImoveisListModal';
import axios from 'axios'; // Importando axios para fazer a requisição à API
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // Importando o ImagePicker

import editIcon from '../assets/icons/edit.png';

import { useLogScreen } from '../useLogScreen';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ route, navigation }) => {
  useLogScreen('ProfileScreen');
  // Verificar se é web e largura da tela
  // if (Platform.OS === 'web' && width > 768) {
  //   return (
  //     <View style={styles.webContainer}>
  //       <Text style={styles.webMessage}>
  //         Este app foi projetado para ser usado em dispositivos móveis. Por favor, acesse-o em um celular.
  //       </Text>
  //     </View>
  //   );
  // }

  const { usuario_id } = route.params || {}; // Obtendo o ID do usuário vindo da tela anterior

  const [userInfo, setUserInfo] = useState(null); // Estado para armazenar as informações do usuário
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [modalVisible, setModalVisible] = useState(false); // Controla o primeiro modal (categoria)
  const [classificationModalVisible, setClassificationModalVisible] = useState(false); // Controla o segundo modal (tipo de imóvel)
  const [categoria, setCategoria] = useState('');
  const [tipoImovel, setTipoImovel] = useState('');

  // menu 
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  // end menu

  // Se o usuario_id for indefinido, redireciona o usuário para a tela de login
  useEffect(() => {
    if (!usuario_id) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
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
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos da permissão de acesso à câmera e à galeria.');
      return;
    }

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      setUserInfo((prev) => ({
        ...prev,
        foto_conta: result.assets[0].uri, // Atualiza a foto de perfil com a imagem selecionada
      }));
    }
  };


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
          backgroundColor="transparent"
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
          <TouchableOpacity onPress={() => alert('Em breve!')}>
            <Image
              source={require('../assets/icons/notificacao.png')}
              style={styles.IconFooter}
            />
          </TouchableOpacity>
        </View>

        {/* Linha de separação do header */}
        <View style={styles.headerLine} />


        {/* Container principal para conteúdo */}
        <View style={styles.bodyContainer}>
          {/* Mensagem de boas-vindas */}
          <Text style={styles.welcomeText} allowFontScaling={false}>Meu Perfil </Text>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
              <Image
                source={{ uri: userInfo?.foto_conta || 'https://juca.eu.org/img/icon_dafault.jpg' }}
                style={styles.profileImage}
              />
              <View style={styles.editIconContainer}>
                <Image source={editIcon} style={styles.editIcon} />
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{userInfo?.nome_social || 'Usuário'}</Text>
          </View>

          <View style={styles.menuContainer}>
            {/* <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Dados pessoais </Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#7A7A7A" />
            </TouchableOpacity>

           
            {status_user >= 1 && status_user <= 9 && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('CadastroCompleto', { usuario_id, status_user })} 

              >
                <Text style={styles.menuText}>Completar Cadastro</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#7A7A7A" />
              </TouchableOpacity>
            )} */}

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile', { usuario_id })} >
              <Text style={styles.menuText}>Minha conta</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#7A7A7A" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => {
              Linking.openURL('https://sites.google.com/view/imogoapp/privacy-policy');
            }}>
              <Text style={styles.menuText}>Política de Privacidade</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#7A7A7A" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => {
              Linking.openURL('https://sites.google.com/view/imogoapp/termos');
            }}>
              <Text style={styles.menuText}>Termos e Condições</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#7A7A7A" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuText, { color: "red" }]}>Sair</Text>
              <Ionicons name="log-out-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
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
          <View style={[styles.menuContainer_header, { transform: [{ translateX: menuVisible ? 0 : -300 }] }]}>
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

            <View style={styles.menuItems_header}>
              <TouchableOpacity style={styles.menuItem_header} onPress={() => { closeMenu(); navigation.navigate('Home', { usuario_id }); }}>
                <Ionicons name="home-outline" size={24} color="#000" />
                <Text style={styles.menuItemText_header}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem_header} onPress={() => { closeMenu(); navigation.navigate('ProfileScreen', { usuario_id }); }}>
                <Ionicons name="person-outline" size={24} color="#000" />
                <Text style={styles.menuItemText_header}>Perfil</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.menuItem_header} onPress={() => alert('Em breve!')}>
                  <Ionicons name="settings-outline" size={24} color="#000" />
                  <Text style={styles.menuItemText_header}>Configurações</Text>
                </TouchableOpacity> */}

              <TouchableOpacity style={[styles.menuItem_header, styles.logoutItem]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#D9534F" />
                <Text style={[styles.menuItemText_header, styles.logoutText]}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  menuContainer_header: {
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
    marginBottom: 20,
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
  menuItems_header: {
    marginTop: 20,
    paddingHorizontal: 10,
  },

  menuItem_header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15, // Espaçamento vertical entre os itens
    paddingHorizontal: 10, // Espaçamento horizontal interno
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED', // Linha de separação entre os itens
  },

  menuItemText_header: {
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
  welcomeContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  welcomeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: Platform.select({
      ios: width * 0.05,
      android: width * 0.05,
    }),
    color: '#1F2024',
    marginBottom: height * 0.005,
    textAlign: 'center',
  },
  subText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: Platform.select({
      ios: width * 0.04,
      android: width * 0.04,
    }),
    color: '#7A7A7A',
    textAlign: 'center',
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 0, // Remove padding lateral
    marginTop: height * 0.03,
  },
  noPropertiesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#730d83',
    borderRadius: 30,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  addButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: '#FFF',
    fontSize: Platform.select({
      ios: width * 0.045,
      android: width * 0.045,
    }),
    textAlign: 'center',
  },
  propertiesContainer: {
    flex: 1, // Garantir que ocupe toda a altura
    width: '100%', // Garantir que ocupe toda a largura
    paddingHorizontal: 0, // Remover padding que pode centralizar os itens
  },
  propertyItem: {
    backgroundColor: '#FFF',
    padding: height * 0.02,
    marginVertical: height * 0.01,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  propertyText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: Platform.select({
      ios: width * 0.045,
      android: width * 0.045,
    }),
    color: '#1F2024',
  },
  propertyButton: {
    marginTop: height * 0.01,
    paddingVertical: height * 0.01,
    backgroundColor: '#730d83',
    borderRadius: 10,
    alignItems: 'center',
  },
  propertyButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: '#FFF',
    fontSize: Platform.select({
      ios: width * 0.04,
      android: width * 0.04,
    }),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#730d83',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.05,
  },
  modalTitle: {
    fontSize: width * 0.05,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  categoryButton: {
    width: width * 0.22,
    height: width * 0.22,
    backgroundColor: '#FFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.02,
    marginBottom: width * 0.05
  },
  categoryIcon: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  categoryText: {
    marginTop: height * 0.01,
    fontSize: width * 0.03,
    color: '#730d83',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerLine: {
    height: 1,
    backgroundColor: '#E9E9E9',
    width: '100%',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: height * 0.015,
    backgroundColor: '#F5F5F5',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerItemText: {
    fontSize: Platform.select({
      ios: width * 0.03,
      android: width * 0.03,
    }),
    fontFamily: 'Nunito_400Regular',
    color: '#7A7A7A',
    marginTop: 4,
  },
  footerItemTextActive: {
    fontSize: Platform.select({
      ios: width * 0.03,
      android: width * 0.03,
    }),
    fontFamily: 'Nunito_700Bold',
    color: '#730d83',
    marginTop: 4,
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

  //  teste profile 



  profileImage: {
    width: width * 0.3, // Ajusta o tamanho da imagem para 30% da largura da tela
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    backgroundColor: '#E9E9E9',
    resizeMode: 'cover',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#730d83',
    borderRadius: (width * 0.1) / 2, // Metade da largura do ícone para manter arredondado
    width: width * 0.065, // 10% da largura da tela
    height: width * 0.065,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    width: '60%', // Ícone ocupa 60% do contêiner para ajuste automático
    height: '60%',
    resizeMode: 'contain',
  },
  userName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: width * 0.05,
    color: '#1F2024',
    marginTop: 10,
    textAlign: 'center',
  },

  // 

  // 


  imageWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },



  // 

  profileContainer: {
    alignItems: 'center',
    marginVertical: height * 0.03,
  },
  profileImage: {
    width: 100, // Aumenta o tamanho da imagem
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E9E9E9',
    resizeMode: 'cover', // Garante que a imagem preencha 100% do espaço
  },

  menuContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#E9E9E9',
    marginTop: height * 0.02,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderBottomWidth: 1,
    borderColor: '#E9E9E9',
  },
  menuText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: width * 0.04,
    color: '#1F2024',
  },

});


export default ProfileScreen;
