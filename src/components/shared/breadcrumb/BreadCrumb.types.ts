// types.ts
export interface KgnBreadcrumbItem {
    permission?: string | string[];
    label: string;
    link?: string;
}

export interface NavItem {
    permission?: string;
    label: string;
    link?: string;
}

export interface NavGroup {
    items: NavItem[];
    classes?: string;
}
