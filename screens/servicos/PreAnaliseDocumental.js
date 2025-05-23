import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, Platform, StatusBar, ActivityIndicator, Image, FlatList } from 'react-native';
import axios from 'axios';
import Svg, { Path, G, Rect, Mask, Ellipse, ClipPath } from 'react-native-svg';
import { useLogScreen } from '../../useLogScreen';
const { width, height } = Dimensions.get('window');

// Função para definir a cor das bolinhas com base no status atual
const getStepColor = (currentStatus, stepStatus) => {
  if (currentStatus > stepStatus) return '#077755'; // Verde para etapas concluídas
  if (currentStatus === stepStatus) return '#730d83'; // Laranja para a etapa atual
  return '#D3D3D3'; // Cinza para etapas futuras
};

// Ícone de seta para voltar
const BackArrowIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z"
      fill="#730d83"
    />
  </Svg>
);


const AnalysisCard = ({ id, date, status, usuario_id, navigation }) => {
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

  const handlePress = () => {
    if (status === 'pendente') {
      navigation.navigate('CadastroAnalise', { usuario_id, analise_id: id, status: 2 });
    } else {
      navigation.navigate('DetalheAnalise', { usuario_id, id });
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };


  return (
    <View style={styles.row}>
      {/* Os inputs de tirar foto */}
      <View style={styles.optionButtonsContainer}>
        <TouchableOpacity style={styles.optionButton}
          onPress={handlePress}
        >
          <Image
            source={require('../../assets/icons/query.png')} // Ícone de "Carregar um arquivo"
            style={styles.optionIcon}
          />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTextTitle} allowFontScaling={false}>Análise de certidões #{id}  </Text>
            <Text style={[styles.optionTextSubtitle, styles.cardStatus(status)]} allowFontScaling={false}>
              {getStatusText(status)}
              <Text style={styles.optionTextSubtitle} allowFontScaling={false}> | {formatDate(date)}</Text>
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PreAnaliseDocumental = ({ route, navigation }) => {
  useLogScreen('PreAnaliseDocumental');
  const { id = null, status = 1, classificacao = '', tipo = '', usuario_id, status_user } = route.params || {};
  const [usuario, setUsuario] = useState({ status_user });
  const [analyses, setAnalyses] = useState([]); // Armazena as análises


  const [loading, setLoading] = useState(false);

  const fetchAnaliseData = async (usuario_id) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://analise2.imogo.com.br/analises/usuario/${usuario_id}`);
      console.log('Resposta da API:', response.data);

      // Atualiza o estado com as análises retornadas
      setAnalyses(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados do imóvel:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario_id) {
      fetchAnaliseData(usuario_id);
    }
  }, [usuario_id]);

  console.log("coe: ", analyses)

  const handleStepNavigation = (step) => {
    if (imovel.status === step.status) {
      navigation.navigate(step.view, {
        etapa: step.label,
        status: step.status,
        id: imovel.id,
        classificacao: imovel.classificacao,
        tipo: imovel.tipo,
        usuario_id: usuario_id,
        status_user: usuario.status_user
      });
    }
  };

  const steps = [
    { label: 'Características', status: 1, view: 'PreCaracteristicasScreen' },
    { label: 'Endereço do imóvel', status: 2, view: 'PreEnderecoScreen' },
    // { label: 'Autorização de venda', status: 3, view: 'AutorizacaoScreen' }
    // ...(status_user < 3 ? [
    //   { label: 'Dados do proprietário', status: 3, view: 'PreDadosProprietario' },
    //   { label: 'Foto do Documento', status: 4, view: 'PreDocumentoScreen' },
    //   { label: 'Selfie do proprietário', status: 5, view: 'PreSelfieScreen' }
    // ] : [])
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#730d83" />
      </View>
    );
  }




  // const analyses = [
  //   { name: 'João Silva', id: '1', date: '18/01/2024', status: 'Concluído' },
  //   { name: 'Maria Oliveira', id: '2', date: '18/01/2024', status: 'Em andamento' },
  //   { name: 'Carlos Souza', id: '3', date: '18/01/2024', status: 'Pendente' },
  // ];



  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
        backgroundColor="#730d83"
        translucent
      />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home', { usuario_id })} style={styles.backButton}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle} allowFontScaling={false}>Análise de certidões </Text>
      </View>

      {/* Linha de separação do header */}
      <View style={styles.headerLine} />

      {/* <Text style={styles.classificacaoText} allowFontScaling={false}>Análises</Text> */}
      <View style={styles.bodyContainer}>

        <ScrollView>
          <View style={styles.container}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                data={analyses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <AnalysisCard
                    id={item.id}
                    date={item.data_analise} // Formata a data diretamente
                    status={item.status_analise} // Status da análise
                    usuario_id={usuario_id}
                    navigation={navigation}
                  />
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.checkboxLabel}>Nenhuma análise encontrada.</Text>
                )}
              />
            )}
          </View>


          <View style={styles.noPropertiesContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CadastroAnalise', { usuario_id, status: 1 })} // Abre o primeiro modal ao clicar no botão
            >
              <Text style={styles.addButtonText} allowFontScaling={false}>+ Solicitar Análise</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerLine: {
    height: 1,
    backgroundColor: '#E9E9E9',
    width: '100%',
    marginBottom: "5%"
  },


  checkboxLabel: {
    textAlign: "center",
    fontSize: 14,
    color: '#7A7A7A',
    marginLeft: 10,
    marginBottom: 10
  },

  // teste 
  row: {
    // marginBottom: 1,
    width: '90%',
    backgroundColor: '#F5F5F5',
    alignSelf: 'center', // Centraliza horizontalmente
    alignItems: 'center', // Centraliza os elementos dentro do componente horizontalmente
    justifyContent: 'center', // Centraliza os elementos dentro do componente verticalmente
  },

  // inputs de upload 

  optionButtonsContainer: {
    width: '100%',
    // marginTop: 20,
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

  cardStatus: (status) => ({
    fontWeight: 'bold',
    color: status === 'concluida' ? '#2E7D32' : status === 'em_progresso' ? '#F9A825' : '#C62828',
  }),

  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    tintColor: '#730d83', // Deixa a cor dos ícones laranja
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
  // Estilos para o modal
  // end test 

  // botão
  bodyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 0, // Remove padding lateral
    marginTop: height * 0.03,
  },
  noPropertiesContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8
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
  // 

  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
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
  backButton: {
    position: 'absolute',
    left: 20,
  },
  classificacaoText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#1F2024',
    marginBottom: 20,
    textAlign: 'center',
    paddingLeft: 20,
  },
  stepsContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  stepLine: {
    position: 'absolute',
    left: 12,
    top: 25,
    height: 40,
    width: 2,
    backgroundColor: '#D3D3D3',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: width * 0.04,
    color: '#1F2024',
  },
});

export default PreAnaliseDocumental;
