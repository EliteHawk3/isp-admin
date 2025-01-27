// src/components/settings/AdminDetails.tsx
import { useState } from "react";
import profilePic from "../../assets/10.jpg";

const AdminDetails = () => {
  const [adminDetails, setAdminDetails] = useState({
    id: "A001",
    name: "Faisal",
    phone: "+123 456 7890",
    profilePic: profilePic,
    password: "admin123",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const correctAnswer = "admin123";

  const handleVerify = () => {
    if (securityAnswer === correctAnswer) {
      setIsVerified(true);
    } else {
      alert("Incorrect security answer!");
    }
  };

  const handleSaveAdminDetails = () => {
    setIsEditing(false);
    setIsVerified(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsVerified(false);
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">Admin Details</h2>
      <div className="flex flex-col items-center gap-4">
        <img
          src={adminDetails.profilePic}
          alt="Admin"
          className="w-32 h-32 rounded-full mb-4 object-cover"
        />
        <p className="text-white">
          <strong>ID:</strong> {adminDetails.id}
        </p>
        <p className="text-white">
          <strong>Name:</strong> {adminDetails.name}
        </p>
        <p className="text-white">
          <strong>Phone:</strong> {adminDetails.phone}
        </p>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-2 rounded-md mt-6"
          >
            Edit
          </button>
        )}
        {isEditing && (
          <>
            {!isVerified ? (
              <div className="mt-4">
                <label className="block text-white mb-2 text-center">
                  Security Question: <em>What is your admin password?</em>
                </label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="w-full bg-gray-900 text-gray-300 p-2 rounded-md"
                />
                <button
                  onClick={handleVerify}
                  className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-6 py-2 rounded-md mt-4"
                >
                  Verify
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex flex-col gap-4">
                  <label className="text-white">
                    Name:
                    <input
                      type="text"
                      value={adminDetails.name}
                      onChange={(e) =>
                        setAdminDetails({
                          ...adminDetails,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
                    />
                  </label>
                  <label className="text-white">
                    Phone:
                    <input
                      type="text"
                      value={adminDetails.phone}
                      onChange={(e) =>
                        setAdminDetails({
                          ...adminDetails,
                          phone: e.target.value,
                        })
                      }
                      className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
                    />
                  </label>
                  <label className="text-white">
                    Password:
                    <input
                      type="password"
                      value={adminDetails.password}
                      onChange={(e) =>
                        setAdminDetails({
                          ...adminDetails,
                          password: e.target.value,
                        })
                      }
                      className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
                    />
                  </label>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSaveAdminDetails}
                      className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDetails;
