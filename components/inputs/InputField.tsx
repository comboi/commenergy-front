import { HTMLInputTypeAttribute } from 'react';
import { Input } from '../ui/input';

interface Props {
  label: string;
  name: string;
  type?: HTMLInputTypeAttribute;
  value: string | number;
  onChange: (value: string | number, name: string) => void;
}

const InputField = ({ label, name, type = 'text', value, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor={name}>{label}</label>
      <Input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          e.preventDefault();
          const value =
            type === 'number' ? Number(e.target.value) : e.target.value;
          onChange(value, name);
        }}
      />
    </div>
  );
};

export default InputField;
