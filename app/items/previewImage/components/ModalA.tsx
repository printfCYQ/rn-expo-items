import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Image, Modal, PanResponder, Text, TouchableWithoutFeedback, View } from 'react-native';
import styles from '../styles/index';

const ModalA = forwardRef((_, ref) => {
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
            setIndex(index);
            setUrls(urls);
            setVisible(true);
        },
        hide: () => setVisible(false),
    }));

    const handleNext = () => {
        setIndex((prevIndex) => (prevIndex + 1) % urls.length);
    };

    const handlePrev = () => {
        setIndex((prevIndex) => (prevIndex - 1 + urls.length) % urls.length);
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dx > 20) {
                handlePrev();
            } else if (gestureState.dx < -20) {
                handleNext();
            } else {
                setVisible(false);
            }
        },
    });

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContent} {...panResponder.panHandlers}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={{ uri: urls[index] }}
                    />
                </View>
                <View style={styles.indexTextContainer}>
                    <Text style={styles.indexText}>{index + 1} / {urls.length}</Text>
                </View>
            </View>
        </Modal>
    );
});

export default ModalA;