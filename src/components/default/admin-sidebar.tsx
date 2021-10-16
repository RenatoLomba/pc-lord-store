import React, { FC } from 'react';
import { Sidebar } from '../ui/sidebar';

type AdminSidebarProps = {
  tabActive: 'admin' | 'orders';
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
      ]}
    />
  );
};

export { AdminSidebar };
