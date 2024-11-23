import { z } from 'zod';

export interface InputFieldProps {
  label: string;
  name: string;
  type:
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'hidden'
    | 'month'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';
}

enum FieldType {
  TEXT = 'text',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
}

export interface BaseFieldAttributes {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  gridWidth?: number;
  options?: { label: string; value: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<any>;
  value?: string;
}

interface InputFieldAttributes extends BaseFieldAttributes {
  type: FieldType.TEXT;
}

// IMPORTANT: By setting the type to FieldType.SELECT, we are telling TypeScript that the 'options' property is required.
interface SelectFieldAttributes extends BaseFieldAttributes {
  type: FieldType.SELECT;
  options: { label: string; value: string }[];
}

interface CheckboxFieldAttributes extends BaseFieldAttributes {
  type: FieldType.CHECKBOX;
}

type FieldAttributes =
  | InputFieldAttributes
  | SelectFieldAttributes
  | CheckboxFieldAttributes;

export {
  FieldType,
  type FieldAttributes,
  type InputFieldAttributes,
  type SelectFieldAttributes,
  type CheckboxFieldAttributes,
};
