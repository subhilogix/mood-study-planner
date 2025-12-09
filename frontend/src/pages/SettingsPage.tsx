import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Switch } from "../components/ui/Switch";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { api } from "../api/api";

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("20:00");

  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

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

  const handleGoogleLogin = async () => {
    setCalendarLoading(true);
    setCalendarError(null);
    try {
      const { auth_url } = await api.getGoogleAuthUrl();
      window.location.href = auth_url;
    } catch (err: any) {
      console.error(err);
      setCalendarError(err.message || "Failed to open Google sign-in");
      setCalendarLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-mind-textMain">
          Settings
        </h1>
        <p className="text-sm text-mind-textSoft">
          Shape MindStudy to feel like a cozy, safe space for your brain.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-mind-textMain">Pastel light theme</p>
            <p className="text-xs text-mind-textSoft">
              Dark mode is not implemented yet, but will be soft too.
            </p>
          </div>
          <Switch checked={darkMode} onChange={setDarkMode} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily mood reminder (UI-only)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-mind-textMain">
              Remember to check in with yourself once a day.
            </p>
            <p className="text-xs text-mind-textSoft">
              This is just a local preference for now, not a real notification.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={dailyReminder}
              onChange={setDailyReminder}
            />
            <Input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-24"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Google Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-mind-textMain">
            Connect a single Google account to turn tasks into soft study
            blocks on your calendar.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              onClick={handleGoogleLogin}
              disabled={calendarLoading}
            >
              {calendarConnected
                ? "Reconnect Google Calendar"
                : "Connect Google Calendar"}
            </Button>
            <span className="text-xs text-mind-textSoft">
              Status:{" "}
              <span
                className={
                  calendarConnected ? "text-green-600" : "text-mind-textMuted"
                }
              >
                {calendarConnected ? "Connected" : "Not connected"}
              </span>
            </span>
          </div>
          {calendarError && (
            <p className="text-xs text-red-500">{calendarError}</p>
          )}
          <p className="text-[11px] text-mind-textMuted">
            For this prototype, the backend stores your calendar access in
            memory. Restarting the backend will disconnect until you sign in
            again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
