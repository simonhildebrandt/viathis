import React from 'react';
import useSWR from 'swr'

import { api } from './api';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table'

import { Link } from '@chakra-ui/react';


const fetcher = url => api.get(url).then(res => res.data)

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('createdAt', {
    cell: info => info.getValue()
  }),
  columnHelper.accessor('title', {
    cell: info => info.getValue()
  }),
  columnHelper.accessor('link', {
    cell: info => <Link href={info.getValue()}>{info.getValue()}</Link>
  }),
  columnHelper.accessor('description', {
    cell: info => info.getValue()
  })
];

export default function List() {
  const { data, error, isLoading } = useSWR('/list', fetcher);

  console.log({data})
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) return 'error';
  if (isLoading) return 'loading';

  return <table>
    <thead>
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody>
      {table.getRowModel().rows.map(row => (
        <tr key={row.id}>
          {row.getVisibleCells().map(cell => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
}
