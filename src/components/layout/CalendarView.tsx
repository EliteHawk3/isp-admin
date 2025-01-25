import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Calendar Event Interface
interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "payment" | "update" | "alert";
}

// Main Component
const CalendarView: React.FC = () => {
  // Events with Categories
  const events: CalendarEvent[] = [
    { id: "1", title: "New User Added: John Doe", date: "2025-01-01", type: "update" },
    { id: "2", title: "Payment Made: $250", date: "2025-02-01", type: "payment" },
    { id: "3", title: "System Maintenance", date: "2025-01-03", type: "alert" },
    { id: "4", title: "Plan Upgrade", date: "2025-01-04", type: "update" },
    { id: "5", title: "User Subscription Expired", date: "2025-01-05", type: "alert" },
  ];

  // Dynamic Color Assignment based on Event Type
  const getEventColor = (type: string) => {
    switch (type) {
      case "payment":
        return "#10B981"; // Green for payments
      case "update":
        return "#3B82F6"; // Blue for updates
      case "alert":
        return "#F59E0B"; // Yellow for alerts
      default:
        return "#6B7280"; // Gray for unknown types
    }
  };

  // Map Events to FullCalendar Format
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.date,
    backgroundColor: getEventColor(event.type), // Background Color
    borderColor: getEventColor(event.type),     // Border Color
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
   <FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  events={calendarEvents} // Pass dynamically formatted events
  height={500}
  headerToolbar={{
    left: "today prev,next",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  }}
  themeSystem="dark" // Custom dark theme
  eventContent={(arg) => (
    <div
      className="fc-event-custom"
      style={{
        padding: "5px 10px",
        borderRadius: "6px",
        fontSize: "0.85rem",
        lineHeight: "1.4",
        backgroundColor: arg.backgroundColor || "#3B82F6",
        color: "#fff",
        overflow: "hidden",
        whiteSpace: "normal", // Allow text wrapping
      }}
    >
      {arg.event.title}
    </div>
  )}
  eventMouseEnter={(info) => {
    info.el.style.transform = "scale(1.05)";
    info.el.style.transition = "transform 0.2s ease-in-out";
  }}
  eventMouseLeave={(info) => {
    info.el.style.transform = "scale(1.0)";
  }}
/>

    </div>
  );
};

export default CalendarView;
