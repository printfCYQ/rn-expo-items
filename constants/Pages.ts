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
                path: 'items/tabbar',
            },
        ]
    },
    {
        label: 'Reac tNative Component',
        path: 'second',
        key: 'reactNativeComponent', 
        children: [
            {
                label: 'FlatList Paging',
                path: 'reactNativeComponent/flatListPaging',
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
                path: 'bottomSheet/simpleUsage',
            },
            {
                label: 'BottomSheetView',
                path: 'bottomSheet/bottomSheetView', 
            },
            {
                label:'BottomSheetScrollView',
                path: 'bottomSheet/bottomSheetScrollView', 
            }
        ]
    }
]