import { Notification } from "../types/notifications";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Payment Reminder",
    body: "Your payment for the 50 Mbps plan is overdue. Please settle it soon.",
    date: "2024-01-15",
    status: "Pending",
    users: [
      {
        id: "user1",
        name: "John Doe",
        phone: "123456789",
        cnic: "12345-6789012-3",
        address: "123 Main Street",
        packageId: "package1",
        installationCost: 50,
        discount: 10,
        active: true,
        password: "12345123@john", // Example password

        discountType: "everytime",
        payments: [
          {
            id: "payment1",
            userId: "user1",
            packageId: "package1",
            discountedAmount: 40,
            status: "Overdue",
            date: "2023-12-10",
            dueDate: "2023-12-20",
            paidDate: undefined,
            packageName: "50 Mbps Plan", // Adding package name
            costAtPaymentTime: 30, // Cost at the time of payment
            discountAtPaymentTime: 10, // Discount at the time of payment
          },
        ],
        createdAt: "2023-01-01",
        lastPaidDate: undefined,
        dueDate: "2023-12-20",
        role: "user",
      },
    ],
    relatedPackage: {
      id: "package1",
      name: "50 Mbps Plan",
      speed: 50,
      cost: 30,
      users: 100,
    },
    payments: [
      {
        id: "payment1",
        userId: "user1",
        packageId: "package1",
        discountedAmount: 40,
        status: "Overdue",
        date: "2023-12-10",
        dueDate: "2023-12-20",
        packageName: "50 Mbps Plan", // Adding package name here
        costAtPaymentTime: 30, // Including cost at payment time
        discountAtPaymentTime: 10, // Including discount at payment time
      },
    ],
  },
  {
    id: "2",
    title: "Promotion Alert",
    body: "Upgrade to our premium 100 Mbps plan and enjoy 20% off!",
    date: "2024-01-01",
    status: "Sent",
    users: [
      {
        id: "user2",
        name: "Jane Doe",
        phone: "987654321",
        cnic: "98765-4321987-6",
        address: "456 Elm Street",
        packageId: "package2",
        installationCost: 70,
        active: true,
        password: "12345123@john", // Example password
        discount: 15,
        discountType: "one-time",
        payments: [
          {
            id: "payment2",
            userId: "user2",
            packageId: "package2",
            discountedAmount: 50,
            status: "Paid",
            date: "2023-12-01",
            dueDate: "2023-12-10",
            paidDate: "2023-12-05",
            packageName: "100 Mbps Plan", // Adding package name
            costAtPaymentTime: 50, // Cost at the time of payment
            discountAtPaymentTime: 15, // Discount at the time of payment
          },
        ],
        createdAt: "2022-05-01",
        lastPaidDate: "2023-12-05",
        dueDate: "2023-12-10",
        role: "user",
      },
    ],
    relatedPackage: {
      id: "package2",
      name: "100 Mbps Plan",
      speed: 100,
      cost: 50,
      users: 200,
    },
    payments: [
      {
        id: "payment2",
        userId: "user2",
        packageId: "package2",
        discountedAmount: 50,
        status: "Paid",
        date: "2023-12-01",
        dueDate: "2023-12-10",
        packageName: "100 Mbps Plan", // Adding package name here
        costAtPaymentTime: 50, // Including cost at payment time
        discountAtPaymentTime: 15, // Including discount at payment time
      },
    ],
  },
];
