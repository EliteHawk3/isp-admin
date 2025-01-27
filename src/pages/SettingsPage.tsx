// src/pages/SettingsPage.tsx
import React from "react";
import AdminDetails from "../components/settings/AdminDetails";
import OverviewStatistics from "../components/settings/OverviewStatistics";
import CompletedTasksComponent from "../components/settings/CompletedTasks";
import TaskComponent from "../components/settings/TaskComponent";

type SettingsPageProps = {
  setTempProfilePic: React.Dispatch<React.SetStateAction<string | null>>; // Add prop type
};

const SettingsPage: React.FC<SettingsPageProps> = ({ setTempProfilePic }) => {
  return (
    <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Details */}
        <AdminDetails setTempProfilePic={setTempProfilePic} />

        {/* Overview Statistics */}
        <OverviewStatistics />

        {/* Tasks */}
        <div className="lg:col-span-2">
          <TaskComponent />
        </div>

        {/* Completed Tasks */}
        <div className="lg:col-span-2">
          <CompletedTasksComponent />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
