import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table/index";

interface TableComponentProps {
  header: string[];
  data: Record<string, any>[];
  renderRow?: (row: Record<string, any>, rowIndex: number) => React.ReactNode;
  footerEnable?: boolean;
  footerElements?: React.ReactNode;
  borderNone?: boolean;
  className?: string;
  scrollbarHide?: boolean;
}

function TableComponent({
  header,
  data,
  renderRow,
  footerEnable = false,
  footerElements,
  borderNone = false,
  className = "",
  scrollbarHide = false,
}: TableComponentProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
      {/* Table Container */}
       <div
      className={`rounded-lg ${borderNone ? "border-none" : "border border-gray-200 shadow-md"}  min-h-min overflow-auto relative ${scrollbarHide ? "scrollbar-hide" : ""} ${className}`}
      style={{ scrollbarWidth: "thin" }}
    >
        <Table className="w-full">
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
            <TableRow className="border-b-2 border-gray-200">
              {header.map((item, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className="py-4 px-6 text-left text-sm font-bold text-gray-800 tracking-wide uppercase border-r border-gray-200 last:border-r-0"
                >
                  <div className="flex items-center space-x-2">
                    <span>{item}</span>
                    {/* Optional sort icon */}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.length > 0 ? (
              data.map((row, rowIndex) =>
                renderRow ? (
                  React.cloneElement(
                    renderRow(row, rowIndex) as React.ReactElement,
                    { key: rowIndex }
                  )
                ) : (
                  <TableRow
                    key={rowIndex}
                    className="border-b border-gray-100 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                  >
                    {header.map((key, cellIndex) => (
                      <TableCell
                        key={key}
                        className="px-6 py-4 text-left text-sm text-gray-700 border-r border-gray-100 last:border-r-0 group-hover:text-gray-900"
                      >
                        <div className="flex items-center">
                          {typeof row[key] === "object"
                            ? "Object"
                            : row[key] ?? "-"}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={header.length}
                  className="text-center py-16 h-[40vh]"
                >
                  <div className="flex flex-col justify-center items-center">
                    {/* Empty state icon */}
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800 text-xl mb-2">No Data Found</h3>
                      <p className="text-gray-500">There are no records to display at the moment.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      {footerEnable && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-xl">
          <div className="p-4">
            {footerElements}
          </div>
        </div>
      )}

      {/* Data count indicator */}
      {data?.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 rounded-b-xl">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Showing {data.length} records</span>
           
          </div>
        </div>
      )}
    </div>
  );
}

export default TableComponent;