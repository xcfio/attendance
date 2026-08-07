"use client"

import React from "react"
import { useTable, flexRender, type RowSelectionState, type OnChangeFn } from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { columns, features, type Student } from "./columns"

interface DataTableProps {
    data: Student[]
    rowSelection?: RowSelectionState
    onRowSelectionChange?: OnChangeFn<RowSelectionState>
    extraRows?: React.ReactNode
}

export function DataTable({ data, rowSelection, onRowSelectionChange, extraRows }: DataTableProps) {
    const table = useTable<typeof features, Student>({
        features,
        columns,
        data,
        onRowSelectionChange,
        enableRowSelection: true,
        getRowId: (row) => row.roll,
        state: {
            ...(rowSelection === undefined ? {} : { rowSelection })
        }
    })

    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                onClick={row.getToggleSelectedHandler()}
                                className="cursor-pointer"
                            >
                                {row.getAllCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                    {extraRows}
                </TableBody>
            </Table>
        </div>
    )
}
