'use client';
import React from 'react';
import { FieldAttributes, FieldType } from '@/types';
import { Checkbox, Dropdown, TextInput } from '../Core';

const Field: React.FC<FieldAttributes> = (props) => {
  switch (props.type) {
    case FieldType.TEXT:
      return <TextInput {...props} />;
    case FieldType.SELECT:
      return <Dropdown {...props} />;
    case FieldType.CHECKBOX:
      return <Checkbox {...props} />;
    default:
      throw new Error('Invalid Field Type');
  }
};

export default Field;
