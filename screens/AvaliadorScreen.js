import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { WebView } from 'react-native-webview';
import { useLogScreen } from '../useLogScreen';
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

const AvaliadorScreen = ({ route, navigation }) => {
  useLogScreen('AvaliadorDIL');
  const { usuario_id } = route.params || {};
  const [loading, setLoading] = useState(true);

  // Função para renderizar o iframe na web
  const renderWebContent = () => (
    <iframe
      src="https://avaliador.imogo.com.br/avaliacao"
      style={styles.iframe}
      onLoad={() => setLoading(false)}
      title="Precificador"
    />
  );

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
        <Text style={styles.headerTitle} allowFontScaling={false}>Precificador</Text>
      </View>

      {/* Exibe o loading enquanto o iframe ou WebView não carrega */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#730d83" />
        </View>
      )}

      {/* Condicional para diferenciar o uso do WebView no mobile e iframe na web */}
      {Platform.OS === 'web' ? renderWebContent() : (
        <WebView
          source={{ uri: 'https://imogo.online/avaliacao' }}
          style={[styles.webview, { display: loading ? 'none' : 'flex' }]} // Oculta WebView enquanto carrega
          onLoadEnd={() => setLoading(false)} // Define loading como false quando a página termina de carregar
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  headerTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#1F2024',
    textAlign: 'center',
  },
  webview: {
    flex: 1,
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    zIndex: 1,
  },
});

export default AvaliadorScreen;
