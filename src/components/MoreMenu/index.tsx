import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

import Icon from 'components/Icon';

import { colors } from 'styles/global.styles';
import { MenuItem, MoreMenuProps, SubMenuItem } from './interface';

import { Menu, Button, SubMenu, SubButton, FloatingDropDown } from './style';

const MoreMenu: React.FC<MoreMenuProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>(
    {
      top: 0,
      left: 0,
    },
  );

  const computePosition = (preferred?: { w?: number; h?: number }) => {
    const btn = menuRef.current;
    if (!btn) return;
    const rect = (btn as HTMLElement).getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // base values
    const width = preferred?.w || 150;
    const height = preferred?.h || 200;
    let top = rect.bottom;
    let left = rect.right - width;

    const margin = 4;

    // adjust vertical if overflow
    if (top + height > vh - margin) {
      const altTop = rect.top - height;
      if (altTop >= margin) top = altTop;
      else top = Math.max(margin, vh - margin - height);
    }

    // adjust horizontal if overflow
    if (left < margin) left = margin;
    if (left + width > vw - margin)
      left = Math.max(margin, vw - margin - width);

    setDropdownPos({ top, left });
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      computePosition();
    } else {
      setOpenSubMenuIndex(null);
    }
  };

  const toggleSubMenu = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
  };

  // recalcuate after render to use real size
  useLayoutEffect(() => {
    if (isOpen && dropdownRef.current) {
      const { offsetWidth, offsetHeight } = dropdownRef.current;
      computePosition({ w: offsetWidth, h: offsetHeight });
    }
  }, [isOpen, openSubMenuIndex, menuItems.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isOpen &&
        !menuRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setIsOpen(false);
        setOpenSubMenuIndex(null);
      }
    };

    const handleResizeScroll = () => {
      if (isOpen) {
        computePosition({
          w: dropdownRef.current?.offsetWidth,
          h: dropdownRef.current?.offsetHeight,
        });
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResizeScroll);
      window.addEventListener('scroll', handleResizeScroll, true);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResizeScroll);
      window.removeEventListener('scroll', handleResizeScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResizeScroll);
      window.removeEventListener('scroll', handleResizeScroll, true);
    };
  }, [isOpen]);

  return (
    <>
      <Menu
        ref={menuRef as React.RefObject<HTMLButtonElement>}
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Icon
          className="icon-more_vert"
          color={colors.greyFont}
          fontSize="28px"
        />
      </Menu>
      {isOpen &&
        ReactDOM.createPortal(
          <FloatingDropDown
            ref={dropdownRef as React.RefObject<HTMLDivElement>}
            top={dropdownPos.top}
            left={dropdownPos.left}
            data-more-menu-dropdown="true"
          >
            {menuItems.map((item: MenuItem, index: number) => (
              <React.Fragment key={item.name}>
                {item.subItems ? (
                  <Button onClick={(e) => toggleSubMenu(e, index)}>
                    {item.name}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (item.action) item.action();
                      setIsOpen(false);
                      setOpenSubMenuIndex(null);
                    }}
                  >
                    {item.name}
                  </Button>
                )}
                {openSubMenuIndex === index && item.subItems && (
                  <SubMenu>
                    {item.subItems.map((subItem: SubMenuItem) => (
                      <SubButton
                        key={subItem.name}
                        onClick={() => {
                          subItem.action();
                          setOpenSubMenuIndex(null);
                          setIsOpen(false);
                        }}
                      >
                        {subItem.name}
                      </SubButton>
                    ))}
                  </SubMenu>
                )}
              </React.Fragment>
            ))}
          </FloatingDropDown>,
          document.body,
        )}
    </>
  );
};

export default MoreMenu;
