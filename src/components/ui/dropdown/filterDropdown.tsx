import React from "react";
import { Dropdown } from "./Dropdown";
import { DropdownItem } from "./DropdownItem";
import Input from "../../form/input/InputField";

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  handleFilterChange: (field: string, value: string) => void;
  columns: {key: string; label: string}[];
  operations: {value: string; label:string}[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ isOpen, onClose, handleFilterChange, columns, operations }) => {
  return (
    <Dropdown isOpen={isOpen} onClose={onClose} className="w-64 p-4">
      <div className="flex flex-col gap-2">
        <DropdownItem>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => handleFilterChange("column", e.target.value)}
          >
            <option value="">Select a Column</option>
            {columns.map((col)=> (
                <option key= {col.key} value={col.key}>
                    {col.label}
                </option>
            ))}
          </select>
        </DropdownItem>
        <DropdownItem>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => handleFilterChange("operation", e.target.value)}
          >
            <option value="">Select an Operation</option>
            {operations.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </DropdownItem>
        <DropdownItem>
          <Input
            className="w-full p-2 border rounded"
            placeholder="Value"
            onChange={(e) => handleFilterChange("value", e.target.value)}
          />
        </DropdownItem>
      </div>
    </Dropdown>
  );
};

export default FilterDropdown;
