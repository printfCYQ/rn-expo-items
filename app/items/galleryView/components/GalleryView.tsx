import React, { FC, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    const topRef = useRef<FlatList>(null)
    const thumbRef = useRef<FlatList>(null)
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
            <FlatList
                ref={topRef}
                data={images}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumScrollEnd}
                renderItem={({ item }) => {
                    console.log(item.author)
                    return (
                        <ImageWithAnimation
                            uri={item.download_url}
                            author={item.author}
                            activeIndex={activeIndex}
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
                    />
                )}
            />
        </View>
    );
};

const ImageWithAnimation: FC<({
    uri: string;
    author: string;
    activeIndex: number;
})> = ({ activeIndex, author, uri }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const [prevIndex] = useState(activeIndex);

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
                        toValue: 30,
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
        <View className='h-full' style={{ width }}>
            <Image
                source={{ uri }}
                style={StyleSheet.absoluteFillObject}
            />
            <Animated.View
                className={`absolute w-full aligh-center`}
                style={{
                    bottom: IMAGE_SIZE / 2,
                    opacity,
                    transform: [{ translateY }],
                }}
            >
                <Text className='text-white text-center text-lg font-bold'>
                    {author}
                </Text>
            </Animated.View>

        </View>
    )
}

const ThumbnailWithAnimation: FC<{
    uri: string,
    isActive: boolean,
    onPress: () => void;
}> = ({ isActive, onPress, uri }) => {

    const opacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    })
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <Animated.Image
                source={{ uri }}
                className='rounded-[12] border-2'
                style={{
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    marginRight: SPACING,
                    borderColor: isActive ? 'white' : 'transparent',
                }}
            />
        </TouchableOpacity>
    )
}
export default GalleryView;