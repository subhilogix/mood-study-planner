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
    <div
      className="
        min-h-screen bg-mind-bg text-mind-textMain 
        dark:bg-[#131214] dark:text-[#E6DFFF] 
        transition-colors
      "
    >
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 md:px-8">

        {/* ------------------------------------------------------------
             SIDEBAR
        ------------------------------------------------------------ */}
        <aside
          className="
            hidden w-64 shrink-0 rounded-2xl 
            bg-white/80 shadow-soft backdrop-blur-sm md:flex md:flex-col
            dark:bg-[#1F1B24] transition-colors
            border border-mind-border/40 dark:border-[#3A314D]
          "
        >
          {/* ----------------- NEW POLISHED LOGO SECTION ---------------- */}
          <div className="mb-6 flex items-center gap-3 px-2 mt-2">
            {/* Logo bubble */}
            <div
              className="
                h-12 w-12 rounded-full flex items-center justify-center shadow-sm
                bg-gradient-to-br from-[#E9D8FF] to-[#C7B3FF]
                dark:from-[#3B2A55] dark:to-[#5A3F8C]
              "
            >
              <span className="text-xl">📖</span>
            </div>

            {/* Text */}
            <div className="leading-tight">
              <div className="text-base font-semibold text-mind-textMain dark:text-[#E6DFFF]">
                MindStudy
              </div>
              <div className="text-xs text-mind-textSoft dark:text-[#BFAFE8]">
                Mood-first study planner
              </div>
            </div>
          </div>

          {/* ---------------------- NAVIGATION LINKS --------------------- */}
          <nav className="flex-1 space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all select-none",

                      isActive
                        ? `
                          bg-mind-primary/60 text-mind-textMain
                          dark:bg-[#7C5BDE]/40 dark:text-white
                          shadow-sm
                        `
                        : `
                          text-mind-textSoft hover:bg-mind-primary/30
                          dark:text-[#BFAFE8] dark:hover:bg-[#2E263D]
                        `
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* ------------------------------------------------------------
             MAIN CONTENT AREA
        ------------------------------------------------------------ */}
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="
              rounded-2xl bg-white/80 p-4 md:p-6 shadow-soft backdrop-blur-sm 
              dark:bg-[#1F1B24] border border-mind-border/40 dark:border-[#3A314D]
              transition-colors
            "
          >
            {children}
          </motion.div>
        </main>

      </div>
    </div>
  );
};

export default Layout;
