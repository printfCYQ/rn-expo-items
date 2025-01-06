import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Image, Modal, Text, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import styles from '../styles/index';

const ModalB = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const [urls, setUrls] = useState<string[]>([]);

    useImperativeHandle(ref, () => ({
        show: ({
            index,
            urls
        }: {
            index: number,
            urls: string[]
        }) => {
            setIndex(index)
            setUrls(urls)
            setVisible(true)
        },
        hide: () => setVisible(false),
    }));

    const handleGesture = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            if (event.nativeEvent.translationX > 20) {
                handlePrev();
            } else {
                handleNext();
            }
        }
    };

    const handleNext = () => {
        setIndex((prevIndex) => (prevIndex + 1) % urls.length);
    };

    const handlePrev = () => {
        setIndex((prevIndex) => (prevIndex - 1 + urls.length) % urls.length);
    };

    const handleTap = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            setVisible(false);
        }
    };

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <GestureHandlerRootView>
                <TapGestureHandler onHandlerStateChange={handleTap}>
                    <View style={styles.modalOverlay}>
                        <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGesture}>
                            <View style={styles.modalContent}>
                                <Image
                                    style={styles.image}
                                    resizeMode="contain"
                                    source={{ uri: urls[index] }}
                                />
                            </View>
                        </PanGestureHandler>
                        <View style={styles.indexTextContainer}>
                            <Text style={styles.indexText}>{index + 1} / {urls.length}</Text>
                        </View>
                    </View>
                </TapGestureHandler>
            </GestureHandlerRootView>
        </Modal>
    );
});

export default ModalB;