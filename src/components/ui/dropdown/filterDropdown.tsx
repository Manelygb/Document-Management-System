import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "../../../icons";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  selectedValue,
  onChange,
  placeholder = "Select option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex h-11 items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <span>{displayText}</span>
        <ChevronDownIcon className={`ml-2 size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  option.value === selectedValue
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
