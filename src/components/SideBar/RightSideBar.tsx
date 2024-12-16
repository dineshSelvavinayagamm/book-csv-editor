'use client';
import React, { Component } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RightSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RightSideBarState {
  name: string;
  username: string;
  isSaving: boolean;
}

class RightSideBar extends Component<RightSideBarProps, RightSideBarState> {
  state: RightSideBarState = {
    name: 'Virat',
    username: 'Virat@123',
    isSaving: false,
  };

  handleChange =
    (field: keyof RightSideBarState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ [field]: event.target.value } as unknown as Pick<
        RightSideBarState,
        keyof RightSideBarState
      >);
    };

  handleSave = async () => {
    const { name, username } = this.state;
    this.setState({ isSaving: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Updated Profile:', { name, username });

      this.setState({ isSaving: false });

      this.props.onClose();
    } catch (error) {
      console.error('Failed to save data:', error);
      this.setState({ isSaving: false });
    }
  };

  render() {
    const { isOpen, onClose } = this.props;
    const { name, username, isSaving } = this.state;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={this.handleChange('name')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={this.handleChange('username')}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              className={`${
                isSaving ? 'bg-gray-400' : 'bg-gray-500'
              } text-white rounded-full p-1 w-32 mx-auto`}
              type="button"
              onClick={this.handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}

export default RightSideBar;
