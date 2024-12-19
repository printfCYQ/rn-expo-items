import { useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

const App = () => {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title:'FlatList Paging'
        });
    }, [navigation]);
    
    const [data, setData] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // 模拟网络请求
    const fetchData = async (pageNumber: number) => {
        setLoading(true);
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟没有更多数据的场景
        if (pageNumber > 2) { // 假设只有前两页数据
            setHasMore(false);
            setLoading(false);
            return;
        }

        const newData = Array.from({ length: 10 }, (_, i) => {
            return new Date().getTime() + i + (pageNumber - 1) * 10;
        });

        setData(prevData => [...prevData, ...newData]);
        setHasMore(newData.length > 0);
        setLoading(false);
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const onRefresh = () => {
        setRefreshing(true);
        setData([]); // 清空数据
        setPage(1); // 重置页码
        fetchData(1).then(() => setRefreshing(false));
    };

    const loadMoreData = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const renderFooter = () => {
        if (!hasMore) return <Text style={styles.noMoreData}>没有更多数据了</Text>;
        return loading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
    };

    return (
        <View style={styles.container}>
            {data.length === 0 && !loading ? (
                <Text style={styles.noData}>没有数据</Text>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text>{item}</Text>
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    item: {
        padding: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    noData: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: 'gray',
    },
    noMoreData: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
});

export default App;