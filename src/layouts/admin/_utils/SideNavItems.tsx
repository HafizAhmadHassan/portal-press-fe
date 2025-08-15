import {
    BarChart3, Calendar, ChevronRight, ComponentIcon, FileText,
    Home, Mail, Settings, TableIcon, Ticket, Users, WashingMachine
  } from 'lucide-react';
  import type { MenuItem, UserProfile } from '@shared/side-navbar/types/MenuItem.types';
  
  export const AdminLayoutSideNavItems: MenuItem[] = [
    { label: 'Overview', route: '/admin', icon: Home,
      isActive: true, iconColor: 'var(--primary-color)', iconActiveColor: 'var(--primary-dark)' },
  
    { label: 'Machines', route: '/admin/machines', icon: WashingMachine,
      iconColor: 'var(--success-color)', iconActiveColor: 'var(--success-dark)' },
  
    { label: 'Users', route: '/admin/users', icon: Users, badge: '12',
      iconColor: 'var(--purple-color)', iconActiveColor: 'var(--purple-dark)' },
  
    { label: 'Tickets', route: '/admin/tickets', icon: Ticket, badge: '12',
      iconColor: 'var(--warning-color)', iconActiveColor: 'var(--warning-dark)' },
  
    {
      label: 'Analytics',
      icon: BarChart3,
      badge: '3',
      iconColor: 'var(--primary-color)', iconActiveColor: 'var(--primary-dark)',
      children: [
        { label: 'Overview', route: '/admin/analytics/overview', icon: ChevronRight,
          iconColor: 'var(--primary-color)', iconActiveColor: 'var(--primary-dark)' },
        { label: 'Reports', route: '/admin/analytics/reports', icon: FileText,
          iconColor: 'var(--orange-color)', iconActiveColor: 'var(--orange-dark)' },
      ]
    },
  
    { label: 'Messages', route: '/admin/messages', icon: Mail, badge: '5',
      iconColor: 'var(--orange-color)', iconActiveColor: 'var(--orange-dark)' },
  
    { label: 'Calendar', route: '/admin/calendar', icon: Calendar,
      iconColor: 'var(--purple-color)', iconActiveColor: 'var(--purple-dark)' },
  
    { label: 'Settings', route: '/admin/settings', icon: Settings,
      iconColor: 'var(--text-secondary)', iconActiveColor: 'var(--text-primary)' },
  
    {
      label: 'Kgn Components',
      icon: ComponentIcon,
      iconColor: 'var(--primary-color)', iconActiveColor: 'var(--primary-dark)',
      children: [
        { label: 'Buttons', route: '/admin/kgn-component-demo/buttons', icon: ComponentIcon,
          iconColor: 'var(--success-color)', iconActiveColor: 'var(--success-dark)' },
        { label: 'Table', route: '/admin/kgn-component-demo/tables', icon: TableIcon,
          iconColor: 'var(--purple-color)', iconActiveColor: 'var(--purple-dark)' },
      ]
    },
  ];
  
  export const AdminLayoutUserProfile: UserProfile = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Administrator',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  };
  