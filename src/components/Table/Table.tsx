import { Table } from '@radix-ui/themes';
import React from 'react';

interface Column {
  header: string;
  accessor: string;
}

interface Row {
  [key: string]: string | number;
}

interface AppTableProps {
  columns: Column[];
  data: Row[];
}

const AppTable: React.FC<AppTableProps> = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <Table.Root className="table-auto border-collapse border border-white200 w-full">
        <Table.Header>
          <Table.Row className="bg-white100">
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                style={{ boxShadow: 'none' }}
                key={column.accessor}
                className="border border-white200 p-2 text-left font-bold"
              >
                {column.header}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((row, rowIndex) => (
            <Table.Row key={rowIndex} className="hover:bg-paleBlue">
              {columns.map((column) => (
                <Table.Cell
                  style={{ boxShadow: 'none' }}
                  key={column.accessor}
                  className="border border-white200 p-2"
                >
                  {row[column.accessor]}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default AppTable;
