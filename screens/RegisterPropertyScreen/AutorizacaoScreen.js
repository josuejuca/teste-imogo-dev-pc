import React, { useEffect, useState } from 'react';
import {
    Alert,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Platform,
    CheckBox,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Dimensions } from 'react-native';
import axios from 'axios';

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

const AutorizacaoScreen = ({ route, navigation }) => {
    const { id, usuario_id } = route.params || {};
    const [imovel, setImovel] = useState({});
    const [usuario, setUsuario] = useState({});
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    const [imovelData, setImovelData] = useState(null);

    const fetchImovelData = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.imogo.com.br/api/v1/imoveis/${id}`);
            console.log("Resposta da API", response);
            setImovel(response.data);
        } catch (error) {
            console.error('Erro ao buscar os dados do imóvel:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsuarioData = async (usuarioId) => {
        try {
            const response = await axios.get(`https://api.imogo.com.br/api/v1/usuarios/${usuarioId}`);
            setUsuario(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Erro ao buscar os dados do usuário:', error);
        }
    };

    useEffect(() => {
        if (id) fetchImovelData(id);
        if (usuario_id) fetchUsuarioData(usuario_id);
    }, [id, usuario_id]);

    useEffect(() => {
        if (imovel.inscricao_iptu) {
            fetchImovelInfo(imovel.inscricao_iptu);
        }
    }, [imovel.inscricao_iptu]);

    const handleAccept = async () => {
        if (!isChecked) {
            Alert.alert('Erro', 'Por favor, aceite os termos para prosseguir.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`https://api.imogo.com.br/api/v1/imoveis/${id}/autorizacao-de-venda`);
            if (response.status === 200) {
                navigation.navigate('CadastroImovelSuccessScreen', { usuario_id });
            } else {
                throw new Error(`Erro: Código de status ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao autorizar a venda:', error.response ? error.response.data : error.message);
            Alert.alert("Erro", "Não foi possível completar a autorização. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const fetchImovelInfo = async (iptu) => {
        console.log(iptu);
        if (!iptu) {
            console.log("Erro", "Por favor, insira o número de inscrição do IPTU.");
            return;
        }

        console.log("Iniciando a busca pelo imóvel...");

        try {
            const response = await axios.post('https://fichacadastral.vercel.app/consulta-imovel/', {
                InscricaoImovel: iptu,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            console.log("Resposta da API:", response.data);

            if (response.data.status === "sucesso") {
                setImovelData(response.data.dados);
                Alert.alert("Sucesso", "Dados do imóvel carregados com sucesso.");
            } else {
                Alert.alert("Erro", "Não foi possível carregar os dados do imóvel.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados do imóvel:", error);
            Alert.alert("Erro", "Ocorreu um erro ao buscar os dados do imóvel.");
        }
    };

    // Data dinamica 

    // Obtenha a data atual
    const currentDate = new Date();

    // Array com os nomes dos meses para facilitar a conversão
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Formate a data atual
    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const formattedDate = `Brasília/DF, ${day} de ${month} de ${year}`;

    // valor 
    const formatarValorBR = (valor) => {
        if (typeof valor !== 'number') {
            valor = Number(valor);
        }

        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Exemplo de uso:
    const valorFormatado = formatarValorBR(imovel.valor_venda);
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Autorização de venda</Text>
            </View>

            <Text style={styles.titleText}>AUTORIZAÇÃO PARA DIVULGAÇÃO E INTERMEDIAÇÃO DE VENDA DE IMÓVEL </Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Text style={styles.text}>
                    CONDIÇÕES GERAIS:
                    {"\n\n"}1. O CONTRATANTE {usuario.nome_completo || ''}, inscrito no CPF sob o nº {usuario.cpf || ''}, autoriza a intermediadora CONTRATADA imoGo, inscrita no CNPJ sob o nº 50.509.002/0001-89 e no CRECI/DF sob o nº 30152, bem como os corretores parceiros, a divulgar(em) e promover(em), sem exclusividade, a venda do imóvel registrado no cartório  {imovelData?.CartorioRegistroImoveis || 'Não informado'} do DF, sob matrícula número  {imovelData?.Matricula || 'Não informado'}, pelo valor de {valorFormatado}.
                    {"\n\n"}2. O CONTRATANTE autoriza o pagamento integral da(s) comissão(ões) de corretagem pelo COMPRADOR do imóvel, estabelecida em 5% (cinco por cento) do valor pelo qual o imóvel vir a ser comercializado, no momento da assinatura do contrato de promessa de compra e venda, descontado do sinal a ser recebido pelo CONTRATANTE, sendo certo que a(s) comissão(ões) somente será(ão) devida(s) caso o imóvel seja vendido para algum Cliente/Comprador apresentado pela CONTRATADA, conforme registro de visita realizada no imóvel.
                    {"\n\n"}3. O CONTRATANTE concorda que a tratativa referente à negociação se dará por meio do Aplicativo da CONTRATADA e se compromete a utilizá-lo para comunicação, acompanhamento e colaboração com os procedimentos necessários para a conclusão do negócio.
                    {"\n\n"}4. O CONTRATANTE poderá cancelar esta Autorização a qualquer tempo, sem ônus para ambas as partes, mediante configuração de conta do Aplicativo. Todavia, o pagamento integral da(s) comissão(ões) de corretagem será(ão) devida(s) em qualquer tempo, caso o Cliente/Comprador tenha sido apresentado pela CONTRATADA, conforme registro de visita realizada no imóvel.
                    {"\n\n"}5. O CONTRATANTE declara que o imóvel se encontra livre e desembaraçado de todos e quaisquer ônus judicial, extrajudicial, hipoteca legal ou convencional, foro ou pensão e está quite com todos os impostos, taxas, inclusive contribuições condominiais, se houver, até a presente data, sem exceção.
                    {"\n\n"}6. O CONTRATANTE autoriza a CONTRATADA a fotografar o imóvel objeto desta autorização para anunciar a sua venda nos veículos de comunicação que julgar convenientes, bem como agendar as visitas dos potenciais compradores acompanhados do corretor responsável pelo imóvel ou outro(s) que represente(m) a CONTRATADA, visitas estas se compromete a acompanhar, especialmente se não houver um corretor responsável pelo seu imóvel junto à plataforma da CONTRATADA.
                    {"\n\n"}7. Por ser de fácil acesso e comum conveniência, o foro competente para as eventuais questões ou dúvidas decorrentes da presente avença é o do endereço do imóvel.
                </Text>

                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? '#730d83' : undefined}
                    />
                    <Text style={styles.checkboxLabel}>Firmo a presente autorização para que produza os devidos efeitos jurídicos.</Text>
                </View>
                <Text style={styles.text}>{formattedDate}</Text>

                <TouchableOpacity
                    style={[styles.acceptButton, !isChecked && styles.disabledButton]}
                    onPress={handleAccept}
                    disabled={!isChecked}
                >
                    <Text style={styles.acceptButtonText}>Aceito</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = {
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    backButton: {
        position: 'absolute',
        left: 20,
    },
    headerTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#1F2024',
        textAlign: 'center',
    },
    scrollContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    titleText: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#1F2024',
        textAlign: 'center',
        marginBottom: 20,
    },
    text: {
        fontSize: 14,
        color: '#494A50',
        marginBottom: 20,
        textAlign: 'justify',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 14,
        color: '#7A7A7A',
    },
    acceptButton: {
        backgroundColor: '#730d83',
        paddingVertical: 15,
        paddingHorizontal: width * 0.2,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    acceptButtonText: {
        color: '#F5F5F5',
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.04 }),
        fontWeight: '600',
    },
};

export default AutorizacaoScreen;
