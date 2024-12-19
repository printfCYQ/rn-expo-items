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