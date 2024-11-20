'use client';

import React from 'react';
import { ValueIcon, AvatarIcon, StarFilledIcon, TargetIcon } from '@radix-ui/react-icons';
import { Navigation } from './Navigations';

// icon will support both URL or children
export const SIDE_BAR_MENU = [
  {
    title: 'Home',
    icon: 'https://img.icons8.com/?size=100&id=83326&format=png&color=ffffff',
    items: [{ title: 'Dashboard', route: Navigation.Home, icon: <ValueIcon /> }],
  },
  {
    title: 'Users',
    icon: <AvatarIcon height={25} width={25} />,
    items: [
      { title: 'Profile', route: Navigation.Profile, icon: <ValueIcon /> },
      { title: 'Privilege', route: Navigation.AccessPrivilege, icon: <ValueIcon /> },
      { title: 'Roles', route: Navigation.AccessRoles, icon: <ValueIcon /> },
      { title: 'Group', route: Navigation.AccessGroup, icon: <ValueIcon /> },
      {
        title: 'Security Role Privilege',
        route: Navigation.SecurityRolePrivilege,
        icon: <ValueIcon />,
      },
      {
        title: 'Security Group User',
        route: Navigation.SecurityGroupUser,
        icon: <ValueIcon />,
      },
      {
        title: 'Security Group Role',
        route: Navigation.AccessSecurityGroupRole,
        icon: <ValueIcon />,
      },
    ],
  },
  {
    title: 'Masters',
    icon: <StarFilledIcon height={25} width={25} />,
    items: [
      { title: 'Zip Code', route: Navigation.Zipcode, icon: <ValueIcon /> },
      { title: 'State', route: Navigation.State, icon: <ValueIcon /> },
      { title: 'Enterprise', route: Navigation.Enterprise, icon: <ValueIcon /> },
      {
        title: 'User Health Param',
        route: Navigation.UserHealthParam,
        icon: <ValueIcon />,
      },
      {
        title: 'User Preference',
        route: Navigation.UserPreference,
        icon: <ValueIcon />,
      },
      {
        title: 'Lab Test Master',
        route: Navigation.LabTestMaster,
        icon: <ValueIcon />,
      },
      {
        title: 'Country',
        route: Navigation.Country,
        icon: <ValueIcon />,
      },
    ],
  },
  {
    title: 'Lab Test',
    icon: <TargetIcon height={25} width={25} />,
    items: [
      { title: 'Test Price', route: Navigation.TestPrice, icon: <ValueIcon /> },
      {
        title: 'Test Parameter Master',
        route: Navigation.TestParameterMaster,
        icon: <ValueIcon />,
      },
      { title: 'Test Package', route: Navigation.TestPackage, icon: <ValueIcon /> },
      {
        title: 'Test Package Price',
        route: Navigation.TestPackagePrice,
        icon: <ValueIcon />,
      },

      {
        title: 'Test Package List',
        route: Navigation.TestPackageList,
        icon: <ValueIcon />,
      },
      { title: 'Test Master', route: Navigation.TestMaster, icon: <ValueIcon /> },
      { title: 'Blood Group', route: Navigation.BloodGroup, icon: <ValueIcon /> },
      { title: 'Business Entity', route: Navigation.BusinessEntity, icon: <ValueIcon /> },

    ],
  },
];
