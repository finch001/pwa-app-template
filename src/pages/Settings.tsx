import { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { sileo } from "sileo";
import StickyHeader from "../components/StickyHeader.tsx";
import {
  getSettings,
  saveSettings,
  type Settings as SettingsType,
  type ColorMode,
} from "../lib/settings.ts";

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>(getSettings);
  const [checking, setChecking] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log("SW Registered:", r);
    },
    onRegisterError(error: Error) {
      console.error("SW registration error", error);
    },
  });

  async function handleCheckUpdate() {
    setChecking(true);
    sileo.info({ title: "Checking for updates…" });
    try {
      const registration = await navigator.serviceWorker?.getRegistration();
      if (registration) {
        await registration.update();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!needRefresh) {
          sileo.success({ title: "Up to date" });
        } else {
          sileo.info({
            title: "Update available",
            description: "Click below to update",
          });
        }
      } else {
        sileo.success({ title: "Up to date" });
      }
    } catch {
      sileo.error({ title: "Check failed", description: "Please check your network connection" });
    } finally {
      setChecking(false);
    }
  }

  function update(patch: Partial<SettingsType>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
  }

  return (
    <div className="max-w-lg mx-auto pb-4">
      <StickyHeader>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white text-center">
          Settings
        </h1>
      </StickyHeader>
      <div className="px-4">
        {/* Appearance Section */}
        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          APPEARANCE
        </p>
        <div className="space-y-3 mb-8">
          <div className="bg-white dark:bg-[#16213e] rounded-2xl p-5 border border-gray-200 dark:border-gray-700/60">
            <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">
              Color Mode
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Choose light, dark, or system theme
            </p>
            <ToggleGroup
              value={[settings.colorMode]}
              onValueChange={(val) => {
                if (val.length > 0) update({ colorMode: val[0] as ColorMode });
              }}
              className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5"
            >
              {(
                [
                  ["system", "System"],
                  ["light", "Light"],
                  ["dark", "Dark"],
                ] as const
              ).map(([mode, label]) => (
                <Toggle
                  key={mode}
                  value={mode}
                  className="flex-1 py-2 rounded-[10px] text-sm font-bold text-center transition-colors cursor-pointer text-gray-500 dark:text-gray-400 data-[pressed]:bg-duo-green data-[pressed]:text-white"
                >
                  {label}
                </Toggle>
              ))}
            </ToggleGroup>
          </div>
        </div>

        {/* Update Section */}
        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          APP UPDATE
        </p>
        <div className="space-y-3 mb-8">
          <div className="bg-white dark:bg-[#16213e] rounded-2xl border border-gray-200 dark:border-gray-700/60 overflow-hidden">
            {needRefresh ? (
              <button
                onClick={() => updateServiceWorker(true)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-sm font-bold text-duo-green">
                    Update available
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">Click to update now</p>
                </div>
                <span className="text-xs font-bold text-white bg-duo-green rounded-full px-3 py-1">
                  Update
                </span>
              </button>
            ) : (
              <button
                onClick={handleCheckUpdate}
                disabled={checking}
                className="w-full px-5 py-4 flex items-center justify-between text-left disabled:opacity-50"
              >
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  {checking ? "Checking…" : "Check for updates"}
                </span>
                <span className="text-xs text-gray-400">
                  {__COMMIT_HASH__}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="text-center mt-4 mb-8 px-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">PWA Template</p>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
            A modern React PWA starter with Vite + Tailwind
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-3">
            Made with care by{" "}
            <a
              href="https://cali.so"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gray-400 dark:text-gray-500 underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2"
            >
              Cali
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
