import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Switch from "../components/ui/Switch";
import { Button } from "../components/ui/Button";
import { api } from "../api/api";
import { useTheme } from "../contexts/ThemeContext";

const SettingsPage: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();

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

  // ------------------ GOOGLE CONNECT ------------------
  const handleGoogleLogin = async () => {
    setCalendarLoading(true);
    setCalendarError(null);
    try {
      const { auth_url } = await api.getGoogleAuthUrl();
      window.location.href = auth_url;
    } catch (err: any) {
      setCalendarLoading(false);
      setCalendarError(err.message);
    }
  };

  // ------------------ GOOGLE DISCONNECT ------------------
  const handleGoogleDisconnect = async () => {
    if (!window.confirm("Disconnect Google Calendar?")) return;

    try {
      await api.disconnectGoogleCalendar();
      setCalendarConnected(false);
      alert("Google Calendar disconnected.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to disconnect Google Calendar.");
    }
  };

  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold 
          text-mind-textMain 
          dark:text-[#D9C8FF] 
          drop-shadow-sm"
        >
          Settings
        </h1>
        <p className="text-sm text-mind-textSoft dark:text-[#B8A2E0] mt-1">
          Shape MindStudy to feel like a cozy, safe space for your brain.
        </p>
      </div>

      {/* THEME CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm">Dark Mode</p>
            <p className="text-xs text-mind-textSoft dark:text-mind-textSoftDark">
              Switch between pastel light and soft dark UI.
            </p>
          </div>

          <Switch checked={darkMode} onChange={toggleTheme} />
        </CardContent>
      </Card>

      {/* GOOGLE CALENDAR */}
      <Card>
        <CardHeader>
          <CardTitle>Google Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!calendarConnected ? (
            <Button onClick={handleGoogleLogin} disabled={calendarLoading}>
              Connect Google Calendar
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={handleGoogleLogin}
              >
                Reconnect
              </Button>

              <Button
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={handleGoogleDisconnect}
              >
                Disconnect
              </Button>
            </div>
          )}

          <p className="text-xs">
            Status:{" "}
            <span
              className={calendarConnected ? "text-green-600" : "text-red-500"}
            >
              {calendarConnected ? "Connected" : "Not connected"}
            </span>
          </p>

          {calendarError && (
            <p className="text-red-500 text-xs">{calendarError}</p>
          )}
        </CardContent>
      </Card>

      {/* LOGOUT BUTTON */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
