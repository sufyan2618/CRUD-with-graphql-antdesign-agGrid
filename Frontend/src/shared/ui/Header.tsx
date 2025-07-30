import React from 'react';
import useThemeStore from '../../entities/theme/useThemeStore';
import { Moon, Sun, Plus } from 'lucide-react'; 

interface HeaderProps {
  onAddUser: () => void;
  totalUsers: number;
  currentPage: number;
}

export const Header: React.FC<HeaderProps> = ({ onAddUser, totalUsers, currentPage }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="flex-shrink-0 mb-6 space-y-4">
      {/* Main Header */}
      <div className={`flex justify-between items-center flex-wrap gap-4 p-5 md:p-6 rounded-xl shadow-sm border transition-colors duration-200 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center gap-4  min-w-0">
            <div className='flex flex-col'>
            <h1 className={`text-xl md:text-2xl font-semibold tracking-tight transition-colors duration-200 ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>
            User Management
          </h1>
          <p className={`mt-1 text-sm font-normal transition-colors duration-200 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Manage your users and their permissions
          </p>
            </div>
            <div className="flex-shrink-0 flex gap-4 flex-wrap">
        <div className={`p-4 md:p-5 rounded-lg border min-w-[140px] text-center transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="text-2xl font-semibold text-blue-500 mb-1">
            {totalUsers}
          </div>
          <div className={`text-xs uppercase tracking-wider transition-colors duration-200 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Total Users
          </div>
        </div>
        
        <div className={`p-4 md:p-5 rounded-lg border min-w-[140px] text-center transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="text-2xl font-semibold text-green-500 mb-1">
            {currentPage}
          </div>
          <div className={`text-xs uppercase tracking-wider transition-colors duration-200 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Current Page
          </div>
        </div>
      </div>
          
        </div>
        
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-lg transition-all duration-200 border ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300 hover:text-gray-100' 
                : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900'
            }`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Add User Button */}
          <button
            onClick={onAddUser}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition duration-200 ease-in-out flex items-center justify-center min-w-[120px]"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      {/* Stats/Info Bar */}
      
    </div>
  );
};
