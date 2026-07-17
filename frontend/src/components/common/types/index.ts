export const SubmenuItemType = {
    SEPARATOR: 'SEP',
    LINK_ENTRY: 'LINK',
    BUTTON: 'BUTTON'
} as const;

export type SubmenuItemType = typeof SubmenuItemType[keyof typeof SubmenuItemType];


export interface SubmenuItem {
    type: SubmenuItemType;
    text?: string;
    action?: () => void;
    link?: string;
};

export type SubmenuData = Array<SubmenuItem>;