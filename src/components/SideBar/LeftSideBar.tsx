'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  icon?: React.ReactNode | string;
  isActive?: boolean;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode | string;
  route?: string;
  items: SubMenuItem[];
  isActive?: boolean;
}

const IconRenderer = ({ icon }: { icon?: React.ReactNode | string }) => {
  if (!icon) return null;
  if (typeof icon === 'string') {
    return <img src={icon} alt="icon" className="w-4 h-4 object-contain" />;
  }
  return <span className="w-4 h-4">{icon}</span>;
};

const LeftSideBar = () => {
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
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-lg font-bold">Notion Press Media</h1>
        </div>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="overflow-y-auto gap-2">
        {menuData.map((menu) => (
          <SidebarGroup key={menu.title}>
            {/* Menu without children */}
            {menu.items.length === 0 ? (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={menu.isActive}>
                      <Link
                        href={menu.route ?? '#'}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          menu.isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'hover:bg-sidebar-accent'
                        }`}
                      >
                        <IconRenderer icon={menu.icon} />
                        <span>{menu.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            ) : (
              // Menu with children
              <Collapsible key={menu.title} defaultOpen={menu.isActive}>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 hover:bg-sidebar-accent rounded-md">
                    <div className="flex items-center gap-2">
                      <IconRenderer icon={menu.icon} />
                      <span>{menu.title}</span>
                    </div>
                    <ChevronRight
                      className={`transition-transform ${
                        menu.isActive ? 'rotate-90' : ''
                      }`}
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
                                <Link
                                  href={subMenu.route}
                                  className={`flex items-center gap-2 w-full px-6 py-2 rounded-md text-sm transition-colors ${
                                    subMenu.isActive
                                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                      : 'hover:bg-sidebar-accent'
                                  }`}
                                >
                                  <IconRenderer icon={subMenu.icon} />
                                  <span>{subMenu.title}</span>
                                </Link>
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

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-black hover:bg-red-100 hover:text-red-600 rounded-md"
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
