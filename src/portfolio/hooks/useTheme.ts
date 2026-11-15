import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark"; // افتراضي دارك
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return null;
}

function getTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

let currentTheme = getTheme();
const listeners = new Set<() => void>();

function applyTheme(theme: Theme) {
  const html = document.documentElement;

  // إزالة جميع الكلاسات
  html.classList.remove("light", "dark");

  // إضافة الكلاس المناسب
  if (theme === "dark") {
    html.classList.add("dark");
    html.classList.remove("light");
  } else {
    html.classList.add("light");
    html.classList.remove("dark");
  }
}

function setTheme(theme: Theme) {
  currentTheme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {}
  applyTheme(theme);
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return currentTheme;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme]);

  const setThemeValue = useCallback((t: Theme) => {
    setTheme(t);
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme: setThemeValue,
    isDark: theme === "dark",
  };
}

// ============================================
// INITIALIZATION - يتم تشغيلها مرة واحدة
// ============================================
if (typeof window !== "undefined") {
  // 1. التحقق من التخزين المحلي
  const stored = getStoredTheme();

  if (stored) {
    // 2. إذا كان هناك ثيم مخزن، استخدمه
    setTheme(stored);
  } else {
    // 3. وإلا استخدم تفضيل النظام
    setTheme(getSystemTheme());
  }

  // 4. الاستماع لتغيرات تفضيل النظام
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    // فقط غير إذا لم يكن هناك ثيم مخزن
    if (!getStoredTheme()) {
      setTheme(e.matches ? "dark" : "light");
    }
  };

  mediaQuery.addEventListener("change", handleSystemThemeChange);

  // 5. التنظيف عند إغلاق الصفحة
  window.addEventListener("beforeunload", () => {
    mediaQuery.removeEventListener("change", handleSystemThemeChange);
  });
}
