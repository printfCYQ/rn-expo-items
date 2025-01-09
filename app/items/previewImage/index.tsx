import React, { useRef } from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ModalA from './components/ModalA';
import ModalB from './components/ModalB';

const App = () => {
    const modalARef = useRef<{ show: (params: { index: number; urls: string[] }) => void } | null>(null)
    const modalBRef = useRef<{ show: (params: { index: number; urls: string[] }) => void } | null>(null)

    const urls = [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
    ]

    const onPress = (index: number) => {
        Alert.alert(
            'Select',
            'Select Modal',
            [
                {
                    text: 'ModalA 原生FlatList 左右切换',
                    onPress: () => {
                        modalARef.current?.show({
                            index,
                            urls
                        })
                    },
                },
                {
                    text: 'ModalB 三方库',
                    onPress: () => {
                        modalBRef.current?.show({
                            index,
                            urls
                        })
                    },
                },
            ],
            { cancelable: true }
        );


    };

    return (
        <SafeAreaView style={styles.container}>
            <ModalA ref={modalARef} />
            <ModalB ref={modalBRef} />

            <View style={styles.gridContainer}>
                {urls.map((url, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onPress(index)}
                        style={styles.gridItem}
                    >
                        <Image style={styles.image} source={{ uri: url }} />
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    gridItem: {
        width: 100,
        height: 100,
        margin: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});