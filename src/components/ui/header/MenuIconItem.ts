import { useSession } from 'next-auth/react';
import { BsPersonGear } from 'react-icons/bs';
import { FaPowerOff } from 'react-icons/fa';
import { MenuItemProps } from './MenuIcon';

export function GetUser():
  | {
      id: string;
      email: string;
      name: string;
      exporterId: string;
      onboardingStatus: string;
    }
  | undefined {
  const { data: session } = useSession();
  return session?.user;
}

export function getTopBarItems(): MenuItemProps[] {
  const user = GetUser();

  const menuItems: MenuItemProps[] = [
    {
      icon: BsPersonGear,
      label: 'Perfil',
      to: `/dashboard/user/${user?.id}`,
    },
    {
      icon: FaPowerOff,
      label: 'Cerrar sesión',
      to: '/api/auth/signout',
    },
  ];

  return menuItems;
}
