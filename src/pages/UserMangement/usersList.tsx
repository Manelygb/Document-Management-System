
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { fetchUsers } from '../../store/slices/user.slice'
  import { RootState, AppDispatch } from '../../store/store';
  import FlexibleTable from "../../components/tables/BasicTables/tableraw";
  import Input from "../../components/form/input/InputField";
  import Button from "../../components/ui/button/Button";
  import FilterDropdown from "../../components/ui/dropdown/filterDropdown";
  import { tableData, columns } from "./tableData";
  
  import { operations } from "./filterData";
  
  export default function UserList() {
    const dispatch = useDispatch<AppDispatch>();
    const { users, loading, error, pagination } = useSelector((state: RootState) => state.users);
    
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 8;
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState({ column: "", operation: "", value: "" });
    const [columns, setColumns] = useState<{ key: string; label: string }[]>([]);

useEffect(() => {
  dispatch(fetchUsers({ page: currentPage, per_page: itemsPerPage }));
}, [dispatch, currentPage, itemsPerPage]);

useEffect(() => {
  if (users.length > 0) {
    const dynamicColumns = Object.keys(users[0]).map((key) => ({
      key,
      label: key // Convert snake_case to readable format
    }));
    setColumns(dynamicColumns);
  }
}, [users]);
  
    useEffect(() => {
      dispatch(fetchUsers({ page: currentPage, per_page: itemsPerPage }));
    }, [dispatch, currentPage, itemsPerPage]);
  
    const handleSelectRow = (id: number, checked: boolean) => {
      setSelectedUsers((prev) =>
        checked ? [...prev, id] : prev.filter((userId) => userId !== id)
      );
    };
  
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };
  
    const handleFilterChange = (field: string, value: string) => {
      setFilter((prev) => ({ ...prev, [field]: value }));
    };
  
    const filteredData = tableData.filter((item) => {
      const searchMatch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase());
    
      if (!filter.column || !filter.value) return searchMatch;
    
      const fieldValue = String(item[filter.column as keyof typeof item]).toLowerCase();
    
      const filterMatch =
        filter.operation === "contains"
          ? fieldValue.includes(filter.value.toLowerCase())
          : fieldValue === filter.value.toLowerCase();
    
      return searchMatch && filterMatch;
    });
  
    const totalPages = pagination.total_pages || 1;
  
    const handleSelectAll = (checked: boolean) => {
      setSelectedUsers(checked ? filteredData.map((user) => user.id) : []);
    };
  
    return (
      <div>
        
        <div className="flex justify-end items-center gap-2 mb-4">
          <Input placeholder="Search..." value={searchQuery} onChange={handleSearch} className="w-1/3" />
          <Button onClick={() => setIsFilterOpen(!isFilterOpen)}>Filter</Button>
          {isFilterOpen && (
            <FilterDropdown
              columns={columns}
              operations={operations}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              handleFilterChange={handleFilterChange}
            />
          )}
        </div> 
  
        
        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
  
        
        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1102px]">
                <FlexibleTable
                  columns={columns}
                  data={filteredData}
                  selectable
                  selectedRows={selectedUsers}
                  onSelectRow={handleSelectRow}
                  onSelectAll={handleSelectAll}
                  rowNavigationPath={() => `/profile`}
                />
              </div>
            </div>
          </div>
        )}
  
        
        <div className="flex justify-between mt-4">
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>
    );
  }
  
