'use client';
import { Cross2Icon, PersonIcon } from '@radix-ui/react-icons';
import { Flex, IconButton, Text, Avatar, Card, Button } from '@radix-ui/themes';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface RightSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RightSideBar = ({ isOpen, onClose }: RightSideBarProps) => {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    router.push('/login');
  }, [router]);

  const handleProfile = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const handleNotifications = useCallback(() => {}, []);
  const handleMessages = useCallback(() => {}, []);
  const handleSettings = useCallback(() => {}, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black opacity-50" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-tertiary text-primary p-4 shadow-lg z-50 transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '250px' }}
      >
        <Flex direction="row" justify="end">
          <IconButton onClick={onClose}>
            <Cross2Icon />
          </IconButton>
        </Flex>

        <Flex direction="column" gap="2" className="mt-4">
          <Button
            variant="surface"
            className="bg-primary text-black"
            onClick={handleProfile}
          >
            Profile
          </Button>
          <Button
            variant="surface"
            className="bg-primary text-black"
            onClick={handleNotifications}
          >
            Notifications
          </Button>
          <Button
            variant="surface"
            className="bg-primary text-black"
            onClick={handleMessages}
          >
            Messages
          </Button>
          <Button
            variant="surface"
            className="bg-primary text-black"
            onClick={handleSettings}
          >
            Settings
          </Button>
        </Flex>

        <div className="absolute bottom-4 left-0 w-full px-4">
          <Card
            variant="surface"
            className="bg-white shadow-lg rounded-lg flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={handleLogout}
          >
            <Avatar
              className="w-10 h-10 rounded-full bg-gray-300 mr-3"
              alt="User Avatar"
              fallback={<PersonIcon className="w-6 h-6 text-black" />}
            />
            <Text className="text-black font-medium">Logout</Text>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RightSideBar;
