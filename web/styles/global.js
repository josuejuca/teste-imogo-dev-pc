import { StyleSheet } from 'react-native';

// Paleta de cores
export const colors = {
    primary: '#730d83',
    darkText: '#1F2024',
    white: '#FFFFFF',
    gray: '#CCCCCC',
    background: '#F9F9F9',
};

//  Estilos reutilizáveis
export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.darkText,
        fontFamily: 'Nunito_700Bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: colors.darkText,
        fontFamily: 'Nunito_400Regular',
        textAlign: 'center',
        marginBottom: 12,
    },
    buttonPrimary: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 25,
        width: '100%',
        marginBottom: 16,
        alignItems: 'center',
    },
    buttonPrimaryText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700Bold',
    },
    buttonSecondary: {
        borderColor: colors.darkText,
        borderWidth: 1.5,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    buttonSecondaryText: {
        color: colors.darkText,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700Bold',
    },
});
