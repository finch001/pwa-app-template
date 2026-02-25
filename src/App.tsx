import { Routes, Route } from "react-router-dom";
import { Toaster } from "sileo";
import { Agentation } from "agentation";
import Home from "./pages/Home.tsx";
import Settings from "./pages/Settings.tsx";
import Layout from "./components/Layout.tsx";
import TimerHome from "./pages/tools/timer/TimerHome.tsx";
import NotesHome from "./pages/tools/notes/NotesHome.tsx";

/**
 * Routing Structure:
 *
 * Layout routes (with Dock navigation):
 * - Wrapped in <Layout> which provides the floating Dock nav bar
 * - Have access to the ScrollArea for content scrolling
 * - Examples: home page, settings, tool home pages
 *
 * Full-screen routes (no Layout):
 * - Rendered without <Layout> wrapper
 * - No Dock navigation visible
 * - Typically used for immersive sessions/flows
 * - Use navigate(path, { replace: true }) when leaving to prevent back-button confusion
 */

export default function App() {
  return (
    <>
      <Toaster position="top-center" options={{ fill: "var(--sileo-fill)" }} />
      {import.meta.env.DEV && <Agentation />}
      <Routes>
        {/* Layout routes — with Dock navigation */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tools/timer" element={<TimerHome />} />
          <Route path="/tools/notes" element={<NotesHome />} />
        </Route>

        {/* Full-screen routes — no Dock, no Layout */}
        {/* Add your immersive session routes here */}
      </Routes>
    </>
  );
}
