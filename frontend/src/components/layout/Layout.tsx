import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  CalendarClock,
  NotebookTabs,
  Timer,
  MessageCircle,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/planner", label: "Planner", icon: CalendarClock },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/journal", label: "Journal", icon: NotebookTabs },
  { to: "/pomodoro", label: "Pomodoro", icon: Timer },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/settings", label: "Settings", icon: Settings }
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-mind-bg text-mind-textMain">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 md:px-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 rounded-2xl bg-white/80 p-4 shadow-soft backdrop-blur-sm md:flex md:flex-col">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mind-primary/80">
              <span className="text-lg font-semibold text-mind-textMain">
                📖
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold text-mind-textMain">
                MindStudy
              </div>
              <div className="text-xs text-mind-textSoft">
                Mood-first study planner
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all",
                      isActive
                        ? "bg-mind-primary/80 text-mind-textMain shadow-soft"
                        : "text-mind-textSoft hover:bg-mind-primary/40"
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-4 rounded-2xl bg-mind-cardSoft p-3 text-xs text-mind-textSoft">
            <div className="mb-1 font-semibold text-mind-textMain">
              Pro tip 🌱
            </div>
            <p>Log your mood daily to let MindStudy gently tune your plan.</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl bg-white/80 p-4 shadow-soft backdrop-blur-sm md:p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
