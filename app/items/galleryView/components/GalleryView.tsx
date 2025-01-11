import React, { FC, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';

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

    const momentumScrollEnd = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.floor(contentOffsetX / width);
        setActiveIndex(index)
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
                onMomentumScrollEnd={momentumScrollEnd}
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
        <View className='h-full' style={{ width }}>
            <Image
                source={{ uri }}
                style={StyleSheet.absoluteFillObject}
            />
            <Animated.View
                style={{
                    position: 'absolute',
                    bottom: 50,
                    width: '100%',
                    alignItems: 'center',
                    paddingBottom: 40,
                    opacity,
                    transform: [{ translateY }],
                }}
            >
                <Text className='text-white text-2xl font-bold text-center'>{author}</Text>
            </Animated.View>

        </View>
    )
}
export default GalleryView;