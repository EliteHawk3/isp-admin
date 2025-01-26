import { User } from "../types/users";

export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "03123456789",
    cnic: "12345-1234567-1",
    address: "123 Main Street, Karachi",
    packageId: "1", // Links to "Basic Plan"
    installationCost: 5000,
    discount: 2, // Flat discount amount
    discountType: "one-time", // Discount type
    payments: [
      {
        id: "p1-2024-12",
        userId: "1",
        packageId: "1",
        discountedAmount: 8, // 10 - 2 (discount)
        status: "Paid",
        date: "2024-12-01",
        paidDate: "2024-12-05",
        dueDate: "2024-12-31",
      },
      {
        id: "p1-2025-01",
        userId: "1",
        packageId: "1",
        discountedAmount: 8,
        status: "Pending",
        date: "2025-01-15",
        dueDate: "2025-02-01",
      },
    ],
    createdAt: "2024-11-01",
    lastPaidDate: "2024-12-05",
    dueDate: "2025-02-01",
    role: "user",
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "03211234567",
    cnic: "67890-9876543-2",
    address: "45 B Street, Lahore",
    packageId: "2", // Links to "Standard Plan"
    installationCost: 8000,
    discount: 5, // Flat discount amount
    discountType: "everytime", // Discount type
    payments: [
      {
        id: "p2-2024-11",
        userId: "2",
        packageId: "2",
        discountedAmount: 10,
        status: "Paid",
        date: "2024-11-01",
        paidDate: "2024-11-03",
        dueDate: "2024-11-30",
      },
      {
        id: "p2-2024-12",
        userId: "2",
        packageId: "2",
        discountedAmount: 10,
        status: "Paid",
        date: "2024-12-01",
        paidDate: "2024-12-05",
        dueDate: "2024-12-31",
      },
      {
        id: "p2-2025-01",
        userId: "2",
        packageId: "2",
        discountedAmount: 10,
        status: "Paid",
        date: "2025-01-10",
        paidDate: "2025-01-10",
        dueDate: "2025-02-10",
      },
    ],
    createdAt: "2024-10-15",
    lastPaidDate: "2025-01-10",
    dueDate: "2025-02-10",
    role: "user",
  },
  {
    id: "3",
    name: "Ali Ahmed",
    phone: "03345678901",
    cnic: "11223-4567890-3",
    address: "67 F Block, Islamabad",
    packageId: "3", // Links to "Premium Plan"
    installationCost: 10000,
    discount: 0, // Flat discount amount
    discountType: "one-time", // Discount type
    payments: [
      {
        id: "p3-2024-12",
        userId: "3",
        packageId: "3",
        discountedAmount: 20,
        status: "Overdue",
        date: "2024-12-01",
        dueDate: "2024-12-31",
      },
      {
        id: "p3-2025-01",
        userId: "3",
        packageId: "3",
        discountedAmount: 20,
        status: "Overdue",
        date: "2025-01-01",
        dueDate: "2025-02-05",
      },
    ],
    createdAt: "2024-11-10",
    lastPaidDate: undefined,
    dueDate: "2025-02-05",
    role: "user",
  },
];
