import React from 'react';
import { View, TouchableOpacity, Image, FlatList, Dimensions, Linking, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const data = [
    // { id: '1', image: 'https://cdn.imogo.com.br/img/evento-trilha/03.png', locked: false, link: 'https://www.youtube.com/watch?v=abcd1234' }, // Aberto
    // { id: '2', image: 'https://cdn.imogo.com.br/img/evento-trilha/03.png', locked: true, link: 'https://www.youtube.com/watch?v=efgh5678' }, // Bloqueado
    { id: '3', image: 'https://cdn.imogo.com.br/img/evento-trilha/07.png', locked: false, unlockDate: '25/02 às 9h', link: 'https://youtube.com/live/7rkfYC4_2hw' }, // Bloqueado com data e hora
    { id: '4', image: 'https://cdn.imogo.com.br/img/evento-trilha/10.png', locked: false, unlockDate: '01/04 às 9h', link: 'https://youtube.com/live/wB4ivdiiIpI?feature=share' }, // Bloqueado com data e hora
    // { id: '4', image: 'https://cdn.imogo.com.br/img/evento-trilha/03.png', locked: false, link: 'https://www.youtube.com/watch?v=mnop1112' },
    // { id: '5', image: 'https://cdn.imogo.com.br/img/evento-trilha/03.png', locked: true, unlockDate: '10/03 às 14h', link: 'https://www.youtube.com/watch?v=qrst1314' },
    // { id: '6', image: 'https://cdn.imogo.com.br/img/evento-trilha/03.png', locked: true, link: 'https://www.youtube.com/watch?v=uvwx1516' },
];

const CardItem = ({ item }) => (
    <TouchableOpacity
        style={styles.card}
        onPress={() => !item.locked && Linking.openURL(item.link)}
        activeOpacity={item.locked ? 1 : 0.7}
    >
        <Image source={{ uri: item.image }} style={styles.image} />
        
        {item.locked && (
            <View style={styles.lockOverlay}>
                <Ionicons name="lock-closed-outline" size={40} color="white" />
                {item.unlockDate && (
                    <Text style={styles.unlockDateText}>{item.unlockDate}</Text>
                )}
            </View>
        )}
    </TouchableOpacity>
);

const CardGrid = () => {
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={({ item }) => <CardItem item={item} />}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', 
        paddingVertical: 20,
    },
    listContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: width / 3.5, 
        height: width / 2.5, 
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#FFF', 
        elevation: 3, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    unlockDateText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
    },
});

export default CardGrid;
