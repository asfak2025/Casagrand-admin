import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  placeholder: string;
  loading: boolean;
  searchbtn?: boolean;
  className?: string;
  bodycls?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch,placeholder,searchbtn,className, bodycls ,loading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(e);
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onSearch(e);
  };
  console.log("===>",bodycls)

  return (
    <div className={`relative ${bodycls}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
  type="text"
  value={value}
  onChange={(e) => onChange(e.target.value)} // Just updates state
  onKeyDown={handleKeyDown} // Calls onSearch only on Enter
  placeholder={placeholder}
  className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${className}`}
/>

      </div>
      {searchbtn && (
        <button
          onClick={handleButtonClick}
          disabled={loading || !value.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      )}
    </div>
  );
};

export default SearchBar;


// interface SearchBarProps {
//   placeholder: string;
//   value: string;
//   onChange: (value: string) => void;
//   loading?: boolean;
//   onSearch?: () => void;
//   searchbtn?: boolean;
// }

// const SearchBar = ({
//   placeholder,
//   value,
//   onChange,
//   loading = false,
//   onSearch,
//   searchbtn = true,
// }: SearchBarProps) => {
//   return (
//     <div className="relative">
//       <input
//         type="text"
//         placeholder={placeholder}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="pl-4 pr-10 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       {loading && (
//         <div className="absolute right-3 top-2.5">
//           <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 rounded-full"></div>
//         </div>
//       )}
//       {searchbtn && onSearch && (
//         <button
//           onClick={onSearch}
//           className="absolute right-2 top-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-medium transition-colors duration-200"
//           disabled={loading}
//         >
//           Search
//         </button>
//       )}
//     </div>
//   );
// };

// export default SearchBar;