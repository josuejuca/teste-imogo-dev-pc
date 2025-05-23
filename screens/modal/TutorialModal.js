import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Svg, { Rect, Defs, Mask } from 'react-native-svg';

const TutorialModal = ({ visible, onClose, buttonLayout }) => {
    if (!buttonLayout) return null;

    const screenWidth = Dimensions.get('window').width; // Largura da tela
    const screenHeight = Dimensions.get('window').height; // Altura da tela

    // Margens para aumentar o tamanho do recorte
    const marginX = 20; // Aumenta horizontalmente (eixo X)
    const marginY = 35; // Aumenta verticalmente (eixo Y)

    // Define os limites máximos para o recorte (para responsividade)
    const maxRecorteWidth = screenWidth * 0.8; // Máximo de 80% da largura da tela
    const maxRecorteHeight = screenHeight * 0.2; // Máximo de 20% da altura da tela

    // Coordenadas ajustadas para o recorte
    const recorteX = Math.max(buttonLayout.x - marginX, 0); // Garante que não ultrapasse a borda esquerda
    const recorteY = Math.max(buttonLayout.y - marginY, 0); // Garante que não ultrapasse o topo
    const recorteWidth = Math.min(buttonLayout.width + marginX * 2, maxRecorteWidth); // Limita a largura
    const recorteHeight = Math.min(buttonLayout.height + marginY * 2, maxRecorteHeight); // Limita a altura

    const tooltipTop = Math.max(buttonLayout.y - buttonLayout.height - 150, 0);
    const tooltipLeft = Math.min(
        buttonLayout.x + buttonLayout.width / 2 - 139,
        buttonLayout.screenWidth - 150
    );

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            {/* Fundo escuro com "buraco" */}
            <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={onClose}
            >
                <Svg height="100%" width="100%">
                    <Defs>
                        <Mask id="mask">
                            {/* Fundo branco */}
                            <Rect width="100%" height="100%" fill="white" />
                            {/* Buraco com margens maiores e bordas arredondadas */}
                            <Rect
                                x={recorteX}
                                y={recorteY}
                                width={recorteWidth}
                                height={recorteHeight}
                                rx={10} // Arredondamento das bordas (10px de raio)
                                ry={10} // Arredondamento das bordas (10px de raio)
                                fill="black"
                            />
                        </Mask>
                    </Defs>
                    {/* Fundo escuro com máscara */}
                    <Rect
                        width="100%"
                        height="100%"
                        fill="rgba(0, 0, 0, 0.7)"
                        mask="url(#mask)"
                    />
                </Svg>
            </TouchableOpacity>

            {/* Tooltip com imagem */}
            <View
                style={[styles.tooltipContainer, { top: tooltipTop, left: tooltipLeft }]}
            >
                <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                    <Image
                        source={require('../../assets/img/tutorial_ava.png')}
                        style={styles.tooltipImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    tooltipContainer: {
        position: 'absolute',
        zIndex: 10,
    },
    tooltipImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});

export default TutorialModal;
