import React, { FC } from 'react';
import { Sidebar } from '../ui/sidebar';

type AdminSidebarProps = {
  tabActive: 'admin' | 'orders' | 'chat' | 'products' | 'users';
};

const AdminSidebar: FC<AdminSidebarProps> = ({ tabActive }) => {
  return (
    <Sidebar
      tabs={[
        {
          href: '/admin',
          isActive: tabActive === 'admin',
          name: 'Admin Dashboard',
        },
        {
          href: '/admin/orders',
          isActive: tabActive === 'orders',
          name: 'Pedidos',
        },
        {
          href: '/admin/products',
          isActive: tabActive === 'products',
          name: 'Produtos',
        },
        {
          href: '/admin/chat',
          isActive: tabActive === 'chat',
          name: 'Suporte',
        },
        {
          href: '/admin/users',
          isActive: tabActive === 'users',
          name: 'Usuários',
        },
      ]}
    />
  );
};

export { AdminSidebar };
