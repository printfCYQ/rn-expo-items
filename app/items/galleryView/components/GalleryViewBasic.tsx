import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Text, View } from 'react-native';
import ScaleImage from './ScaleImage';
const { width } = Dimensions.get('window');
const API_URL = "https://picsum.photos/v2/list";

type ImageItem = {
    id: string,
    download_url: string,
    author: string,
}

const fetchImageFromPixels = async (): Promise<ImageItem[]> => {
    const response = await fetch(API_URL);
    if (response.ok) {
        return response.json();
    }
    throw new Error("Failed to Fetch Images")
}

const GalleryViewBasic = () => {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const topRef = useRef<Animated.FlatList>(null)
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
            <View className='w-full h-full align-center justify-center bg-black'>
                <ActivityIndicator size={'large'} color={'white'} />
            </View>
        );
    }

    const onMomentumScrollEnd = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.floor(contentOffsetX / width);
        setActiveIndex(index)
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
                onMomentumScrollEnd={onMomentumScrollEnd}
                renderItem={({ item }) => {
                    console.log(item.author)
                    return (
                        <View style={{ width, overflow: 'hidden' }}>
                            <ScaleImage uri={item.download_url} />
                        </View>
                    )
                }}
            />
            <View style={{
                position: 'absolute',
                bottom: 50,
                alignItems: 'center',
                width: '100%',
            }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'white',
                }}>{activeIndex + 1} / {images.length}</Text>
            </View>
        </View>
    );
};

export default GalleryViewBasic;