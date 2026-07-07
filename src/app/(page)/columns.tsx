"use client"

import { ColumnDef } from "@tanstack/react-table"
import { useEffect, useRef, HTMLProps } from "react"

export type Student = {
    roll: string
    name: string
    reg: string
    class: string
    father: string
    mother: string
    subjects: string[]
    isCurrent: boolean
}

function IndeterminateCheckbox({
    indeterminate,
    className = "",
    ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (ref.current && typeof indeterminate === "boolean") {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate, rest.checked])

    return (
        <input
            type="checkbox"
            ref={ref}
            className={
                className + " h-4 w-4 rounded border-input text-primary focus:ring-ring accent-primary cursor-pointer"
            }
            {...rest}
        />
    )
}

export const columns: ColumnDef<Student>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center px-1">
                <IndeterminateCheckbox
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center px-1">
                <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "roll",
        header: "Roll",
        cell: ({ row }) => {
            const roll = row.getValue("roll") as string
            return <span className="font-mono font-medium text-muted-foreground">{roll}</span>
        }
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const name = row.getValue("name") as string
            return <span className="font-semibold text-foreground">{name}</span>
        }
    }
]
