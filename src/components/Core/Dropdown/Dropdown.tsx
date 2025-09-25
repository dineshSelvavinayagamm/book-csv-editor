import { Label } from '@radix-ui/react-label';
import { Flex, Select } from '@radix-ui/themes';
import React from 'react';

export interface SelectFieldProps {
  label: string;
  name: string;
  value?: string;
  options: { label: string; value: string }[];
}
const Dropdown: React.FC<SelectFieldProps> = ({ name, label, options, value }) => (
  <Flex gap="3" direction={'column'}>
    <Label htmlFor={name}>{label}</Label>
    <Select.Root defaultValue={value} name={name}>
      <Select.Trigger radius="large" />
      <Select.Content>
        {options.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  </Flex>
);

export default Dropdown;
