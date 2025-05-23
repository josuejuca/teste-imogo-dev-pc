import { StyleSheet, Platform, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
const loginWebStyles = StyleSheet.create({


  subLabel: {
    fontSize: Platform.select({ ios: width * 0.037, android: width * 0.035 }),
    fontWeight: '600',
    color: '#1F2024',
    marginBottom: 10,
  },


  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 32,
    alignItems: 'center',
    width: '90%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  logo: {
    width: 150,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2024',
    marginBottom: 24,
    fontFamily: 'Nunito_700Bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    // marginBottom: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  row: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  checkboxGroup: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#730d83',
    fontSize: 14,
  },
  forgot: {
    color: '#730d83',
    fontSize: 14,
  },
  buttonPrimary: {
    backgroundColor: '#730d83',
    paddingVertical: 14,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 16,
  },
  googleIcon: {
    marginRight: 8,
  },
  googleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  // 

  laterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  laterButtonText: {
    color: '#730d83',
    fontSize: 15, // Ajuste no tamanho da fonte
    fontWeight: '600',
  },



  // Estilo para query 

  subtitle: {
    fontSize: Platform.select({
      ios: width * 0.045, // Ajuste para iOS
      android: width * 0.04, // Ajuste para Android
    }),
    textAlign: "center",
    color: '#333',
    marginBottom: height * 0.01, // Margem inferior ajustada
  },
  description: {
    fontSize: Platform.select({
      ios: width * 0.04, // Ajuste para iOS
      android: width * 0.035, // Ajuste para Android
    }),
    color: '#666',
    marginBottom: height * 0.02, // Margem inferior ajustada
  },
  optionButton: {
    backgroundColor: '#F4F4F4',
    paddingVertical: height * 0.02, // Padding vertical ajustado
    paddingHorizontal: width * 0.05, // Padding horizontal ajustado
    borderRadius: 15,
    marginBottom: height * 0.015, // Margem inferior ajustada    
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start', // Alinha conteúdo à esquerda
    paddingHorizontal: 16,
  },
  optionButtonSelected: {
    backgroundColor: '#730d83',
  },
  optionText: {
    fontSize: Platform.select({
      ios: width * 0.04, // Ajuste para iOS
      android: width * 0.038, // Ajuste para Android
    }),
    color: '#333',
  },
  optionTextSelected: {
    color: '#FFF',
  },
  optionIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#2b083b', // Cor ligeiramente diferente para indicar carregamento
  },
  buttonText: {
    fontSize: Platform.select({
      ios: width * 0.045, // Ajuste para iOS
      android: width * 0.05, // Ajuste para Android
    }),
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default loginWebStyles;