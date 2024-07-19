import React, { useEffect, useRef, useState } from 'react';

import { MenuItem, MoreMenuProps, SubMenuItem } from './interface';
import { Button, DropDown, SubMenu, SubButton } from './style';

const MoreMenu: React.FC<MoreMenuProps> = ({ menuItems, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const toggleSubMenu = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setOpenSubMenuIndex(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <DropDown style={style}>
      {menuItems.map((item: MenuItem, index: number) => (
        <React.Fragment key={item.name}>
          {item.subItems ? (
            <Button onClick={(e) => toggleSubMenu(e, index)}>
              {item.name}
            </Button>
          ) : (
            <Button onClick={item.action}>{item.name}</Button>
          )}
          {openSubMenuIndex === index && item.subItems && (
            <SubMenu>
              {item.subItems.map((subItem: SubMenuItem) => (
                <SubButton
                  key={subItem.name} // Replace 'key={subIndex}' with a unique identifier from the 'subItem' object
                  onClick={() => {
                    subItem.action();
                    setOpenSubMenuIndex(null);
                  }}
                >
                  {subItem.name}
                </SubButton>
              ))}
            </SubMenu>
          )}
        </React.Fragment>
      ))}
    </DropDown>
  );
};

export default MoreMenu;
