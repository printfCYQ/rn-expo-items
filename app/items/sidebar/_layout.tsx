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
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DataItem {
    title: string;
    data: string[];
}

export default function RootLayout() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const listRef = useRef<FlatList>(null);
    const alphabetRef = useRef<View>(null);
    const [alphabetRefTop, setAlphabetRefTop] = useState<number>(0);
    const [selectWord, setSelectWord] = useState<string>('');
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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

    // 获取字母导航栏的顶部位置
    const getAlphabetRefTop = () => {
        if (alphabetRef.current) {
            alphabetRef.current.measure((_x, _y, _width, _height, _pageX, pageY) => {
                setAlphabetRefTop(pageY);
            });
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({ title: 'Sidebar' });
        getAlphabetRefTop();
    }, [navigation]);

    // 处理列表项点击事件
    const onPressItem = (item: string) => {
        console.log(item);
    };

    // 更新选中的字母并滚动到对应的位置
    const updateLetter = (letter: string) => {
        setSelectWord(letter);
        const index = data.findIndex(section => section.title === letter);
        if (index !== -1 && listRef.current) {
            listRef.current.scrollToIndex({ index });
        }
    };

    // 渲染用户项
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

    // 渲染卡片项
    const renderCardItem = ({ item, index }: { item: DataItem, index: number }) => {
        return (
            <View>
                {renderSectionHeader(item.title)}
                <FlatList
                    data={item.data}
                    renderItem={(params) => renderUserItem(params, item)}
                    keyExtractor={(_, index) => index.toString()}
                />
            </View>
        );
    };

    // 渲染部分头部
    const renderSectionHeader = (title: string) => (
        <View style={styles.headerContent}>
            <Text style={styles.header}>{title}</Text>
        </View>
    );

    // 渲染字母导航栏
    const renderAlphabet = () => {
        const alphabetLetterPressOut = (letter: string) => {
            setShowTooltip(false);
            updateLetter(letter);
        };

        const alphabetLetterItemLongPress = (letter: string) => {
            setShowTooltip(true);
            updateLetter(letter);
        };

        return (
            <View style={styles.alphabetContainer} ref={alphabetRef}>
                {alphabet.map(letter => (
                    <Pressable
                        key={letter}
                        onPressOut={() => alphabetLetterPressOut(letter)}
                        onLongPress={() => alphabetLetterItemLongPress(letter)}
                    >
                        <View style={[styles.alphabetLetterItem, { backgroundColor: letter === selectWord ? '#0CC161' : 'transparent' }]}>
                            <Text style={styles.alphabetLetter}>{letter}</Text>
                            {(selectWord === letter && showTooltip) && (
                                <View style={styles.tooltip}>
                                    <Text style={styles.tooltipText}>{letter}</Text>
                                </View>
                            )}
                        </View>
                    </Pressable>
                ))}
            </View>
        );
    };

    // 处理滑动手势事件
    // TODO 优化 节流？
    const onGestureEvent = (event: any) => {
        const { absoluteY } = event.nativeEvent;
        const index = Math.floor((absoluteY - alphabetRefTop - insets.top) / 24); // 20 height + 4 margin
        if (index >= 0 && index < alphabet.length) {
            const letter = alphabet[index];
            setShowTooltip(true);
            updateLetter(letter);
        }
    };

    // 处理列表滚动事件
    const onListScroll = () => {
        // 微信的逻辑没搞明白
        // setSelectWord('')
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={listRef}
                data={data}
                onScroll={onListScroll}
                renderItem={renderCardItem}
                keyExtractor={(_, index) => index.toString()}
            />
            <PanGestureHandler onGestureEvent={onGestureEvent}>
                <View style={styles.alphabetSidebar}>
                    {renderAlphabet()}
                </View>
            </PanGestureHandler>
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
    alphabetLetterItem: {
        marginVertical: 2,
        width: 20,
        height: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    alphabetLetter: {
        fontSize: 14,
        color: '#1A1A1A',
    },
    tooltip: {
        position: 'absolute',
        left: -60,
        top: -8,
        width: 40,
        height: 40,
        backgroundColor: '#0CC161',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    tooltipText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});