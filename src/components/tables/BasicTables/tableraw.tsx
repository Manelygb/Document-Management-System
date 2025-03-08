import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { history } from "../../../utils";

interface Column {
  key: string; // The key in the data object
  label: string; // Column header name
}

interface FlexibleTableProps {
  columns: Column[]; // Column definitions
  data: any[]; // Table data
  selectable?: boolean; // If rows are selectable
  selectedRows?: number[]; // List of selected row IDs
  onSelectRow?: (id: number, checked: boolean) => void; // Row selection handler
  onSelectAll: (checked: boolean) => void; // Select all handler
  rowNavigationPath?: (row: any) => string;
}

const FlexibleTable: React.FC<FlexibleTableProps> = ({
  columns,
  data,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  rowNavigationPath,
}) => {
  return (
    <Table className="table-fixed w-full">
      {/* Table Header */}
      <TableHeader 
        onSelectAll={onSelectAll} 
        isAllSelected={selectedRows.length === data.length}
        className="border-b border-gray-100 dark:border-white/[0.05] w-full">
        {columns.map((col) => (
          <TableCell key={col.key} isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
            {col.label}
          </TableCell>
        ))}
      </TableHeader>

      {/* Table Body */}
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {data.map((row, index) => (
          <TableRow
            key={row.id ?? index} // Use row.id if available, otherwise fallback to index
            isSelected={selectedRows.includes(row.id)} 
            onSelect={(checked) => onSelectRow?.(row.id, checked)}
            onClick={() => {
                const path = rowNavigationPath ? rowNavigationPath(row) : "/";
                if (history.navigate) {
                  history.navigate(path);
                }
              }}
          >
            {columns.map((col) => (
              <TableCell key={col.key} className="px-4 py-4 text-start text-theme-sm dark:text-gray-400">
                {col.key === "status" ? (
                  <Badge
                    size="sm"
                    color={
                      row.status === "Active"
                        ? "success"
                        : row.status === "Inactive"
                        ? "warning"
                        : "error"
                    }
                  >
                    {row[col.key] ?? "-"} {/* Handle missing values */}
                  </Badge>
                ) : (
                  row[col.key] ?? "-" // Default to "-" if value is missing
                )}
              </TableCell>
            ))}
          </TableRow>
    ))}
      </TableBody>
    </Table>
  );
};

export default FlexibleTable;
