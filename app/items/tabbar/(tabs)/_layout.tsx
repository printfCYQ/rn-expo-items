import { Feather } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const renderIcon = (name: string, props: any) => {
  const icons = {
    index: 'home',
    explore: 'compass',
    setting: 'user'
  }
  type IconNamesFromObject = keyof typeof icons;
  return <Feather name={icons[name as IconNamesFromObject]} size={24} {...props}></Feather>
}

const TabbarButton = (props: {
  onPress: Function,
  onLongPress: Function,
  isFocused: boolean,
  routerName: string,
  color: string,
  iconColor: string,
  label: string
}) => {
  const {
    onPress,
    onLongPress,
    isFocused,
    routerName,
    color,
    iconColor,
    label
  } = props
  const scale = useSharedValue(0)
  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    )
  }, [scale, isFocused])

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 9])
    return {
      transform: [{
        scale: scaleValue
      }],
      top
    }
  })

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0])
    return {
      opacity
    }
  })
  return (
    <Pressable
      onPress={(event) => onPress(event)}
      onLongPress={(event) => onLongPress(event)}
      style={styles.tabbarItem}
    >
      <Animated.View style={animatedIconStyle}>
        {renderIcon(routerName, { color: iconColor })}
      </Animated.View>
      <Animated.Text style={[{ color }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable >
  )
}

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  const [dimensions, setDimensions] = useState({ height: 20, width: 100 })
  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    })
  }

  const tabPositionX = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }]
    }
  })

  return (
    <View onLayout={onTabbarLayout} style={styles.tabber}>
      <Animated.View style={[
        styles.tabbarItemBg,
        animatedStyle,
        {
          backgroundColor: colors.primary,
          height: dimensions.height - 15,
          width: buttonWidth - 25
        }
      ]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, { duration: 1500 })

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabbarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routerName={route.name}
            color={isFocused ? colors.primary : colors.text}
            iconColor={isFocused ? colors.background : colors.text}
            label={label as string}
          ></TabbarButton>
          // <PlatformPressable
          //   key={route.name}
          //   href={buildHref(route.name, route.params)}
          //   accessibilityState={isFocused ? { selected: true } : {}}
          //   accessibilityLabel={options.tabBarAccessibilityLabel}
          //   testID={options.tabBarButtonTestID}
          //   onPress={onPress}
          //   onLongPress={onLongPress}
          //   style={styles.tabbarItem}
          // >
          //   {renderIcon(route.name, {
          //     color: isFocused ? colors.primary : colors.text
          //   })}
          //   <Text style={{ color: isFocused ? colors.primary : colors.text }}>
          //     {label as string}
          //   </Text>
          // </PlatformPressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {

  return (
    <Tabs tabBar={props => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', headerShown: false }} />
      <Tabs.Screen name="setting" options={{ title: 'Setting', headerShown: false }} />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  tabber: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1
  },
  tabbarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  tabbarItemBg: {
    position: 'absolute',
    borderRadius: 30,
    marginHorizontal: 12,
  }
})