import React, { FC, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, Modal, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
const { height, width } = Dimensions.get('screen');

const ModalA = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [urls, setUrls] = useState<string[]>([]);
    const topRef = useRef<FlatList>(null)
    const [activeIndex, setActiveIndex] = useState(0);
    const [initial, setInitial] = useState(true); // 是否是第一次滚动 刚打开的时候不需要动画

    // 暴露给父组件的 show 和 hide 方法
    useImperativeHandle(ref, () => ({
        show: ({
            index,
            urls
        }: {
            index: number,
            urls: string[]
        }) => {
            setActiveIndex(index);
            setUrls(urls);
            setVisible(true);
        },
        hide: () => setVisible(false),
    }));

    // 当 modal 可见时滚动到指定索引
    useEffect(() => {
        console.log('useEffect', visible, activeIndex);
        if (visible) {
            setTimeout(() => {
                scrollToActiveIndex(activeIndex, !initial);
            }, 0);
        }
        return () => {
            setInitial(true);
        }
    }, [visible, activeIndex]);

    // 滚动到指定索引
    const scrollToActiveIndex = useCallback((index: number, animated: boolean = true) => {
        topRef?.current?.scrollToOffset({
            offset: index * width,
            animated: animated,
        });
    }, []);

    // 处理滚动结束事件
    const handleScrollEndDrag = useCallback((ev: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(ev.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
        setInitial(false);
    }, [scrollToActiveIndex]);

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <FlatList
                    ref={topRef}
                    data={urls}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScrollEndDrag={handleScrollEndDrag}
                    renderItem={({ item }) => (
                        <ImageWithAnimation
                            uri={item}
                            activeIndex={activeIndex}
                        />
                    )}
                />
                <View style={styles.indexTextContainer}>
                    <Text style={styles.indexText}>{activeIndex + 1} / {urls.length}</Text>
                </View>
            </View>
        </Modal>
    );
});

const ImageWithAnimation: FC<({
    uri: string;
    activeIndex: number;
})> = ({ activeIndex, uri }) => {

    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const [prevIndex, setPrevIndex] = useState(activeIndex);
    useEffect(() => {
        if (prevIndex !== activeIndex) {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();

        }
    });
    return (
        <View style={{ width, height }}>
            <Image
                source={{ uri }}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    )
}

export default ModalA;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    indexTextContainer: {
        position: 'absolute',
        bottom: 30,
    },
    indexText: {
        fontSize: 20,
        color: 'white',
    },
});