import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isDarkTheme: boolean;
}

export const SearchBar = ({ value, onChange, isDarkTheme }: SearchBarProps) => {
  return (
    <div className={`relative mb-6 ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search size={20} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search users..."
        className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-300 ${
          isDarkTheme
            ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400"
        }`}
      />
    </div>
  );
};