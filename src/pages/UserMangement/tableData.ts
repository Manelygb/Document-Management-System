
export const tableData = [
    {
      id: 1,
      name: "Lance Gonzales",
      email: "josejohnson@example.org",
      hideDate: "2021-05-16",
      position: "Data Analyst",
      department: "Group",
      status: "On Leave",
    },
    {
      id: 2,
      name: "Jason Duncan",
      email: "owolfe@example.org",
      hideDate: "2023-05-23",
      position: "Data Analyst",
      department: "LLC",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Sherry Garcia",
      email: "curtisadam@example.com",
      hideDate: "2020-07-23",
      position: "Data Analyst",
      department: "PLC",
      status: "On Leave",
    },
    {
      id: 4,
      name: "Ryan Underwood",
      email: "clarktheresa@example.org",
      hideDate: "2022-01-10",
      position: "Senior Product Manager",
      department: "Group",
      status: "On Leave",
    },
    {
      id: 5,
      name: "Shannon Taylor",
      email: "roblesemily@example.org",
      hideDate: "2021-03-22",
      position: "UX Designer",
      department: "PLC",
      status: "Active",
    },
    {
      id: 6,
      name: "Jacob Ferrell",
      email: "ablackburn@example.org",
      hideDate: "2023-11-12",
      position: "Data Engineer",
      department: "and Sons",
      status: "Inactive",
    },
    {
      id: 7,
      name: "Aaron Colon",
      email: "kennethmorales@example.org",
      hideDate: "2022-01-29",
      position: "Senior Software Engineer",
      department: "Ltd",
      status: "Active",
    },
    {
      id: 8,
      name: "Megan Caldwell",
      email: "megancaldwell@example.org",
      hideDate: "2023-06-15",
      position: "Software Engineer",
      department: "Tech",
      status: "Active",
    },
    {
      id: 9,
      name: "Tyler Benson",
      email: "tylerbenson@example.org",
      hideDate: "2021-09-30",
      position: "Product Manager",
      department: "Marketing",
      status: "Inactive",
    },
    {
      id: 10,
      name: "Sophia Ramirez",
      email: "sophiaramirez@example.org",
      hideDate: "2022-12-20",
      position: "Data Scientist",
      department: "Research",
      status: "Active",
    },
    {
      id: 11,
      name: "Ethan Collins",
      email: "ethancollins@example.org",
      hideDate: "2020-08-05",
      position: "UX Researcher",
      department: "Design",
      status: "On Leave",
    },
    {
      id: 12,
      name: "Natalie Harper",
      email: "natalieharper@example.org",
      hideDate: "2023-03-18",
      position: "HR Specialist",
      department: "Human Resources",
      status: "Inactive",
    },
    {
      id: 13,
      name: "James O'Connor",
      email: "jamesoconnor@example.org",
      hideDate: "2021-11-07",
      position: "DevOps Engineer",
      department: "Infrastructure",
      status: "Active",
    },
    {
      id: 14,
      name: "Olivia Brooks",
      email: "oliviabrooks@example.org",
      hideDate: "2022-04-25",
      position: "Business Analyst",
      department: "Finance",
      status: "On Leave",
    },
    {
      id: 15,
      name: "Benjamin Carter",
      email: "bencarter@example.org",
      hideDate: "2020-12-11",
      position: "IT Support Specialist",
      department: "Support",
      status: "Active",
    },
  ];
  
  export const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "hideDate", label: "Hide Date" },
    { key: "position", label: "Position" },
    { key: "department", label: "Department" },
    { key: "status", label: "Status" },
  ];


  export const metricsData =[ 
    {
      label: "Total Users",
      value: tableData.length.toString()
    
    
    }, 
    {
      label: "Active Users",
      value:  (tableData.filter((user) => user.status === "Active").length).toString()
      } 
];
  