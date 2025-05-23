import { StyleSheet } from 'react-native';

const welcomeWebStyles = StyleSheet.create({
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
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2024',
        marginBottom: 32,
        fontFamily: 'Nunito_700Bold',
        textAlign: 'center',
    },
    primaryButton: {
        backgroundColor: '#730d83',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 25,
        width: '100%',
        marginBottom: 16,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700Bold',
    },
    secondaryButton: {
        borderColor: '#1F2024',
        borderWidth: 1.5,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#1F2024',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700Bold',
    },
});

export default welcomeWebStyles;
