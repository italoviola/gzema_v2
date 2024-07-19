import React from 'react';

export interface SubMenuItem {
  name: string;
  action: () => void;
}

export interface MenuItem {
  name: string;
  action?: () => void;
  subItems?: Array<SubMenuItem>;
}

export interface MoreMenuProps {
  menuItems: MenuItem[];
  style?: React.CSSProperties;
}
