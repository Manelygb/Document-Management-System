import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

// Reusable Metric Card Component
interface MetricCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  changeType?: "success" | "error"; // Restrict to specific values
}

export const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, change, changeType }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{value}</h4>
        </div>
        <Badge color={changeType}>
          {changeType === "success" ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {change}
        </Badge>
      </div>
    </div>
  );
};

export default function EcommerceMetrics() {
  // Explicitly define the type of metrics
  const metrics: MetricCardProps[] = [
    {
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Customers",
      value: "3,782",
      change: "11.01%",
      changeType: "success", 
    },
    {
      icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Orders",
      value: "5,359",
      change: "9.05%",
      changeType: "error", 
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}

