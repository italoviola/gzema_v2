import React, { useEffect, useRef, useState } from 'react';

import Icon from 'components/Icon';

import { colors } from 'styles/global.styles';
import { MoreMenuProps } from './interface';

import { Menu, SubButton, SubMenuDown } from './style';

const MoreMenu: React.FC<MoreMenuProps> = ({ submenuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
    <Menu
      ref={menuRef as React.RefObject<HTMLButtonElement>}
      onClick={toggleMenu}
    >
      <Icon
        className="icon-more_vert"
        color={colors.greyFont}
        fontSize="28px"
      />
      {isOpen && (
        <SubMenuDown>
          {submenuItems.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <SubButton key={index} onClick={item.action}>
              {item.name}
            </SubButton>
          ))}
        </SubMenuDown>
      )}
    </Menu>
  );
};

export default MoreMenu;