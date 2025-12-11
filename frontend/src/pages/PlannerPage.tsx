import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import NewTaskForm from "../components/tasks/NewTaskForm";
import TaskList from "../components/tasks/TaskList";
import { api } from "../api/api";

const PlannerPage: React.FC = () => {
  const [calendarConnected, setCalendarConnected] = useState(false);

  // ✔ Load calendar connection status (same as Settings)
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const res = await api.getGoogleCalendarStatus();
        setCalendarConnected(res.connected);
      } catch (err) {
        console.error(err);
      }
    };
    loadStatus();
  }, []);

  // ✔ Direct Google OAuth login
  const connectCalendar = async () => {
    try {
      const { auth_url } = await api.getGoogleAuthUrl();
      window.location.href = auth_url; // Direct Google OAuth — NOT Settings page
    } catch (err) {
      console.error(err);
      alert("Error connecting to Google Calendar.");
    }
  };

  return (
    <div className="space-y-6">

      {/* ---------------- HEADER WITH CONNECT BUTTON ---------------- */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold 
              text-mind-textMain 
              dark:text-[#D9C8FF] 
              drop-shadow-sm"
          >
            Study Planner
          </h1>
          <p className="text-sm text-mind-textSoft dark:text-[#B8A2E0] mt-1">
            Import tasks from your brain, not your stress. Keep things light and realistic.
          </p>
        </div>

        {/* ⭐ CONNECT CALENDAR BUTTON ⭐ */}
        <button
          onClick={connectCalendar}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all shadow-soft
            ${
              calendarConnected
                ? "bg-green-600 text-white dark:bg-green-500"
                : "bg-mind-primaryDeep text-white dark:bg-[#7A5BDB] dark:hover:bg-[#9A7FFF]"
            }
          `}
        >
          📅 {calendarConnected ? "Calendar Connected ✓" : "Connect Calendar"}
        </button>
      </div>

      {/* ⭐ Add Task Form Section ⭐ */}
      <Card className="bg-mind-primarySoft/20 rounded-2xl border border-mind-border/20 shadow-sm dark:bg-[#2C2435] dark:border-[#3A314D]">
        <CardHeader>
          <CardTitle className="text-mind-textMain dark:text-[#E9DFFF]">
            Add a gentle task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NewTaskForm />
        </CardContent>
      </Card>

      {/* ⭐ Task List Section ⭐ */}
      <Card className="bg-mind-cardSoft/60 rounded-2xl border border-mind-border/20 shadow-sm dark:bg-[#2C2435] dark:border-[#3A314D]">
        <CardHeader>
          <CardTitle className="text-mind-textMain dark:text-[#E9DFFF]">
            Your tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlannerPage;
