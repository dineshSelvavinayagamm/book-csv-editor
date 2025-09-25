import React from 'react';
import * as Label from '@radix-ui/react-label';
import { Box } from '@radix-ui/themes';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { CheckboxFieldAttributes } from '@/types';

const AppCheckbox: React.FC<CheckboxFieldAttributes> = ({ label, name }) => {
  return (
    <Box>
      <Checkbox.Root
        className="flex size-[25px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px_black]"
        defaultChecked
        id={name}
      >
        <Checkbox.Indicator className="text-violet11">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <Label.Root className="pl-[15px]" htmlFor={name}>
        {label}
      </Label.Root>
    </Box>
  );
};

export default AppCheckbox;
