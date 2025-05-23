import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';


// Componentes importados
import Welcome from './screens/Welcome';
import Login from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen/SignupScreenSeusDados';
import SignupEmailScreen from './screens/SignupScreen/SignupScreenEmail';
import SurveyScreen from './screens/SignupScreen/SignupScreenQuery';
import SuccessScreen from './screens/SignupScreen/SignupScreenSuccess';
import OneCadastroImovel from './screens/RegisterPropertyScreen/CaracteristicasScreen';
import Home from './screens/HomeScreen';
import CadastroImovel from './screens/RegisterPropertyScreen/CadastroImovelScreen';
import ProfileScreen from './screens/ProfileScreen';
import PreCaracteristicasScreen from './screens/RegisterPropertyScreen/PreCaracteristicasScreen';
import PreEnderecoScreen from './screens/RegisterPropertyScreen/PreEnderecoScreen';
import EnderecoScreen from './screens/RegisterPropertyScreen/EnderecoScreen';
import PreDadosProprietario from './screens/RegisterPropertyScreen/PreDadosProprietarioScreen';
import DadosProprietarioScreen from './screens/RegisterPropertyScreen/DadosProprietarioScreen';
import PreDocumentoScreen from './screens/RegisterPropertyScreen/PreDocumentoScreen';
import TipoFotoScreen from './screens/RegisterPropertyScreen/TipoFotoScreen';
import FotoQRScreen from './screens/RegisterPropertyScreen/FotoQRScreen';
import FotoInteraScreen from './screens/RegisterPropertyScreen/FotoInteraScreen';
import PreSelfieScreen from './screens/RegisterPropertyScreen/PreSelfieScreen';
import SelfieScreen from './screens/RegisterPropertyScreen/SelfieScreen';
import CadastroImovelSuccessScreen from './screens/RegisterPropertyScreen/CadastroImovelSuccessScreen';
import AvaliadorScreen from './screens/AvaliadorScreen';
import ImovelScreen from './screens/ImovelScreen';
import TutorialPWA from './screens/TutorialPWA';

import CadastroCompleto from './screens/RegisterPropertyScreen/CadastroUsuarioScreen';

import PreCompleteCadastroScreen from './screens/RegisterPropertyScreen/PreCompleteCadastro';

import AutorizacaoScreen from './screens/RegisterPropertyScreen/AutorizacaoScreen';

import CadastroUsuarioSuccessScreen from './screens/RegisterPropertyScreen/CadastroUsuarioSuccessScreen';

// teste 

import HomeServicos from './screens/HomeServicos'
import PreAnaliseDocumental from './screens/servicos/PreAnaliseDocumental';
import QuadraCred from './screens/servicos/quadracred';
import BaixarSimulacao from './screens/servicos/baixarAnaliseDeCredito';

import CadastroAnalise from './screens/servicos/novaAnalise';

// Planejamento de redes sociais

import PlanejamentoRedes from './screens/planejamento';

//  cadastro analise e1 

import OneCadastroAnalise from './screens/servicos/oneCadastroAnalise';
import TwoCadastroAnalise from './screens/servicos/twoCadastroAnalise';
import AnaliseSuccessScreen from './screens/servicos/AnaliseSuccessScreen';

import RecoverPasswordScreen from './screens/newSenha';
import SuccessScreenNewSenha from './screens/newSenhaSuccess';

import DetalheAnalise from './screens/servicos/DetalheAnalise';

import EditProfile from './screens/edit_profile';
import TrilhaDoConhecimento from './screens/trilha';
import CelerView from './screens/Celer';
import MeusProjetos from './screens/MeusProjetos';
import GeradorContratos from './screens/servicos/GeradorContratos';
import AutorizacaoDeVenda from './screens/servicos/AutorizacaoDeVenda';
import BaixarDocumento from './screens/servicos/baixarDoc';
// 
import EtapasCorretagem from './screens/servicos/contrato_de_corretagem/etapas_corretagem';
import DadosContratante from './screens/servicos/contrato_de_corretagem/dados_contratante';
import DadosContratados from './screens/servicos/contrato_de_corretagem/dados_contratados_corretores';
import DadosTestemunhas from './screens/servicos/contrato_de_corretagem/dados_testemunhas';
import DadosImovel from './screens/servicos/contrato_de_corretagem/dados_imovel';

//
import BoletoParcelado from './screens/BoletoParcelado';
import imobCorretor from './screens/servicos/declaracao_visita/imobCorretor';
import visitantePesquisa from './screens/servicos/declaracao_visita/visitantePesquisa';
import docAssinatura from './screens/servicos/declaracao_visita/docAssinatura';
import webViewAssinatura from './screens/servicos/declaracao_visita/webview';
import EtapasPromessa from './screens/servicos/promessa_de_compra_e_venda/etapas_promessa';
import DadosVendedores from './screens/servicos/promessa_de_compra_e_venda/dados_vendedores';
import DadosComprador from './screens/servicos/promessa_de_compra_e_venda/dados_comprador';
import DadosImovelPromessa from './screens/servicos/promessa_de_compra_e_venda/dados_imovel';
import DadosNegociacao from './screens/servicos/promessa_de_compra_e_venda/dados_negociacao';

// PC =====================================================================
import WelcomeWeb from './web/Welcome';
// import LoginWeb from './web/LoginWeb';
// import RegisterWeb from './web/RegisterWeb';
// import RecoverPasswordWeb from './web/RecoverPasswordWeb';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null); // Estado para armazenar a rota inicial
  const [usuario_id, setusuario_id] = useState(null); // Estado para armazenar o usuario_id

  // Carregamento das fontes
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  useEffect(() => {
    // Verifica se o usuário já fez login
    const checkLoginStatus = async () => {
      try {
        const storedusuario_id = await AsyncStorage.getItem('usuario_id'); // Pega o usuario_id salvo no AsyncStorage
        if (storedusuario_id) {
          setusuario_id(storedusuario_id); // Armazena o usuario_id no estado
          setInitialRoute('Home'); // Define a rota inicial como Home
        } else {
          setInitialRoute('TutorialPWA'); // Redireciona para Welcome se o usuario_id não existir
        }
      } catch (error) {
        console.error('Erro ao verificar o status de login:', error);
        setInitialRoute('Welcome'); // Em caso de erro, redireciona para Welcome
      }
    };

    checkLoginStatus(); // Executa a verificação ao carregar o app    

    // Adiciona o script do Google Analytics ao <head>
    const injectGoogleTag = () => {
      // Script principal (gtag.js)
      const gtagScript = document.createElement('script');
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-RDLMXJHGWC';
      gtagScript.async = true;

      // Script de configuração do Google Analytics
      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-RDLMXJHGWC');
    `;

      // Adiciona os scripts ao <head>
      document.head.appendChild(gtagScript);
      document.head.appendChild(inlineScript);
    };

    if (typeof document !== 'undefined') {
      injectGoogleTag();
    }
  }, []);

  // Enquanto as fontes ou o estado inicial estiverem sendo verificados, exiba um indicador de carregamento
  if (!fontsLoaded || !initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#730d83" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Configuração global da StatusBar */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Stack.Navigator initialRouteName={initialRoute}>

        {/* PC ================================================= */}
        <Stack.Screen name='WelcomeWeb' component={WelcomeWeb} options={{ headerShown: false }} />
        <Stack.Screen name='LoginWeb' component={LoginWeb} options={{ headerShown: false }} />
        <Stack.Screen name='RegisterWeb' component={RegisterWeb} options={{ headerShown: false }} />
        <Stack.Screen name='RecoverPasswordWeb' component={RecoverPasswordWeb} options={{ headerShown: false }} />
        {/* PC ================================================= */}
        <Stack.Screen
          name="TutorialPWA"
          component={TutorialPWA}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Singup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignupEmailScreen" component={SignupEmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SurveyScreen' component={SurveyScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SuccessScreen' component={SuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen
          name='Home'
          component={HomeServicos} // DetalheAnalise
          options={{ headerShown: false }}
          initialParams={{ usuario_id }} // Passa o usuario_id como parâmetro inicial para a Home
        />
        <Stack.Screen name='CadastroImovel' component={CadastroImovel} options={{ headerShown: false }} />
        <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name='PreCaracteristicasScreen' component={PreCaracteristicasScreen} options={{ headerShown: false }} />
        <Stack.Screen name='OneCadastroImovel' component={OneCadastroImovel} options={{ headerShown: false }} />
        <Stack.Screen name='PreEnderecoScreen' component={PreEnderecoScreen} options={{ headerShown: false }} />
        <Stack.Screen name='EnderecoScreen' component={EnderecoScreen} options={{ headerShown: false }} />
        <Stack.Screen name='PreDadosProprietario' component={PreDadosProprietario} options={{ headerShown: false }} />
        <Stack.Screen name='DadosProprietario' component={DadosProprietarioScreen} options={{ headerShown: false }} />
        <Stack.Screen name='PreDocumentoScreen' component={PreDocumentoScreen} options={{ headerShown: false }} />
        <Stack.Screen name='TipoFotoScreen' component={TipoFotoScreen} options={{ headerShown: false }} />
        <Stack.Screen name='FotoQRScreen' component={FotoQRScreen} options={{ headerShown: false }} />
        <Stack.Screen name='FotoInteraScreen' component={FotoInteraScreen} options={{ headerShown: false }} />
        <Stack.Screen name='PreSelfieScreen' component={PreSelfieScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SelfieScreen' component={SelfieScreen} options={{ headerShown: false }} />
        <Stack.Screen name='CadastroImovelSuccessScreen' component={CadastroImovelSuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name='AvaliadorScreen' component={AvaliadorScreen} options={{ headerShown: false }} />
        <Stack.Screen name='ImovelScreen' component={ImovelScreen} options={{ headerShown: false }} />

        <Stack.Screen name='PreCompleteCadastroScreen' component={PreCompleteCadastroScreen} options={{ headerShown: false }} />
        <Stack.Screen name='CadastroCompleto' component={CadastroCompleto} options={{ headerShown: false }} />

        <Stack.Screen name='AutorizacaoScreen' component={AutorizacaoScreen} options={{ headerShown: false }} />

        <Stack.Screen name='CadastroUsuarioSuccessScreen' component={CadastroUsuarioSuccessScreen} options={{ headerShown: false }} />
        {/* novo modelo de negocio */}
        <Stack.Screen name='PreAnaliseDocumental' component={PreAnaliseDocumental} options={{ headerShown: false }} />
        <Stack.Screen name='QuadraCred' component={QuadraCred} options={{ headerShown: false }} />
        <Stack.Screen name='BaixarSimulacao' component={BaixarSimulacao} options={{ headerShown: false }} />
        <Stack.Screen name='CadastroAnalise' component={CadastroAnalise} options={{ headerShown: false }} />
        {/* planejamento de redes  */}
        <Stack.Screen name='PlanejamentoRedes' component={PlanejamentoRedes} options={{ headerShown: false }} />
        {/* OneCadastroAnalise */}
        <Stack.Screen name='OneCadastroAnalise' component={OneCadastroAnalise} options={{ headerShown: false }} />
        <Stack.Screen name='TwoCadastroAnalise' component={TwoCadastroAnalise} options={{ headerShown: false }} />
        <Stack.Screen name='AnaliseSuccessScreen' component={AnaliseSuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SuccessScreenNewSenha' component={SuccessScreenNewSenha} options={{ headerShown: false }} />
        <Stack.Screen name='RecoverPasswordScreen' component={RecoverPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name='DetalheAnalise' component={DetalheAnalise} options={{ headerShown: false }} />
        <Stack.Screen name='EditProfile' component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name='TrilhaDoConhecimento' component={TrilhaDoConhecimento} options={{ headerShown: false }} />
        <Stack.Screen name='CelerView' component={CelerView} options={{ headerShown: false }} />
        <Stack.Screen name='MeusProjetos' component={MeusProjetos} options={{ headerShown: false }} />
        <Stack.Screen name='GeradorContratos' component={GeradorContratos} options={{ headerShown: false }} />
        <Stack.Screen name='AutorizacaoDeVenda' component={AutorizacaoDeVenda} options={{ headerShown: false }} />
        <Stack.Screen name='BaixarDocumento' component={BaixarDocumento} options={{ headerShown: false }} />
        <Stack.Screen name='EtapasCorretagem' component={EtapasCorretagem} options={{ headerShown: false }} />
        <Stack.Screen name='DadosContratante' component={DadosContratante} options={{ headerShown: false }} />
        <Stack.Screen name='DadosContratados' component={DadosContratados} options={{ headerShown: false }} />
        <Stack.Screen name='DadosTestemunhas' component={DadosTestemunhas} options={{ headerShown: false }} />
        <Stack.Screen name='DadosImovel' component={DadosImovel} options={{ headerShown: false }} />
        <Stack.Screen name='BoletoParcelado' component={BoletoParcelado} options={{ headerShown: false }} />
        <Stack.Screen name='imobCorretor' component={imobCorretor} options={{ headerShown: false }} />
        <Stack.Screen name='visitantePesquisa' component={visitantePesquisa} options={{ headerShown: false }} />
        <Stack.Screen name='webViewAssinatura' component={webViewAssinatura} options={{ headerShown: false }} />
        <Stack.Screen name='docAssinatura' component={docAssinatura} options={{ headerShown: false }} />
        <Stack.Screen name='EtapasPromessa' component={EtapasPromessa} options={{ headerShown: false }} />
        <Stack.Screen name='DadosVendedores' component={DadosVendedores} options={{ headerShown: false }} />
        <Stack.Screen name='DadosComprador' component={DadosComprador} options={{ headerShown: false }} />
        <Stack.Screen name='DadosImovelPromessa' component={DadosImovelPromessa} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
