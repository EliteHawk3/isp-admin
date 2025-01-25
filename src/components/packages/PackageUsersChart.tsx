// src/components/UsersChart.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
// Removed unused import of useUsers
// import { useUsers } from "../../context/UsersContext";
import { Package } from "../../types/packages";

// Register the required components for the chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PackageUsersChart = ({ packages = [] }: { packages: Package[] }) => {
  // Removed useUsers hook since userCount is now managed by SynchronizationComponent

  // Generate colors dynamically
  const generateColors = (count: number) => {
    const colors = ["#4ade80", "#3b82f6", "#f97316", "#eab308"];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  // Compute income for each package based on the updated userCount
  const packagesWithMetrics = packages.map((pkg) => {
    const income = pkg.users * pkg.cost;
    return { ...pkg, income };
  });

  if (!packages || packages.length === 0) {
    return (
      <div className="text-gray-400 text-center">Loading chart data...</div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-800 via-gray-800 to-blue-900 p-8 mt-6 rounded-lg shadow-2xl">
      <h2 className="text-lg font-semibold mb-6 text-gray-200">
        Income and Users Per Package
      </h2>
      <div className="w-full h-80">
        <Bar
          data={{
            labels: packagesWithMetrics.map(
              (pkg) => `${pkg.name} - PKR ${pkg.income.toFixed(2)}`
            ),
            datasets: [
              {
                label: "Number of Users",
                data: packagesWithMetrics.map((pkg) => pkg.users),
                backgroundColor: generateColors(packagesWithMetrics.length),
                hoverBackgroundColor: generateColors(
                  packagesWithMetrics.length
                ),
                borderWidth: 2,
                borderRadius: 12,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const pkg = packagesWithMetrics[context.dataIndex];
                    return `Users: ${
                      pkg.users
                    }, Income: PKR ${pkg.income.toFixed(2)}`;
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "#d1d5db",
                },
                grid: { display: false },
                title: {
                  display: true,
                  text: "Packages and Income",
                  color: "#d1d5db",
                  font: { size: 14 },
                },
              },
              y: {
                ticks: { color: "#d1d5db", stepSize: 1 },
                grid: { color: "#4b5563" },
                title: {
                  display: true,
                  text: "Number of Users",
                  color: "#d1d5db",
                  font: { size: 14 },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PackageUsersChart;
