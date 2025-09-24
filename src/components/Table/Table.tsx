import { Button, Spinner, Table, Text } from '@radix-ui/themes';
import React from 'react';

interface Column {
  header: string;
  accessor: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (row: any) => React.ReactNode;
}

interface Row {
  [key: string]: string | number | boolean | null | undefined;
}

interface AppTableProps {
  columns: Column[];
  data: Row[];
  isLoading?: boolean;
  isCreateEnabled?: boolean;
  onCreate?: () => void;
}

const AppTable: React.FC<AppTableProps> = ({
  columns,
  data,
  isLoading = false,
  isCreateEnabled = false,
  onCreate,
}) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        {isCreateEnabled && (
          <Button
            variant="solid"
            color="blue"
            className="ml-auto cursor-pointer"
            onClick={onCreate}
          >
            Create
          </Button>
        )}
      </div>
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
          {isLoading ? (
            <Table.Row>
              <Table.Cell
                colSpan={columns.length}
                className="border border-white200 p-2 text-center"
              >
                <div className="flex justify-center items-center">
                  <Spinner style={{ height: 30, width: 30 }} size="3" />
                </div>
              </Table.Cell>
            </Table.Row>
          ) : data.length === 0 ? (
            <Table.Row>
              <Table.Cell
                colSpan={columns.length}
                className="border border-white200 p-2 text-center"
              >
                <Text size={'3'} color="gray">
                  No data found
                </Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            data.map((row, rowIndex) => (
              <Table.Row key={rowIndex} className="hover:bg-paleBlue">
                {columns.map((column) => (
                  <Table.Cell
                    style={{ boxShadow: 'none' }}
                    key={column.accessor}
                    className="border border-white200 p-2"
                  >
                    {column.render ? column.render(row) : row[column.accessor]}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default AppTable;
