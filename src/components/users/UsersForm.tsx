import React, { useState, useEffect, FormEvent } from "react";
import { User } from "../../types/users";
import { Package } from "../../types/packages";

interface UsersFormProps {
  /**
   * `user === null` means we are creating a new user (Add User).
   * Otherwise, we’re editing an existing user.
   */
  user: User | null;
  /**
   * Called when the form is submitted with a valid `User`.
   */
  onSubmit: (updatedUser: User) => void;
  /**
   * Called if the user cancels the form.
   */
  onCancel: () => void;
  /**
   * List of packages for user to select from.
   * Could be replaced by `usePackages()` if you prefer context in this component.
   */
  packages: Package[];
}

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

  // Error map for validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  /**
   * If adding a new user, auto-set their `dueDate` one month from now.
   */
  useEffect(() => {
    if (!user) {
      const now = new Date();
      const nextMonthDate = new Date(now.setMonth(now.getMonth() + 1))
        .toISOString()
        .split("T")[0];
      setDueDate(nextMonthDate);
    }
  }, [user]);

  /**
   * Format CNIC in XXXXX-XXXXXXX-X pattern.
   */
  const handleCnicChange = (value: string) => {
    const numbers = value.replace(/\D/g, "");
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

  /**
   * Validate the form fields.
   * Adjust or remove constraints as needed for your actual environment.
   */
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Please enter the user's full name.";
    }
    if (!/^0\d{10}$/.test(phone)) {
      newErrors.phone =
        "Phone number must start with '0' and be exactly 11 digits (e.g., 03001234567).";
    }
    if (!/^\d{5}-\d{7}-\d{1}$/.test(cnic)) {
      newErrors.cnic =
        "CNIC must be in the format XXXXX-XXXXXXX-X (e.g., 12345-6789012-3).";
    }
    if (!installationCost || parseInt(installationCost, 10) <= 0) {
      newErrors.installationCost =
        "Installation cost must be a positive number.";
    }
    if (!discount || parseFloat(discount) < 0) {
      newErrors.discount = "Discount cannot be empty or negative.";
    }
    if (!packageId) {
      newErrors.packageId = "Please select a valid package.";
    }
    // Only validate dueDate if we're editing an existing user
    if (user && !dueDate) {
      newErrors.dueDate = "Please provide the due date.";
    }

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
      // For new users, generate a random ID. Keep existing ID if editing.
      id: user?.id || Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      phone,
      cnic,
      address,
      installationCost: parseInt(installationCost, 10),
      packageId,
      discount: parseFloat(discount),
      discountType,
      role: user?.role || "user",
      payments: user?.payments || [],
      createdAt: user?.createdAt || new Date().toISOString(),
      lastPaidDate: user?.lastPaidDate || "",
      // Either the one auto-set for new users or the existing user's
      dueDate,
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
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
      aria-labelledby="user-form-modal"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 
                   rounded-2xl shadow-2xl flex flex-col gap-6 
                   border border-gray-700 max-w-lg w-full mx-4"
        noValidate
      >
        {/* Modal Title */}
        <h2
          id="user-form-modal"
          className="text-4xl font-bold text-white mb-6 tracking-wide text-center"
        >
          {user ? "Edit User" : "Add User"}
        </h2>

        {/* Name Field */}
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white ${
              errors.name ? "ring-2 ring-red-500" : "ring-1 ring-gray-600"
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Phone Field */}
        <div>
          <input
            type="text"
            placeholder="Phone Number (e.g., 03001234567)"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            maxLength={11}
            className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white ${
              errors.phone ? "ring-2 ring-red-500" : "ring-1 ring-gray-600"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* CNIC Field */}
        <div>
          <input
            type="text"
            placeholder="CNIC (e.g., 12345-6789012-3)"
            value={cnic}
            onChange={(e) => handleCnicChange(e.target.value)}
            maxLength={15}
            className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white ${
              errors.cnic ? "ring-2 ring-red-500" : "ring-1 ring-gray-600"
            }`}
          />
          {errors.cnic && <p className="text-red-500 text-sm">{errors.cnic}</p>}
        </div>

        {/* Package Selection */}
        <div>
          <select
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white ${
              errors.packageId ? "ring-2 ring-red-500" : "ring-1 ring-gray-600"
            }`}
          >
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} - {pkg.speed} Mbps ({pkg.cost} PKR)
              </option>
            ))}
          </select>
          {errors.packageId && (
            <p className="text-red-500 text-sm">{errors.packageId}</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white ring-1 ring-gray-600"
          />
        </div>

        {/* Installation Cost */}
        <div>
          <input
            type="text"
            placeholder="Installation Cost (e.g., 1000)"
            value={installationCost}
            onChange={(e) => setInstallationCost(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white ${
              errors.installationCost
                ? "ring-2 ring-red-500"
                : "ring-1 ring-gray-600"
            }`}
          />
          {errors.installationCost && (
            <p className="text-red-500 text-sm">{errors.installationCost}</p>
          )}
        </div>

        {/* Discount */}
        <div>
          <input
            type="text"
            placeholder="Discount (e.g., 200)"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white ${
              errors.discount ? "ring-2 ring-red-500" : "ring-1 ring-gray-600"
            }`}
          />
          {errors.discount && (
            <p className="text-red-500 text-sm">{errors.discount}</p>
          )}
        </div>

        {/* Discount Type */}
        <div className="flex gap-4 items-center">
          <label className="text-white">
            <input
              type="radio"
              name="discountType"
              value="one-time"
              checked={discountType === "one-time"}
              onChange={() => handleDiscountTypeChange("one-time")}
              className="mr-2"
            />
            One-Time
          </label>
          <label className="text-white">
            <input
              type="radio"
              name="discountType"
              value="everytime"
              checked={discountType === "everytime"}
              onChange={() => handleDiscountTypeChange("everytime")}
              className="mr-2"
            />
            Everytime
          </label>
        </div>

        {/* Due Date - Only editable if we're editing an existing user */}
        {user && (
          <div>
            <input
              type="date"
              placeholder="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white ${
                errors.dueDate ? "ring-2 ring-red-500" : "ring-1 ring-gray-600"
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm">{errors.dueDate}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsersForm;
