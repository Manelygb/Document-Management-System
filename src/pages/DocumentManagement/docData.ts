export const documentsData = [
    {
      name: "Project Plan",
      number: 1,
      lastModified: "2024-02-20",
      version: "1.2",
      class: "Confidential",
      owner: "Alice Johnson",
      criticality: "High",
    },
    {
      name: "Financial Report Q1",
      number: 2,
      lastModified: "2024-03-05",
      version: "3.0",
      class: "Restricted",
      owner: "Bob Smith",
      criticality: "Medium",
    },
    {
      name: "Security Policy",
      number: 3,
      lastModified: "2024-01-15",
      version: "2.5",
      class: "Public",
      owner: "Charlie Adams",
      criticality: "Low",
    },
    {
      name: "Marketing Strategy",
      number: 4,
      lastModified: "2024-03-01",
      version: "1.0",
      class: "Internal",
      owner: "Diana Lee",
      criticality: "Medium",
    },
    {
      name: "Technical Specification",
      number: 5,
      lastModified: "2024-02-28",
      version: "4.1",
      class: "Confidential",
      owner: "Edward Baker",
      criticality: "High",
    },
    {
      name: "Employee Handbook",
      number: 6,
      lastModified: "2023-12-10",
      version: "5.0",
      class: "Public",
      owner: "Fiona Carter",
      criticality: "Low",
    },
    {
      name: "Annual Budget",
      number: 7,
      lastModified: "2024-02-18",
      version: "2.2",
      class: "Restricted",
      owner: "George Davis",
      criticality: "High",
    },
    {
      name: "Software Architecture",
      number: 8,
      lastModified: "2024-03-07",
      version: "3.3",
      class: "Internal",
      owner: "Helen Foster",
      criticality: "Medium",
    },
    {
      name: "Incident Response Plan",
      number: 9,
      lastModified: "2024-02-05",
      version: "1.1",
      class: "Confidential",
      owner: "Ian Thompson",
      criticality: "High",
    },
    {
      name: "Customer Survey Results",
      number: 10,
      lastModified: "2024-03-03",
      version: "2.0",
      class: "Public",
      owner: "Jane Parker",
      criticality: "Low",
    },
  ];
  
  export const columns = [
    { key: "name", label: "Name" },
    { key: "number", label: "Number" },
    { key: "lastModified", label: "Last Modified" },
    { key: "version", label: "Version" },
    { key: "class", label: "Class" },
    { key: "owner", label: "Owner" },
    { key: "criticality", label: "Criticality" },
    
  ];


  export const metricsData =[ 
    {
      label: "Total Documents",
      value: documentsData.length.toString()
    
    
    }, 
    {
      label: "Critical Document",
      value:  (documentsData.filter((doc) => doc.criticality === "High").length).toString()
      } 
];


export const operations = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "greater_than", label: "Greater Than" },
    { value: "less_than", label: "Less Than" },
  ];
  