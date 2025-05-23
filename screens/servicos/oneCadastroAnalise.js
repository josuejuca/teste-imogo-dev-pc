import React, { useState, useRef } from 'react';
import {
  Alert,
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import MaskInput, { Masks } from 'react-native-mask-input'; // Para aplicar máscara no CPF
import Svg, { Path } from 'react-native-svg';
const { width, height } = Dimensions.get('window');
import { useLogScreen } from '../../useLogScreen';
import { TextInputMask } from 'react-native-masked-text';
// Ícone de seta para voltar
const BackArrowIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z"
      fill="#730d83"
    />
  </Svg>
);

const OneCadastroAnalise = ({ route, navigation }) => {
  useLogScreen('OneCadastroAnalise');
  const { id, classificacao = '', tipo = '', usuario_id, status, status_user } = route.params || {};


  // envio unico 

  const [isSubmitting, setIsSubmitting] = useState(false);



  // teste multi forms

  const [proprietarios, setProprietarios] = useState([
    {
      nomeCompleto: '', nomeCompletoMae: '', cpf: '', dataNascimento: '', estadoCivil: '',
      conjuge: {
        nomeCompletoCng: '',
        nomeCompletoMaeCng: '',
        cpfCng: '',
        dataNascimentoCng: '',
      },
    },
  ]);


  const adicionarProprietario = () => {
    setProprietarios([...proprietarios, {
      nomeCompleto: '', nomeCompletoMae: '', cpf: '', dataNascimento: '', estadoCivil: '',
      conjuge: {
        nomeCompletoCng: '',
        nomeCompletoMaeCng: '',
        cpfCng: '',
        dataNascimentoCng: '',
      },
    }]);
  };

  const atualizarProprietario = (index, campo, valor, subcampo = null) => {
    const novosProprietarios = [...proprietarios];
    if (subcampo) {
      novosProprietarios[index][campo][subcampo] = valor; // Atualiza subcampo (cônjuge)
    } else {
      novosProprietarios[index][campo] = valor; // Atualiza campo principal
    }
    setProprietarios(novosProprietarios);
  };
  // end teste 

  // Referências para os inputs
  const nomeCompletoRef = useRef([]);
  const nomeCompletoMaeRef = useRef([]);
  const cpfRef = useRef([]);
  const dataNascimentoRef = useRef([]);

  // Estado dos campos
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeCompletoMae, setNomeCompletoMae] = useState('');
  const [cpf, setCpf] = useState('');

  const nomeCompletoCngRef = useRef([]);
  const nomeCompletoMaeCngRef = useRef([]);
  const cpfCngRef = useRef([]);
  const dataNascimentoCngRef = useRef([]);


  // muie 

  const [nomeCompletoCng, setNomeCompletoCng] = useState('');
  const [nomeCompletoMaeCng, setNomeCompletoMaeCng] = useState('');
  const [cpfCng, setCpfCng] = useState('');


  const [estadoCivil, setEstadoCivil] = useState('');
  const [dataNascimento, setdataNascimento] = useState('');
  const [dataNascimentoCng, setdataNascimentoCng] = useState('');


  const dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];


  const [showEstadoCivilOptions, setShowEstadoCivilOptions] = useState(
    proprietarios.map(() => false)
  );

  const estadoCivilOptions = ['solteiro', 'casado', 'viúvo', 'divorciado', 'separado'];

  // Função para selecionar uma opção e fechar a lista  

  const toggleEstadoCivilOptions = (index) => {
    const updatedOptions = [...showEstadoCivilOptions];
    updatedOptions[index] = !updatedOptions[index];
    setShowEstadoCivilOptions(updatedOptions);
  };

  const selectEstadoCivil = (index, option) => {
    atualizarProprietario(index, 'estadoCivil', option); // Atualiza o estado civil no proprietário
    toggleEstadoCivilOptions(index); // Fecha a lista de opções
  };

  // data format 

  const convertDateToISO = (dateString) => {
    // Verifica se a data é uma data 
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      throw new Error("Data inválida. O formato esperado é DD/MM/YYYY.");
    }

    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  // Validação para habilitar o botão "Salvar"
  // const isFormValid = () => nomeCompleto && proprietarios.cpf && estadoCivil && dataNascimento;

  const isFormValid = () => {
    return proprietarios.every((p) =>
      p.nomeCompleto &&
      p.cpf &&
      p.nomeCompletoMae &&
      p.dataNascimento &&
      p.estadoCivil &&
      (p.estadoCivil.toLowerCase() !== 'casado' || (
        p.conjuge.nomeCompletoCng &&
        p.conjuge.nomeCompletoMaeCng &&
        p.conjuge.cpfCng &&
        p.conjuge.dataNascimentoCng
      ))
    );
  };

  const handleSaveImovel = async () => {

    if (isSubmitting) return; // Previne múltiplos cliques
    setIsSubmitting(true);


    if (proprietarios.some((p) => !p.nomeCompleto || !p.cpf || !p.estadoCivil || !p.dataNascimento)) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios para todos os proprietários.');
      return;
    }

    try {
      const dadosFormatados = proprietarios.map((p) => {
        const proprietario = {
          nome_completo: p.nomeCompleto,
          nome_mae: p.nomeCompletoMae,
          cpf: p.cpf,
          data_nascimento: convertDateToISO(p.dataNascimento),
          estado_civil: p.estadoCivil,
        };

        // Adiciona os dados do cônjuge apenas se o estado civil for "Casado"
        if (p.estadoCivil.toLowerCase() === 'casado') {
          proprietario.conjuge = {
            nome_completo: p.conjuge.nomeCompletoCng,
            nome_mae: p.conjuge.nomeCompletoMaeCng,
            cpf: p.conjuge.cpfCng,
            data_nascimento: convertDateToISO(p.conjuge.dataNascimentoCng),
          };
        }

        return proprietario;
      });

      console.log(dadosFormatados);

      const response = await axios.post('https://analise2.imogo.com.br/analises/etapa1/', {
        usuario_id,
        proprietarios: dadosFormatados,
      });

      console.log("Resposta da API:", response.data);

      if (response.status === 200) {
        console.log("Dados enviados com sucesso")
        const { analise_id } = response.data;
        navigation.navigate('CadastroAnalise', { usuario_id, analise_id, status: 2 });
      } else {
        throw new Error(`Erro: Código de status ${response.status}`);
      }
      // Alert.alert('Sucesso', 'Dados enviados com sucesso!');
    } catch (error) {

      const dadosFormatados = proprietarios.map((p) => {
        const proprietario = {
          nome_completo: p.nomeCompleto,
          nome_mae: p.nomeCompletoMae,
          cpf: p.cpf,
          data_nascimento: convertDateToISO(p.dataNascimento),
          estado_civil: p.estadoCivil,
        };

        // Adiciona os dados do cônjuge apenas se o estado civil for "Casado"
        if (p.estadoCivil.toLowerCase() === 'casado') {
          proprietario.conjuge = {
            nome_completo: p.conjuge.nomeCompletoCng,
            nome_mae: p.conjuge.nomeCompletoMaeCng,
            cpf: p.conjuge.cpfCng,
            data_nascimento: convertDateToISO(p.conjuge.dataNascimentoCng),
          };
        }

        return proprietario;
      });

      console.log("payload: ", dadosFormatados);

      console.error("Erro ao enviar dados:", error);
      Alert.alert('Erro', 'Não foi possível enviar os dados.');
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Dados do proprietário
        </Text>
      </View>
      <Text style={styles.classificacaoText} allowFontScaling={false}>
        Dados do proprietário
      </Text>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
              {/* Nome Completo */}
              {proprietarios.map((proprietario, index) => (
                <View key={index} style={styles.proprietarioContainer}>

                  <View style={styles.row}>
                    <Text style={styles.subLabel} allowFontScaling={false}>Nome Completo</Text>
                    <TouchableWithoutFeedback onPress={() => nomeCompletoRef.current[index]?.focus()}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          ref={(ref) => nomeCompletoRef.current[index] = ref} // Configurando o ref dinâmico
                          allowFontScaling={false}
                          style={styles.areaInput}
                          placeholder="Nome Completo"
                          value={proprietario.nomeCompleto}
                          placeholderTextColor="#A9A9A9"
                          onChangeText={(text) => atualizarProprietario(index, 'nomeCompleto', text)}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  {/* Nome Completo Mae */}
                  <View style={styles.row}>
                    <Text style={styles.subLabel} allowFontScaling={false}>Nome da Mãe</Text>
                    <TouchableWithoutFeedback onPress={() => nomeCompletoMaeRef.current[index]?.focus()}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          ref={(ref) => nomeCompletoMaeRef.current[index] = ref} // Configurando o ref dinâmico
                          allowFontScaling={false}
                          style={styles.areaInput}
                          placeholder="Nome da Mãe"
                          value={proprietario.nomeCompletoMae}
                          placeholderTextColor="#A9A9A9"
                          onChangeText={(text) => atualizarProprietario(index, 'nomeCompletoMae', text)}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                  {/* CPF com máscara */}
                  <View style={styles.row}>
                    <Text style={styles.subLabel} allowFontScaling={false}>CPF</Text>
                    <TouchableWithoutFeedback onPress={() => cpfRef.current[index]?.focus()}>
                      <View style={styles.inputContainer}>
                        <MaskInput
                          ref={(ref) => cpfRef.current[index] = ref}
                          allowFontScaling={false}
                          style={styles.areaInput}
                          value={proprietario.cpf}
                          onChangeText={(text) => atualizarProprietario(index, 'cpf', text)}
                          mask={Masks.BRL_CPF}
                          placeholderTextColor="#A9A9A9"
                          keyboardType="numeric"
                          placeholder="000.000.000-00"
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  {/* data  com máscara */}
                  <View style={styles.row}>
                    <Text style={styles.subLabel} allowFontScaling={false}>Data de nascimento</Text>
                    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                      <TouchableWithoutFeedback onPress={() => dataNascimentoRef.current[index]?.focus()}>
                        <View style={styles.inputContainer}>
                          <MaskInput
                            ref={(ref) => {
                              dataNascimentoRef.current[index] = ref; // Configura o ref dinâmico para o índice atual
                            }}
                            allowFontScaling={false}
                            style={styles.areaInput}
                            value={proprietario.dataNascimento}
                            mask={dateMask}
                            onChangeText={(text) => atualizarProprietario(index, 'dataNascimento', text)} // Corrigido o campo
                            placeholderTextColor="#A9A9A9"
                            keyboardType="numeric"
                            placeholder="00/00/0000"
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                  </View>


                  {/* Estado Civil */}
                  <View style={styles.row}>
                    <Text style={styles.subLabel} allowFontScaling={false}>Estado Civil</Text>
                    <TouchableWithoutFeedback onPress={() => toggleEstadoCivilOptions(index)}>
                      <View style={styles.inputContainer}>
                        <Text allowFontScaling={false} style={styles.areaInput}>
                          {proprietario.estadoCivil || 'Selecionar'}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                    {showEstadoCivilOptions[index] && (
                      <View style={styles.optionsContainer}>
                        {estadoCivilOptions.map((option) => (
                          <TouchableOpacity
                            key={option}
                            style={styles.optionItem}
                            onPress={() => selectEstadoCivil(index, option)} // Passa o índice e a opção selecionada
                          >
                            <Text style={styles.optionText}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Campos do cônjuge */}
                  {proprietario.estadoCivil === 'casado' && (
                    <>
                      <View style={styles.row}>
                        <Text style={styles.subLabel} allowFontScaling={false}>Nome do Cônjuge</Text>
                        <TouchableWithoutFeedback onPress={() => nomeCompletoCngRef.current[index]?.focus()}>
                          <View style={styles.inputContainer}>
                            <TextInput
                              ref={(ref) => {
                                if (!nomeCompletoCngRef.current[index]) {
                                  nomeCompletoCngRef.current[index] = {};
                                }
                                nomeCompletoCngRef.current[index] = ref; // Configura o ref dinâmico para o índice atual
                              }}
                              allowFontScaling={false}
                              style={styles.areaInput}
                              placeholder="Nome do Cônjuge"
                              value={proprietario.conjuge.nomeCompletoCng}
                              placeholderTextColor="#A9A9A9"
                              onChangeText={(text) => atualizarProprietario(index, 'conjuge', text, 'nomeCompletoCng')}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                      {/* nome mae  */}
                      <View style={styles.row}>
                        <Text style={styles.subLabel} allowFontScaling={false}>Nome da mãe do Cônjuge</Text>
                        <TouchableWithoutFeedback onPress={() => nomeCompletoMaeCngRef.current[index]?.focus()}>
                          <View style={styles.inputContainer}>
                            <TextInput
                              ref={(ref) => {
                                if (!nomeCompletoMaeCngRef.current[index]) {
                                  nomeCompletoMaeCngRef.current[index] = {};
                                }
                                nomeCompletoMaeCngRef.current[index] = ref; // Configura o ref dinâmico para o índice atual
                              }}
                              allowFontScaling={false}
                              style={styles.areaInput}
                              placeholder="Nome do Cônjuge"
                              value={proprietario.conjuge.nomeCompletoMaeCng}
                              placeholderTextColor="#A9A9A9"
                              onChangeText={(text) => atualizarProprietario(index, 'conjuge', text, 'nomeCompletoMaeCng')}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                      {/* cpf */}
                      <View style={styles.row}>
                        <Text style={styles.subLabel} allowFontScaling={false}>CPF do Cônjuge</Text>
                        <TouchableWithoutFeedback onPress={() => cpfCngRef.current[index]?.focus()}>
                          <View style={styles.inputContainer}>
                            <MaskInput
                              ref={(ref) => {
                                if (!cpfCngRef.current[index]) {
                                  cpfCngRef.current[index] = {};
                                }
                                cpfCngRef.current[index] = ref; // Configura o ref dinâmico para o índice atual
                              }}
                              allowFontScaling={false}
                              style={styles.areaInput}
                              value={proprietario.conjuge.cpfCng}
                              onChangeText={(text) => atualizarProprietario(index, 'conjuge', text, 'cpfCng')}
                              mask={Masks.BRL_CPF}
                              placeholderTextColor="#A9A9A9"
                              keyboardType="numeric"
                              placeholder="000.000.000-00"
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                      {/* data */}
                      <View style={styles.row}>
                        <Text style={styles.subLabel} allowFontScaling={false}>Data de Nascimento do Cônjuge</Text>
                        <TouchableWithoutFeedback onPress={() => dataNascimentoCngRef.current[index]?.focus()}>
                          <View style={styles.inputContainer}>
                            <MaskInput
                              ref={(ref) => {
                                if (!dataNascimentoCngRef.current[index]) {
                                  dataNascimentoCngRef.current[index] = {};
                                }
                                dataNascimentoCngRef.current[index] = ref; // Configura o ref dinâmico para o índice atual
                              }}
                              allowFontScaling={false}
                              style={styles.areaInput}
                              value={proprietario.conjuge.dataNascimentoCng}
                              onChangeText={(text) => atualizarProprietario(index, 'conjuge', text, 'dataNascimentoCng')}
                              mask={dateMask}
                              placeholderTextColor="#A9A9A9"
                              keyboardType="numeric"
                              placeholder="00/00/0000"
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>


                    </>
                  )}

                  {/* Separador visual (Divisão) */}
                  <View style={styles.divider} />


                </View>
              ))}


              <TouchableOpacity style={styles.laterButton} onPress={adicionarProprietario}>
                <Text style={styles.laterButtonText}>Adicionar mais proprietário</Text>
              </TouchableOpacity>
              {/* Botão Salvar */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    (!isFormValid() || isSubmitting) && { backgroundColor: '#ccc' },
                  ]}
                  onPress={handleSaveImovel}
                  disabled={!isFormValid() || isSubmitting} // Desabilita durante a submissão
                >
                  <Text style={styles.saveButtonText} allowFontScaling={false}>
                    {isSubmitting ? "Enviando..." : "Salvar"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.laterButton}>
                  <Image
                    source={require('../../assets/icons/bookmark.png')} // Ícone de terminar mais tarde
                    style={styles.laterIcon}
                  />
                  <Text
                    style={styles.laterButtonText}
                    allowFontScaling={false}
                    onPress={() => navigation.navigate('Home', { usuario_id })}
                  >
                    Terminar mais tarde
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
    textAlign: 'left',
    paddingLeft: 20,
  },
  stepsContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
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
  subLabel: {
    fontSize: Platform.select({ ios: width * 0.037, android: width * 0.035 }),
    fontWeight: '600',
    color: '#1F2024',
    marginBottom: 10,
  },
  titleLabel: {
    fontSize: Platform.select({ ios: width * 0.057, android: width * 0.055 }),
    fontWeight: '600',
    color: '#1F2024',
    marginBottom: 10,
  },
  orientacaoText: {
    fontSize: Platform.select({ ios: width * 0.033, android: width * 0.035 }),
  },
  optionGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionGroupSuite: {
    marginLeft: Platform.select({ ios: width * -0.01, android: width * 0.01 }),
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'start',
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
  selectedOption: {
    backgroundColor: '#730d83',
    borderColor: '#730d83',
  },
  optionText: {
    fontSize: width * 0.029,
    color: '#494A50',
  },
  selectedOptionText: {
    color: '#FFF',
  },
  suitesGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: Platform.select({ ios: -10, android: 10 }),
    marginTop: 10,
  },
  suitesNumberContainer: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  suitesText: {
    fontSize: width * 0.04,
    color: '#1F2024',
    textAlign: 'center',
  },
  incrementDecrementButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: 44,
    height: 44,
  },
  incrementDecrementButtonText: {
    fontSize: 20,
    color: '#494A50',
  },
  orientationGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  orientationButton: {
    borderRadius: 25,
    backgroundColor: '#E9E9E9',
    padding: 10,
    alignItems: 'center',
    width: '30%',
  },
  selectedOptionOrientation: {
    backgroundColor: '#730d83',
  },
  areaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10
  },
  areaColumn: {
    width: '48%',
  },


  // modal 

  detalhesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginTop: 10,
    maxWidth: '100%',  // Definir tamanho máximo para o container
    justifyContent: 'flex-start',
  },
  detalheItem: {
    backgroundColor: '#E9E9E9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
  },
  detalheText: {
    color: '#000',
    fontSize: 14,
    maxWidth: Platform.select({ ios: 100, android: 90 }), // Controla a largura máxima do texto
  },
  detalheAddButton: {
    backgroundColor: '#E9E9E9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
  },
  detalheAddText: {
    fontSize: 20,
    color: '#000',
  },
  detalheExtra: {
    backgroundColor: '#730d83',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
  },
  detalheExtraText: {
    color: '#FFF',
  },

  // descrição 

  descriptionBox: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    minHeight: 50,
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: '#494A50',
  },
  placeholderText: {
    color: '#D3D3D3',  // Estilo de placeholder
  },
  descriptionFilled: {
    color: '#1F2024',  // Cor do texto quando preenchido
  },
  helperText: {
    fontSize: 12,
    color: '#7A7A7A',
    marginTop: 5,
  },
  helperTextEnd: {
    fontSize: 14, // Ajuste dinâmico baseado na largura da tela (4% da largura)
    color: '#F5F5F5',
    backgroundColor: '#C4C4C4', // Ajuste a cor conforme necessário
    paddingVertical: width * 0.03, // Padding vertical responsivo
    paddingHorizontal: width * 0.05, // Padding horizontal responsivo
    borderRadius: 16,
    marginTop: width * 0.03, // Margin top para espaçamento
    textAlign: 'center',
    width: '100%', // Ocupar 90% da largura da tela
    alignSelf: 'center',
  },


  // pagamento 
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
    width: '100%',
  },



  // salvar 

  areaInput: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  inputContainer: {
    width: '100%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#7A7A7A',
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 40, // Ajuste do espaçamento superior
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#730d83',
    paddingVertical: 15,
    paddingHorizontal: width * 0.2, // Mais largura
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#F5F5F5',
    fontSize: Platform.select({ ios: width * 0.04, android: width * 0.03 }), // Ajuste no tamanho da fonte
    fontWeight: '600',
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
    color: '#730d83',
    fontSize: Platform.select({ ios: width * 0.04, android: width * 0.03 }), // Ajuste no tamanho da fonte
    fontWeight: '600',
  },
  // input que abre 

  optionsContainer: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2024',
  },
};

export default OneCadastroAnalise;
