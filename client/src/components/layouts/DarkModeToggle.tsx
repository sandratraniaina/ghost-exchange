import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/userTheme";

const DarkModeToggle = () => {
	const { theme, setTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<button
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 transition-all"
		>
			{isDark ? <Moon className="h-5 w-5 text-yellow-400" /> : <Sun className="h-5 w-5 text-gray-800" />}
		</button>
	);
};

export default DarkModeToggle;
