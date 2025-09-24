'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { SIDE_BAR_MENU } from '@/constants/SidebarMenu';

interface SubMenuItem {
  title: string;
  route: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode | string;
  route?: string;
  items: SubMenuItem[];
  isActive?: boolean;
}

const LeftSideBar = () => {
  const [isCollapsed] = useState(false);
  const [menuData, setMenuData] = useState<MenuItem[]>(SIDE_BAR_MENU);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const updatedMenu = SIDE_BAR_MENU.map((menu: MenuItem) => {
      if (menu.items.length > 0) {
        menu.isActive = menu.items.some((subItem) => pathname === subItem.route);
        menu.items = menu.items.map((subItem) => ({
          ...subItem,
          isActive: pathname === subItem.route,
        }));
      } else {
        menu.isActive = pathname === menu.route;
      }
      return menu;
    });
    setMenuData(updatedMenu);
  }, [pathname]);

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          {!isCollapsed && <h1 className="text-lg font-bold">Notion Press Media</h1>}
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto gap-2">
        {menuData.map((menu) => (
          <SidebarGroup key={menu.title}>
            {menu.items.length === 0 ? (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={menu.isActive}>
                      <a href={menu.route} className="flex items-center gap-2">
                        {menu.title}
                        <ChevronRight
                          className={`ml-auto transition-transform ${
                            menu.isActive ? 'rotate-90' : ''
                          }`}
                        />
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            ) : (
              <Collapsible key={menu.title} defaultOpen={menu.isActive}>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 hover:bg-sidebar-accent">
                    <span className="text-left">{menu.title}</span>{' '}
                    <ChevronRight
                      className={`transition-transform ${menu.isActive ? 'rotate-90' : ''}`}
                    />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {menu.items.map((subMenu) => (
                        <SidebarMenuItem key={subMenu.title}>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuButton asChild isActive={subMenu.isActive}>
                                <a
                                  href={subMenu.route}
                                  className="flex items-center justify-between w-full px-2  py-6 hover:bg-sidebar-accent"
                                >
                                  <span className="text-left">{subMenu.title}</span>

                                  <ChevronRight
                                    className={`transition-transform ${subMenu.isActive ? 'rotate-90' : ''}`}
                                  />
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-black"
              onClick={() => handleNavigation('/login')}
            >
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default LeftSideBar;
