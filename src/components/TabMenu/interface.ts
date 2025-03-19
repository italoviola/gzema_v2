import React from 'react';

export interface TabMenuProps {
  items: {
    label: string;
    content: React.ReactNode;
  }[];
}
