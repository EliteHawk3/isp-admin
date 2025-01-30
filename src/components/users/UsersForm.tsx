import React, { useState, useEffect, FormEvent } from "react";
import { User } from "../../types/users";
import { Package } from "../../types/packages";
import {
  UserIcon,
  PhoneIcon,
  IdentificationIcon,
  LockClosedIcon,
  LockOpenIcon,
  EyeIcon,
  EyeSlashIcon,
  MapPinIcon,
  TagIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline"; // or 'solid' for filled versions
interface UsersFormProps {
  user: User | null; // Null for new user creation
  onSubmit: (updatedUser: User) => void; // Callback for form submission
  onCancel: () => void; // Callback for form cancellation
  packages: Package[]; // List of packages for selection
}
// Updated password generation logic
const generateVisualPassword = (cnic: string, name: string): string => {
  const lastFourCnic = cnic.replace(/\D/g, "").slice(-4); // ✅ Extract last 4 digits of CNIC

  const cleanName = name.replace(/[^A-Za-z]/g, "").toLowerCase(); // ✅ Remove non-letters
  const firstFiveChars = cleanName.slice(0, 5); // ✅ Get first 5 characters (or less if name is short)

  const symbols = ["#", "$", "%", "&", "*"]; // ✅ Predefined set of symbols
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]; // ✅ Pick a random symbol

  return `${lastFourCnic}${randomSymbol}${firstFiveChars}`; // ✅ Combine elements
};

const UsersForm: React.FC<UsersFormProps> = ({
  user,
  onSubmit,
  onCancel,
  packages,
}) => {
  // Local state for form fields
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [cnic, setCnic] = useState(user?.cnic || "");
  const [address, setAddress] = useState(user?.address || "");
  const [installationCost, setInstallationCost] = useState(
    user?.installationCost?.toString() || ""
  );
  const [packageId, setPackageId] = useState(
    user?.packageId || packages[0]?.id || ""
  );
  const [discount, setDiscount] = useState(user?.discount?.toString() || "");
  const [discountType, setDiscountType] = useState<"one-time" | "everytime">(
    user?.discountType || "one-time"
  );
  const [dueDate, setDueDate] = useState(user?.dueDate || "");
  const [password, setPassword] = useState(""); // State for real-time generated password
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle visibility

  // Error map for validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  /**
   * If adding a new user, auto-set their `dueDate` one month from now.
   */
  useEffect(() => {
    if (user) {
      // For editing users, initialize with existing password
      setPassword(user.password || "");
    } else {
      // For new users, generate a password for preview
      setPassword(generateVisualPassword(cnic, name));

      // Set default due date for new users
      const now = new Date();
      const nextMonthDate = new Date(now.setMonth(now.getMonth() + 1))
        .toISOString()
        .split("T")[0];
      setDueDate(nextMonthDate);
    }
  }, [user, cnic, name]);

  /**
   * Format CNIC in XXXXX-XXXXXXX-X pattern.
   */
  const handleCnicChange = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 13); // ✅ Limit to 13 digits
    let formatted = numbers;

    if (numbers.length > 5) {
      formatted = `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }
    if (numbers.length > 12) {
      formatted = `${numbers.slice(0, 5)}-${numbers.slice(
        5,
        12
      )}-${numbers.slice(12)}`;
    }

    setCnic(formatted);
  };
  const handlePhoneChange = (value: string) => {
    let numbers = value.replace(/\D/g, ""); // ✅ Remove non-numeric characters
    if (!numbers.startsWith("03")) {
      numbers = "03"; // ✅ Force starting with 03
    }
    numbers = numbers.slice(0, 11); // ✅ Limit to 11 digits

    setPhone(numbers);
  };
  const handleNameChange = (value: string) => {
    const lettersOnly = value.replace(/[^A-Za-z\s]/g, ""); // ✅ Remove numbers & special characters
    if (lettersOnly.length <= 30) {
      setName(lettersOnly); // ✅ Limit to 30 characters
    }
  };

  const handleAddressChange = (value: string) => {
    if (value.length <= 60) {
      setAddress(value); // ✅ Limit address to 100 characters
    }
  };
  const handleInstallationCostChange = (value: string) => {
    const numbers = value.replace(/\D/g, ""); // ✅ Remove non-numeric characters
    setInstallationCost(numbers);
  };
  const handleDiscountCostChange = (value: string) => {
    const numbers = value.replace(/\D/g, ""); // ✅ Remove non-numeric characters
    setDiscount(numbers);
  };
  /**
   * Validate the form fields.
   * Adjust or remove constraints as needed for your actual environment.
   */
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Please enter the user's full name.";
    if (!/^0\d{10}$/.test(phone))
      newErrors.phone = "Phone number must start with '0' and be 11 digits.";
    if (!/^\d{5}-\d{7}-\d{1}$/.test(cnic))
      newErrors.cnic = "CNIC must be in the format XXXXX-XXXXXXX-X.";
    if (!installationCost || parseInt(installationCost, 10) <= 0)
      newErrors.installationCost = "Installation cost must be positive.";
    if (!discount || parseFloat(discount) < 0)
      newErrors.discount = "Discount cannot be empty or negative.";
    if (!packageId) newErrors.packageId = "Please select a valid package.";
    if (user && (!password || password.length < 6))
      newErrors.password = "Password must be at least 6 characters long.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * When user clicks "Save"
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedUser: User = {
      id: user?.id || Math.random().toString(36).substring(2, 9), // Generate random ID for new users
      name: name.trim(),
      phone,
      cnic,
      address,
      installationCost: parseInt(installationCost, 10),
      packageId,
      discount: parseFloat(discount),
      discountType,
      payments: user?.payments || [],
      createdAt: user?.createdAt || new Date().toISOString(),
      lastPaidDate: user?.lastPaidDate || "",
      dueDate,
      active: user?.active ?? true, // Keep existing status or default to active
      role: "user", // Default to 'user' and can't change via the form
      password: user ? password : "", // Password will be auto-generated in backend
    };

    onSubmit(updatedUser);
  };

  /**
   * Confirm switch to "everytime" discount type
   */
  const handleDiscountTypeChange = (type: "one-time" | "everytime") => {
    if (type === "everytime") {
      const confirmMessage =
        "Selecting 'Everytime' will apply this discount to every payment. Are you sure?";
      if (!window.confirm(confirmMessage)) return;
    }
    setDiscountType(type);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="user-form-modal"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 
                 rounded-2xl shadow-2xl flex flex-col gap-6 
                 border border-gray-700 max-w-lg w-full mx-4
                 animate-fade-in-up"
        noValidate
      >
        {/* Modal Title */}
        <div className="flex justify-center items-center mb-6">
          <h2
            id="user-form-modal"
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wide"
          >
            {user ? "Edit User" : "Add User"}
          </h2>
        </div>

        {/* Input Fields with Icons */}
        {[
          {
            field: name,
            setter: handleNameChange,
            placeholder: "Full Name",
            error: errors.name,
            icon: "user",
          },
          {
            field: phone,
            setter: handlePhoneChange, // Process value here

            placeholder: "Phone Number",
            error: errors.phone,
            icon: "phone",
          },
          {
            field: cnic,
            setter: handleCnicChange,
            placeholder: "CNIC",
            error: errors.cnic,
            icon: "id-card",
          },
        ].map(({ field, setter, placeholder, error, icon }) => (
          <div key={placeholder} className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none text-gray-400">
              {/* SVG Icons for each input */}
              {icon === "user" && <UserIcon className="w-5 h-5" />}
              {icon === "phone" && <PhoneIcon className="w-5 h-5" />}
              {icon === "id-card" && <IdentificationIcon className="w-5 h-5" />}
            </div>
            <input
              value={field}
              onChange={
                (e: React.ChangeEvent<HTMLInputElement>) =>
                  setter(e.target.value) // Pass sanitized value to setter
              }
              placeholder={placeholder}
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700/50 text-white transition-all
              ${
                error
                  ? "ring-2 ring-red-500"
                  : "ring-1 ring-gray-600 hover:ring-blue-500 focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {error && (
              <p className="text-red-400 text-sm mt-1 animate-shake">{error}</p>
            )}
          </div>
        ))}

        {/* Password Field with Proper Alignment */}
        {!user ? (
          <div className="relative flex flex-col">
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={password}
                readOnly
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700/50 text-white ring-1 ring-gray-600"
              />
            </div>
            <p className="text-sm text-gray-400 mt-1 text-center">
              Auto-generated password
            </p>
          </div>
        ) : (
          <div className="relative">
            <LockOpenIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-700/50 text-white ring-1 ring-gray-600 focus:ring-2 focus:ring-blue-500"
            />
            {/* Eye Toggle Button for Show/Hide Password */}
            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {passwordVisible ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        )}

        {/* Package Selection - Card Grid */}
        <div className="grid grid-cols-3 gap-3">
          {packages.map((pkg) => (
            <label
              key={pkg.id}
              className={`p-2 rounded-lg cursor-pointer transition-all text-center text-sm font-medium
        ${
          packageId === pkg.id
            ? "bg-gradient-to-br from-blue-600 to-purple-600 ring-2 ring-blue-400 text-white"
            : "bg-gray-700/50 ring-1 ring-gray-600 hover:ring-blue-400 text-gray-300"
        }`}
            >
              <input
                type="radio"
                value={pkg.id}
                checked={packageId === pkg.id}
                onChange={(e) => setPackageId(e.target.value)}
                className="hidden"
              />
              <div>{pkg.name}</div>
            </label>
          ))}
        </div>

        {/* Address Field */}
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Address"
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700/50 text-white ring-1 ring-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Installation Cost & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <CurrencyDollarIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              value={installationCost}
              onChange={(e) => handleInstallationCostChange(e.target.value)}
              placeholder="Installation Cost"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700/50 text-white ring-1 ring-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <TagIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              value={discount}
              onChange={(e) => handleDiscountCostChange(e.target.value)}
              placeholder="Discount"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700/50 text-white ring-1 ring-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Discount Type Toggle */}
        <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
          <span className="text-sm text-gray-300">Discount Type</span>
          <div
            className="relative flex items-center w-48 h-10 bg-gray-800 rounded-full p-1 cursor-pointer"
            onClick={() =>
              handleDiscountTypeChange(
                discountType === "one-time" ? "everytime" : "one-time"
              )
            }
          >
            <div
              className={`absolute w-1/2 h-8 bg-blue-600 rounded-full transform transition-transform ${
                discountType === "one-time"
                  ? "translate-x-0"
                  : "translate-x-full"
              }`}
            />
            <span
              className={`z-10 w-1/2 text-center text-sm transition-colors ${
                discountType === "one-time" ? "text-white" : "text-gray-400"
              }`}
            >
              One-Time
            </span>
            <span
              className={`z-10 w-1/2 text-center text-sm transition-colors ${
                discountType === "everytime" ? "text-white" : "text-gray-400"
              }`}
            >
              Everytime
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-all hover:scale-105"
          >
            <XMarkIcon className="w-5 h-5" />
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all hover:scale-105"
          >
            <CheckIcon className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsersForm;
