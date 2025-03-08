import { ReactNode } from "react";
import Checkbox from "../../form/input/Checkbox";


// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode;
  onSelectAll : (checked : boolean) => void;
  isAllSelected : boolean;
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  isHeader?: boolean; 
  children: ReactNode;
  isSelected? : boolean;
  onSelect? : (checked : boolean) => void;// Cells (th or td)
  className?: string; // Optional className for styling
  onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full table-auto ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children,onSelectAll, isAllSelected, className }) => {
  return (
    <thead className={className}>
      <tr className="w-full"> {/* Ensure proper table width */}
        <th className="p-2 w-10"> {/* Adjust width to match row checkbox */}
          <Checkbox checked={isAllSelected} onChange={onSelectAll} />
        </th>
        
        {children}
        
      </tr>
    </thead>
  );
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ isHeader,children, isSelected, onSelect, className, onClick }) => {
  return (
    <tr className={`w-full table-fixed ${className}`} onClick={onClick}>
      {!isHeader && onSelect && (
        <td className="p-2 w-10"> {/* Keep width consistent */}
          <Checkbox checked={isSelected} onChange={onSelect} />
        </td>
      )}
      {children}
    </tr>
  );
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={` ${className}`}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
