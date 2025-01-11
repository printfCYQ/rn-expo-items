export interface PageItem {
    label: string;
    path: string;
    key: string,
    children?: PageChildrenItem[]
}
export interface PageChildrenItem {
    label: string;
    path: string;
}
export const pages: PageItem[] = [
    {
        label: 'Demo',
        path: 'demo',
        key: 'demo',
    },
    {
        label: 'Items',
        path: 'second',
        key: 'items',
        children: [
            {
                label: 'Tabbar',
                path: '/items/tabbar',
            },
            {
                label: 'Sidebar',
                path: '/items/sidebar',
            },
            {
                label: 'DragButton',
                path: '/items/dragButton',
            },
            {
                label: 'Scanner',
                path: '/items/scanner',
            },
            {
                label: 'FlipClock',
                path: '/items/flipClock',
            },
            {
                label: 'Preview Image',
                path: '/items/previewImage',
            },
            {
                label: 'Gallery View',
                path: '/items/galleryView',
            }
        ]
    },
    {
        label: 'ReactNative Component',
        path: 'second',
        key: 'reactNativeComponent',
        children: [
            {
                label: 'FlatList Paging',
                path: '/reactNativeComponent/flatListPaging',
            },
        ]
    },
    {
        label: 'Bottom Sheet',
        path: 'second',
        key: 'bottomSheet',
        children: [
            {
                label: 'Simple Usage',
                path: '/bottomSheet/simpleUsage',
            },
            {
                label: 'BottomSheetView',
                path: '/bottomSheet/bottomSheetView',
            },
            {
                label: 'BottomSheetScrollView',
                path: '/bottomSheet/bottomSheetScrollView',
            }
        ]
    }
]