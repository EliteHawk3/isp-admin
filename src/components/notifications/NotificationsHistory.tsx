import { FC, useState } from "react";
import { useNotifications } from "../../context/NotificationsContext";

const NotificationsHistory: FC = () => {
  const { notifications } = useNotifications(); // Access notifications from context
  const [selectedNotification, setSelectedNotification] = useState<
    (typeof notifications)[0] | null
  >(null);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-lg max-h-[80vh] overflow-y-auto custom-scrollbar">
      <h2 className="text-lg font-extrabold text-white mb-6">
        Notification History
      </h2>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-400">
            <th className="py-2 px-3">Title</th>
            <th className="py-2 px-3">Body</th>
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">Recipients</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr
              key={notification.id}
              onClick={() => setSelectedNotification(notification)}
              className="cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 transition-colors"
            >
              <td className="py-2 px-3 font-bold text-blue-400">
                {notification.title}
              </td>
              <td className="py-2 px-3 text-gray-300 truncate">
                {notification.body}
              </td>
              <td className="py-2 px-3 text-gray-400">
                {new Date(notification.date).toLocaleDateString()}
              </td>
              <td className="py-2 px-3 text-gray-300">
                {notification.users.length} user(s)
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Notification Details */}
      {selectedNotification && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="notification-details-title"
        >
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-xl text-white w-[90%] sm:w-[400px]">
            <h3
              id="notification-details-title"
              className="text-xl font-bold mb-4"
            >
              {selectedNotification.title}
            </h3>
            <p className="mb-4 text-gray-300">{selectedNotification.body}</p>
            <p className="mb-2 text-gray-400">
              Sent on:{" "}
              <span className="text-gray-200">
                {new Date(selectedNotification.date).toLocaleString()}
              </span>
            </p>
            <h4 className="text-lg font-semibold mb-2 text-gray-300">
              Recipients:
            </h4>
            <ul className="list-disc list-inside text-gray-300 max-h-[150px] overflow-y-auto custom-scrollbar">
              {selectedNotification.users.map((user) => (
                <li key={user.id}>
                  {user.name} ({user.id})
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedNotification(null)}
                className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-lg hover:from-red-600 hover:to-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsHistory;
