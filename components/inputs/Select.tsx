import { SelectViewport } from '@radix-ui/react-select';
import {
  SelectContent,
  Select as SelectComponent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { LucidePlusCircle } from 'lucide-react';

interface SelectProps {
  options: { value: string; label: string; disabled?: boolean }[];
  value: string | undefined;
  onChange: (value: string) => void;
  onAddNewOption?: () => void;
  addNewOptionLabel?: string;
  placeholder?: string;
  label?: string;
  labelSize?: 'xs' | 'sm' | 'md';
  id?: string;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  className = '',
  value,
  onChange,
  onAddNewOption,
  addNewOptionLabel,
  placeholder = '',
  label,
  labelSize = 'md',
  id,
  disabled = false,
}) => {
  const handleOnChange = (value: string) => {
    if (value === 'add-new') {
      onAddNewOption?.();
    }
    onChange(value);
  };

  const optionsWithAddNewOption = onAddNewOption
    ? [
        {
          value: 'add-new',
          label: addNewOptionLabel ?? `Add new`,
        },
        ...options,
      ]
    : options;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {label && (
        <label htmlFor={id} className={`text-${labelSize}`}>
          {label}
        </label>
      )}
      <SelectComponent
        value={value || ''}
        onValueChange={handleOnChange}
        name={id}
        disabled={disabled}>
        <SelectTrigger aria-label={placeholder} disabled={disabled}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectViewport>
            <SelectGroup>
              {optionsWithAddNewOption.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option?.disabled}>
                  <div className="flex items-center gap-2">
                    {option.label}
                    {option.value === 'add-new' && (
                      <LucidePlusCircle size={14} />
                    )}
                  </div>
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
