import { PageItem, pages } from '@/constants/Pages';
import { commonStyles } from '@/styles';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function Index() {
  const router = useRouter();

  const onPress = (item: PageItem) => {
    router.push({
      // @ts-ignore
      pathname: item.path,
      params: {
        key: item.key,
      },
    })
  }

  const renderItem = ({ item }: { item: PageItem }) => (
    <TouchableOpacity
      style={commonStyles.button}
      onPress={() => onPress(item)}
    >
      <Text>{item.label}</Text>
    </TouchableOpacity>
  )
  return (
    <View style={styles.container}>
      <FlatList
        data={pages}
        keyExtractor={item => item.key}
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
