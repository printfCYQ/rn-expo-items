import { useNavigation } from 'expo-router';
import { useLayoutEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface DataItem {
    title: string;
    data: string[];
}

export default function RootLayout() {
    const navigation = useNavigation();
    const listRef = useRef<FlatList>(null);

    const data: DataItem[] = [
        { title: 'A', data: ['abandon', 'ability', 'ability'] },
        { title: 'B', data: ['become', 'bedroom', 'believe'] },
        { title: 'C', data: ['cheek', 'child', 'clock'] },
        { title: 'D', data: ['deep', 'develop'] },
        { title: 'E', data: ['every', 'eye'] },
        { title: 'F', data: ['fantasy', 'fifty'] },
        { title: 'G', data: ['gently', 'garden', 'grain', 'grave'] },
        { title: 'H', data: ['have', 'head', 'healthy', 'herself'] },
        { title: 'I', data: ['impress', 'incident'] },
        { title: 'J', data: ['justice'] },
        { title: 'K', data: ['kind', 'kite', 'kitty'] },
        { title: 'L', data: ['lady', 'light', 'little'] },
        { title: 'M', data: ['manner', 'middle'] },
        { title: 'N', data: ['nose', 'nurse'] },
        { title: 'O', data: ['obtain', 'orange'] },
        { title: 'P', data: ['pencil', 'pilot', 'pity'] },
        { title: 'Q', data: ['quiet', 'queen'] },
        { title: 'R', data: ['raven'] },
        { title: 'S', data: ['sister'] },
        { title: 'T', data: ['tall', 'taste'] },
        { title: 'U', data: ['unable', 'union', 'unknown'] },
        { title: 'V', data: ['various', 'valley', 'very'] },
        { title: 'W', data: ['white', 'whom', 'waste'] },
        { title: 'X', data: ['xenon'] },
        { title: 'Y', data: ['yeah', 'yet', 'yellow'] },
        { title: 'Z', data: ['zebra'] },
    ];

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Sidebar'
        });
    }, [navigation]);

    const onPressItem = (item: string) => {
        console.log(item);
    };

    const onPressLetter = (letter: string) => {
        setSelectWord(letter);
        const index = data.findIndex(section => section.title === letter);
        console.log(index);
        if (index !== -1 && listRef.current) {
            listRef.current.scrollToIndex({ index: index });
        }
    };

    const renderUserItem = ({ item, index }: { item: string, index: number }, cardItem: DataItem) => {
        const isLastItem = cardItem.data.length - 1 === index;
        return (
            <Pressable onPress={() => onPressItem(item)}>
                <View style={styles.item}>
                    <View style={styles.avatarContent}>
                        <Image style={styles.avatar} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
                    </View>
                    <View style={[styles.nameContent, isLastItem && styles.noBoard]}>
                        <Text style={styles.name}>{item}</Text>
                    </View>
                </View>
            </Pressable>
        );
    };

    const renderCardItem = ({ item, index }: { item: DataItem, index: number }) => {
        return (
            <View>
                {renderSectionHeader(item.title)}
                <FlatList
                    data={item.data}
                    renderItem={(params) => renderUserItem(params, item)}
                    keyExtractor={(_, index: number) => index.toString()}
                />
            </View>
        );
    };

    const renderSectionHeader = (title: string) => (
        <View style={styles.headerContent}>
            <Text style={styles.header}>{title}</Text>
        </View>
    );

    const [selectWord, setSelectWord] = useState<string>('');
    const renderAlphabet = () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        return (
            <View style={styles.alphabetContainer}>
                {alphabet.map(letter => (
                    <Pressable key={letter} onPress={() => onPressLetter(letter)}>
                        <View style={{ marginVertical: 2, width: 20, height: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: letter === selectWord ? '#0CC161' : 'transparent' }}>
                            <Text style={styles.alphabetLetter}>{letter}</Text>
                        </View>
                    </Pressable>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={listRef}
                data={data}
                renderItem={renderCardItem}
                keyExtractor={(_, index: number) => index.toString()}
            />
            <View style={styles.alphabetSidebar}>
                {renderAlphabet()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    item: {
        backgroundColor: '#fff',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContent: {
        paddingVertical: 4,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 4,
    },
    nameContent: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
    },
    noBoard: {
        borderBottomWidth: 0,
    },
    name: {
        fontSize: 18,
        color: '#1A1A1A',
    },
    headerContent: {
        height: 32,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#EDEDED',
        paddingLeft: 16,
    },
    header: {
        fontSize: 16,
        color: '#8D8D8D',
    },
    alphabetSidebar: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        paddingRight: 5,
    },
    alphabetContainer: {
        alignItems: 'center',
    },
    alphabetLetter: {
        fontSize: 14,
        color: '#1A1A1A',
    },
});