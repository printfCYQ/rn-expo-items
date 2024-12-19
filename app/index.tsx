import { PageItem, pages } from '@/constants/Pages';
import { commonStyles } from '@/styles';
import { useNavigation } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function Index() {
  const navigation = useNavigation()
  const onPressLearnMore = (item: PageItem) => {
    navigation.navigate({
      name: item.path,
      params: {
        key: item.key
      }
    } as never);
  }

  const renderItem = ({ item }: { item: PageItem }) => (
    <TouchableOpacity
      style={commonStyles.button}
      onPress={() => onPressLearnMore(item)}
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
