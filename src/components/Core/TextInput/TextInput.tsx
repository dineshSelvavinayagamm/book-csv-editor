import React from 'react';
import * as Label from '@radix-ui/react-label';
import { Box, TextField } from '@radix-ui/themes';
import { InputFieldProps } from '@/types';

const TextInput: React.FC<InputFieldProps> = ({ label, name, type }) => {
  return (
    <Box>
      <Label.Root htmlFor={name}>{label}</Label.Root>
      <TextField.Root
        id={name}
        name={name}
        type={type}
        size="3"
        placeholder={`Enter ${label}`}
      />
    </Box>
  );
};

export default TextInput;
