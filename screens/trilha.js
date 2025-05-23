import React, { useState, useRef, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, TextInput, ScrollView, StatusBar, Dimensions, SafeAreaView, Platform, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Modal } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';

import { useLogScreen } from '../useLogScreen';

import Svg, { Path, G, Rect, Mask, Ellipse, ClipPath } from 'react-native-svg';


import CardGrid from './modal/trilhamodal';

const { width, height } = Dimensions.get('window');

// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path fillRule="evenodd" clipRule="evenodd" d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z" fill="#730d83" />
    </Svg>
);

const TrilhaDoConhecimento = ({ route, navigation }) => {
    useLogScreen('TrilhaDoConhecimento');
    const { usuario_id } = route.params || {};

    // fim modal api

    useEffect(() => {
        fetchUserData();

    }, []);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.imogo.com.br/api/v1/corretores/${usuario_id}`);
            setPhone(response.data.telefone);
            setEmail(response.data.email);
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>Trilha do conhecimento</Text>
            </View>

            {/* Linha de separação do header */}
            <View style={styles.headerLine} />


            <StatusBar
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled={Platform.OS === 'ios' || Platform.OS === 'android'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >

                    <CardGrid />
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView >
    );
};

const styles = {


    // fim senhas

    headerLine: {
        height: 1,
        backgroundColor: '#E9E9E9',
        width: '100%',
        marginBottom: "5%"
    },

    // carregamento 

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo translúcido
    },
    loadingText: {
        color: '#FFF',
        marginTop: 10,
        fontSize: 16,
    },

    // fim carregamento 

    errorText: {
        marginTop: 5,
        color: 'red',
        fontSize: 14,
    },

    mt_10: {
        marginTop: 10
    },
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

    backButton: {
        position: 'absolute',
        left: 20,
    },

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


};

export default TrilhaDoConhecimento;