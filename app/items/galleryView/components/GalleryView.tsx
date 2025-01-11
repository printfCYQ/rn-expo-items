import React, { FC, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const API_URL = "https://picsum.photos/v2/list";
const IMAGE_SIZE = 80;
const SPACING = 10;

type ImageItem = {
    id: string,
    dowload_url: string,
    author: string,
}

const fetchImageFromPixels = async (): Promise<ImageItem[]> => {
    const response = await fetch(API_URL);
    if (response.ok) {
        return response.json();
    }
    throw new Error("Failed to Fetch Images")
}

const GalleryView = () => {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const topRef = useRef<Animated.FlatList>(null)
    const thumbRef = useRef<FlatList>(null)
    const scrollX = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const fetchedImages = await fetchImageFromPixels();
                setImages(fetchedImages);
            } catch (error) {
                console.log("Error-->", error);

            } finally {
                setLoading(false)
            }
        };
        fetchImages();
    }, [])
    console.log(images);
    if (loading) {
        return (
            <View className='w-full h-full align-center justify-center bg-black' >
                <ActivityIndicator size={'large'} color={'white'} />
            </View>
        );
    }

    const onMomentumScrollEnd = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.floor(contentOffsetX / width);
        // setActiveIndex(index)
        scorllToActiveIndex(index)
    }
    // CYQ_TODO Android  not working
    const scorllToActiveIndex = (index: number) => {
        setActiveIndex(index);
        topRef?.current?.scrollToOffset({
            offset: index * width,
            animated: true,
        });
        if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
            thumbRef?.current?.scrollToOffset({
                offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
                animated: true,

            })
        } else {
            thumbRef?.current?.scrollToOffset({
                offset: 0,
                animated: true,
            })
        }
    }

    return (
        <View>
            <Animated.FlatList
                ref={topRef}
                data={images}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                onMomentumScrollEnd={onMomentumScrollEnd}
                renderItem={({ item }) => {
                    console.log(item.author)
                    return (
                        <ImageWithAnimation
                            uri={item.download_url}
                            author={item.author}
                            index={activeIndex}
                            scrollX={scrollX}
                        />
                    )
                }}
            />
            <FlatList
                ref={thumbRef}
                data={images}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                className='absolute'
                style={{
                    bottom: IMAGE_SIZE,
                }}
                contentContainerStyle={{ paddingHorizontal: SPACING }}
                renderItem={({ item, index }) => (
                    <ThumbnailWithAnimation
                        uri={item.download_url}
                        isActive={activeIndex === index}
                        onPress={() => scorllToActiveIndex(index)}
                        index={index}
                    />
                )}
            />
        </View>
    );
};

const ImageWithAnimation: FC<({
    uri: string;
    author: string;
    index: number;
    scrollX: Animated.Value;
})> = ({ uri, author, index, scrollX }) => {

    const [isLoading, setIsLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const scale = scrollX.interpolate({
        inputRange: [(index - 1) * width, index * width, (index + 1) * width],
        outputRange: [0.8, 1, 0.8],
        extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
        inputRange: [(index - 1) * width, index * width, (index + 1) * width],
        outputRange: [0.5, 1, 0.5],
        extrapolate: 'clamp',
    });

    const scaleX = scrollX.interpolate({
        inputRange: [(index - 1) * width, index * width, (index + 1) * width],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
        inputRange: [(index - 1) * width, index * width, (index + 1) * width],
        outputRange: [50, 0, 50],
        extrapolate: 'clamp',
    });

    const handleImageLoad = () => {
        setIsLoading(false);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    return (
        <Animated.View className='h-full' style={{ width, transform: [{ scale }], opacity }}>
            {
                isLoading && (
                    <ActivityIndicator
                        size={'large'}
                        color={'white'}
                        style={StyleSheet.absoluteFillObject}
                    />
                )
            }
            <Animated.Image
                source={{ uri }}
                onLoad={handleImageLoad}
                style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim }]}
            />
            <Animated.View
                className='absolute w-full aligh-center'
                style={{
                    bottom: IMAGE_SIZE / 2,
                    opacity,
                    transform: [{ translateY }, { scaleX }],
                }}
            >
                <Text className='text-white text-center text-lg font-bold'>
                    {author}
                </Text>
            </Animated.View>

        </Animated.View>
    )
}

const ThumbnailWithAnimation: FC<{
    uri: string,
    isActive: boolean,
    onPress: () => void;
    index: number;
}> = ({ isActive, onPress, uri, index }) => {
    const [isLoading, setIsLoading] = useState(true);

    const borderColor = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const delay = index * 100;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.timing(translateX, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        Animated.timing(borderColor, {
            toValue: isActive ? 1 : 0,
            duration: 100,
            useNativeDriver: true,
        }).start();

    }, [index, isActive])

    const animatedBorderColor = borderColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', 'white'],
    });

    const handleImageLoad = () => {
        setIsLoading(false);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <Animated.View className='rounded-[12] border-2 overflow-hidden' style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                marginRight: SPACING,
                transform: [{ scale: translateX }],
                borderColor: animatedBorderColor,
            }}>
                {
                    isLoading && (
                        <View className='absolute w-full h-full align-center justify-center bg-black'>
                            <ActivityIndicator
                                size={'small'}
                                color={'white'}
                                style={StyleSheet.absoluteFillObject}
                            />
                        </View>
                    )
                }
                <Animated.Image
                    source={{ uri }}
                    className='flex-1 rounded-[12]'
                    style={{
                        marginRight: 0,
                        opacity: fadeAnim,
                    }}
                    onLoad={handleImageLoad}
                />
            </Animated.View>

        </TouchableOpacity >
    )
}
export default GalleryView;