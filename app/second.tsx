import { PageChildrenItem, pages } from '@/constants/Pages';
import { commonStyles } from '@/styles';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useLayoutEffect } from 'react';

import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function Index() {
    const navigation = useNavigation();
    const router = useRouter()
    const { key } = useLocalSearchParams();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: key as string
        });
    }, [navigation, key]);

    const getPages: PageChildrenItem[] = pages.find(item => item.key === key)?.children as PageChildrenItem[]

    const onPressLearnMore = (path: string) => {
        // @ts-ignore
        router.push(path)
    }

    const renderItem = ({ item }: { item: PageChildrenItem }) => (
        <TouchableOpacity
            style={commonStyles.button}
            onPress={() => onPressLearnMore(item.path)}
        >
            <Text>{item.label}</Text>
        </TouchableOpacity>
    )
    return (
        <View style={styles.container}>
            <FlatList
                data={getPages}
                keyExtractor={item => item.path}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={renderItem} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    separator: {
        height: 10
    }
});
