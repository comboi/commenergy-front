import { SelectViewport } from '@radix-ui/react-select';
import {
  SelectContent,
  Select as SelectComponent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface SelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '',
  label,
  id,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {label && <label htmlFor={id}>{label}</label>}
      <SelectComponent value={value} onValueChange={onChange} name={id}>
        <SelectTrigger aria-label={placeholder}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectViewport>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectComponent>
    </div>
  );
};

export default Select;
