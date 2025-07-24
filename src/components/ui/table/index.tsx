// import { ReactNode } from "react";

// // Props for Table
// interface TableProps {
//   children: ReactNode; // Table content (thead, tbody, etc.)
//   className?: string; // Optional className for styling
// }

// // Props for TableHeader
// interface TableHeaderProps {
//   children: ReactNode; // Header row(s)
//   className?: string; // Optional className for styling
// }

// // Props for TableBody
// interface TableBodyProps {
//   children: ReactNode; // Body row(s)
//   className?: string; // Optional className for styling
// }

// // Props for TableRow
// interface TableRowProps {
//   children: ReactNode; // Cells (th or td)
//   className?: string; // Optional className for styling
// }

// // Props for TableCell
// interface TableCellProps {
//   children: ReactNode; // Cell content
//   isHeader?: boolean; // If true, renders as <th>, otherwise <td>
//   className?: string; // Optional className for styling
//   colSpan?: number; // Optional colSpan for cell spanning
// }

// // Table Component
// const Table: React.FC<TableProps> = ({ children, className }) => {
//   return <table className={`min-w-full  ${className}`}>{children}</table>;
// };

// // TableHeader Component
// const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
//   return <thead className={className}>{children}</thead>;
// };

// // TableBody Component
// const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
//   return <tbody className={className}>{children}</tbody>;
// };

// // TableRow Component
// interface TableRowProps {
//   children: ReactNode;
//   className?: string;
//   onClick?: React.MouseEventHandler<HTMLTableRowElement>;
// }

// const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => {
//   return (
//     <tr className={className} onClick={onClick}>
//       {children}
//     </tr>
//   );
// };

// // TableCell Component
// // const TableCell: React.FC<TableCellProps> = ({
// //   children,
// //   isHeader = false,
// //   className,
// // }) => {
// //   const CellTag = isHeader ? "th" : "td";
// //   return <CellTag className={` ${className}`}>{children}</CellTag>;
// // };

// const TableCell: React.FC<TableCellProps> = ({
//   children,
//   isHeader = false,
//   className,
//   colSpan,
// }) => {
//   const CellTag = isHeader ? "th" : "td";
//   return (
//     <CellTag className={className} colSpan={colSpan}>
//       {children}
//     </CellTag>
//   );
// };

// export { Table, TableHeader, TableBody, TableRow, TableCell };


import { ReactNode, ThHTMLAttributes } from "react";

// --- Props ---

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLTableRowElement>;
}

interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
  colSpan?: number;
}

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  className?: string;
}

// --- Components ---

const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full ${className}`}>{children}</table>;
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => {
  return (
    <tr className={className} onClick={onClick}>
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  colSpan,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag className={className} colSpan={colSpan}>
      {children}
    </CellTag>
  );
};

// ✅ New: TableHead for individual <th> usage
const TableHead: React.FC<TableHeadProps> = ({ children, className, ...props }) => {
  return (
    <th
      className={`px-4 py-3 text-sm font-semibold text-left text-gray-700 uppercase tracking-wide ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

// --- Exports ---
export { Table, TableHeader, TableBody, TableRow, TableCell, TableHead };
