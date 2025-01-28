import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNotifications } from "../../context/NotificationsContext";
import { useUsers } from "../../context/UsersContext";
import { useTasks } from "../../context/TasksContext";
import {
  FiAlertCircle,
  FiBell,
  FiCheckCircle,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";
import { User } from "../../types/users";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "payment" | "notification" | "task" | "user-action";
  status?: "Pending" | "Sent" | "Paid" | "Overdue" | "Completed";
}

const CalendarView: React.FC = () => {
  const { notifications } = useNotifications();
  const { users, auditLogs } = useUsers();
  const { tasks, completedTasks } = useTasks();

  // Process notifications into events
  const notificationEvents: CalendarEvent[] = notifications.map((notif) => ({
    id: `notif-${notif.id}`,
    title: `Notification: ${notif.title}`,
    date: notif.date,
    type: "notification",
    status: notif.status,
  }));

  // Process user payments
  const paymentEvents: CalendarEvent[] = users.flatMap((user) =>
    user.payments.map((payment) => ({
      id: `payment-${payment.id}`,
      title: `Payment ${
        payment.status === "Pending" ? "Due" : "Received"
      } for ${user.name}`,
      date: payment.dueDate,
      type: "payment" as const,
      status: payment.status,
    }))
  );

  // Process audit log events
  // Add this utility function above the component
  const getUserName = (userId: string, users: User[]): string => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Deleted User";
  };

  // Then use it in audit log processing
  const auditEvents: CalendarEvent[] = auditLogs.map((log) => ({
    id: `audit-${log.timestamp}-${log.userId}`,
    title: `${log.action}: ${getUserName(log.userId, users)}`,
    date: log.timestamp,
    type: "user-action" as const,
  }));

  // Process tasks
  const taskEvents: CalendarEvent[] = [
    ...tasks.map((task) => ({
      id: `task-${task.id}`,
      title: `Task: ${task.title}`,
      date: task.dueDate || task.createdAt,
      type: "task" as const,
      status: "Pending" as const,
    })),
    ...completedTasks.map((task) => ({
      id: `task-complete-${task.id}`,
      title: `Completed: ${task.title}`,
      date: task.updatedAt,
      type: "task" as const,
      status: "Completed" as const,
    })),
  ];

  // Combine all events
  const allEvents: CalendarEvent[] = [
    ...notificationEvents,
    ...paymentEvents,
    ...auditEvents,
    ...taskEvents,
  ];

  // const getEventColor = (event: CalendarEvent) => {
  //   switch (event.type) {
  //     case "payment":
  //       return event.status === "Paid" ? "#10B981" : "#F59E0B";
  //     case "notification":
  //       return event.status === "Sent" ? "#3B82F6" : "#F59E0B";
  //     case "task":
  //       return event.status === "Completed" ? "#10B981" : "#F59E0B";
  //     case "user-action":
  //       return "#8B5CF6";
  //     default:
  //       return "#6B7280";
  //   }
  // };
  const getEventStyle = (event: CalendarEvent) => {
    const baseStyle = {
      backgroundColor: "",
      borderColor: "",
      color: "#fff",
      borderRadius: "6px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    };

    switch (event.type) {
      case "payment":
        baseStyle.backgroundColor =
          event.status === "Paid"
            ? "var(--color-success)"
            : "var(--color-warning)";
        break;
      case "notification":
        baseStyle.backgroundColor =
          event.status === "Sent"
            ? "var(--color-info)"
            : "var(--color-warning)";
        break;
      case "task":
        baseStyle.backgroundColor =
          event.status === "Completed"
            ? "var(--color-success)"
            : "var(--color-warning)";
        break;
      case "user-action":
        baseStyle.backgroundColor = "var(--color-purple)";
        break;
      default:
        baseStyle.backgroundColor = "var(--color-gray)";
    }

    baseStyle.borderColor = `${baseStyle.backgroundColor}50`;
    return baseStyle;
  };

  const getEventIcon = (type: string) => {
    const iconStyle = { marginRight: "6px", fontSize: "14px" };
    switch (type) {
      case "payment":
        return <FiDollarSign style={iconStyle} />;
      case "notification":
        return <FiBell style={iconStyle} />;
      case "task":
        return <FiCheckCircle style={iconStyle} />;
      case "user-action":
        return <FiUser style={iconStyle} />;
      default:
        return <FiAlertCircle style={iconStyle} />;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-900 p-4 h-full overflow-y-auto custom-scrollbar ">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        themeSystem="bootstrap5"
        events={allEvents.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.date,
          ...getEventStyle(event),
          extendedProps: { type: event.type },
        }))}
        height={450}
        headerToolbar={{
          left: "title",
          center: "today prev,next",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        viewClassNames="calendar-view"
        dayHeaderClassNames="day-header"
        dayCellClassNames="day-cell"
        eventClassNames="custom-event"
        eventContent={(arg) => (
          <div className="fc-event-content">
            <div className="flex items-center">
              {getEventIcon(arg.event.extendedProps.type)}
              <div className="truncate text-xs font-medium">
                {arg.event.title}
              </div>
            </div>
            {arg.event.start != null && arg.event.start.getHours() > 0 && (
              <div className="event-time text-xxs mt-1 opacity-80">
                {arg.event.start?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        )}
        eventDidMount={(info) => {
          info.el.style.cursor = "pointer";
          info.el.style.transition = "transform 0.2s, box-shadow 0.2s";
          info.el.addEventListener("mouseenter", () => {
            info.el.style.transform = "translateY(-1px)";
            info.el.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
          });
          info.el.addEventListener("mouseleave", () => {
            info.el.style.transform = "";
            info.el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
          });
        }}
        dayHeaderFormat={{ weekday: "short" }}
        fixedWeekCount={false}
        nowIndicator
      />
    </div>
  );
};

export default CalendarView;
