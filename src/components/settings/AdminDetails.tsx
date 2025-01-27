import { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import Modal from "react-modal";
import Avatar from "react-avatar";
import { FaEdit } from "react-icons/fa";

Modal.setAppElement("#root");

const modalStyles = {
  content: {
    background: "linear-gradient(to right, #1e293b, #0f172a)",
    color: "white",
    borderRadius: "10px",
    width: "400px",
    margin: "auto",
    padding: "20px",
    border: "none",
    animation: "fadeIn 0.5s ease-in-out",
  },
};

const avatars = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
  "https://i.pravatar.cc/100?img=5",
];

const AdminDetails = ({
  setTempProfilePic,
}: {
  setTempProfilePic: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { adminDetails, updateAdminDetails } = useAdmin(); // Context data
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const [isVerified, setIsVerified] = useState(false); // Verification state
  const [securityAnswer, setSecurityAnswer] = useState(""); // For verification
  const [tempDetails, setTempDetails] = useState({
    ...adminDetails,
    password: "",
  }); // Temporary admin details for editing
  const [confirmationModal, setConfirmationModal] = useState(false); // Save confirmation modal
  const [imagePickerOpen, setImagePickerOpen] = useState(false); // Image picker state

  // Handle field changes with new validation and restrictions
  const handleInputChange = (field: string, value: string) => {
    if (field === "name") {
      // Limit name length to 12 characters
      if (value.length <= 12) {
        setTempDetails((prev) => ({ ...prev, [field]: value }));
      }
    }

    if (field === "phone") {
      // Ensure phone starts with 0, only digits allowed, and limit to 11 characters
      if (
        /^\d*$/.test(value) &&
        value.length <= 11 &&
        (value === "" || value.startsWith("0"))
      ) {
        setTempDetails((prev) => ({ ...prev, [field]: value }));
      }
    }

    if (field === "password") {
      // Only digits allowed, limit to 8 characters
      if (/^\d*$/.test(value) && value.length <= 8) {
        setTempDetails((prev) => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleVerify = () => {
    if (securityAnswer === "admin123") {
      setIsVerified(true);
    } else {
      alert("Incorrect security answer!");
    }
  };

  const handleSave = () => {
    updateAdminDetails(tempDetails); // Save updated admin details
    setIsEditing(false);
    setIsVerified(false);
    setConfirmationModal(false);
  };

  const handleCancel = () => {
    setTempDetails({ ...adminDetails, password: "" });
    setIsEditing(false);
    setIsVerified(false);
  };

  const handleAvatarSelect = (imageUrl: string) => {
    setTempDetails((prev) => ({ ...prev, profilePic: imageUrl }));
    setTempProfilePic(imageUrl); // Update the temp profile pic in the parent
    setImagePickerOpen(false);
  };
  useEffect(() => {
    const storedImage = localStorage.getItem("adminProfilePic");
    if (storedImage) {
      setTempProfilePic(storedImage); // Use the prop function
    }
  }, [setTempProfilePic]); // Add the stable prop to the dependency array

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">Admin Details</h2>
      <div className="relative flex flex-col items-center gap-4">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={tempDetails.profilePic}
            alt="Admin"
            className="w-32 h-32 rounded-full mb-4 object-cover"
          />
          <button
            onClick={() => setImagePickerOpen(true)} // Open image picker without restrictions
            className="absolute bottom-2 right-2 p-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:scale-110 transition-all"
            title="Change Avatar"
          >
            <FaEdit />
          </button>
        </div>

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
              <div className="mt-4 flex flex-col items-center">
                <label className="block text-white mb-2 text-center">
                  Security Question: <em>What is your admin password?</em>
                </label>
                <input
                  type="password"
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
                  {/* Name */}
                  <label className="text-white w-full">
                    Name:
                    <input
                      type="text"
                      value={tempDetails.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
                    />
                  </label>
                  {/* Phone */}
                  <label className="text-white w-full">
                    Phone:
                    <input
                      type="text"
                      value={tempDetails.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
                    />
                  </label>
                  {/* Password */}
                  <label className="text-white w-full">
                    Password:
                    <input
                      type="password"
                      value={tempDetails.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
                    />
                  </label>
                  {/* Save and Cancel Buttons */}
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => setConfirmationModal(true)}
                      className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-6 py-2 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-6 py-2 rounded-md"
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

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmationModal}
        onRequestClose={() => setConfirmationModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark semi-transparent background
          },
          content: {
            width: "350px", // Small size
            margin: "auto",
            background: "linear-gradient(to bottom, #1e293b, #0f172a)", // Gradient dark theme
            border: "none",
            borderRadius: "12px",
            padding: "20px",
            color: "#f8fafc", // Text color
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <h2 className="text-xl font-semibold text-white text-center mb-4">
          Confirm Your Changes
        </h2>
        <ul className="mt-2 text-sm text-gray-300 space-y-2">
          <li>
            <strong>Name:</strong> {tempDetails.name || "N/A"}
          </li>
          <li>
            <strong>Phone:</strong> {tempDetails.phone || "N/A"}
          </li>
          <li>
            <strong>Password:</strong>{" "}
            {tempDetails.password ? "********" : "N/A"}
          </li>
        </ul>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
          >
            Confirm
          </button>
          <button
            onClick={() => setConfirmationModal(false)}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal
        isOpen={imagePickerOpen}
        onRequestClose={() => setImagePickerOpen(false)}
        style={modalStyles}
      >
        <h2 className="text-lg font-semibold mb-4">Pick an Avatar</h2>
        <div className="grid grid-cols-3 gap-4">
          {avatars.map((avatar, index) => (
            <button key={index} onClick={() => handleAvatarSelect(avatar)}>
              <Avatar src={avatar} round size="100" />
            </button>
          ))}
        </div>
        <button
          onClick={() => setImagePickerOpen(false)}
          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-md mt-4"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default AdminDetails;
