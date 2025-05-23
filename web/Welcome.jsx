import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import PCstyles from './styles/welcomeWebStyles'; 

export default function WelcomeWeb({ navigation }) {
    useEffect(() => {
        if (Platform.OS === 'web') {
            setTimeout(() => {
                document.title = 'imoGo | Bem-vindo';
            }, 100);
        }
    }, []);

    return (
        <ImageBackground
            source={require('../assets/img/bg.png')}
            style={PCstyles.background}
            resizeMode="cover"
        >
            <View style={PCstyles.card}>
                <Image
                    source={require('../assets/img/logo.png')}
                    style={PCstyles.logo}
                    resizeMode="contain"
                />
                <Text style={PCstyles.title}>Faça parte da imoGo</Text>

                <TouchableOpacity
                    style={PCstyles.primaryButton}
                    onPress={() => navigation.navigate('RegisterWeb')}
                >
                    <Text style={PCstyles.primaryButtonText}>Criar cadastro</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={PCstyles.secondaryButton}
                    onPress={() => navigation.navigate('LoginWeb')}
                >
                    <Text style={PCstyles.secondaryButtonText}>Já tenho acesso</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}
