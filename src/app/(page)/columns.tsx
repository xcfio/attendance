"use client"

import { tableFeatures, rowSelectionFeature, type ColumnDef } from "@tanstack/react-table"
import { useEffect, useRef, HTMLProps } from "react"

export type Student = {
    roll: string
    name: string
    reg: string
    isCurrent: boolean
}

// v9 requires features declared up front; columns/table share this reference
export const features = tableFeatures({ rowSelectionFeature })

export function IndeterminateCheckbox({
    indeterminate,
    className = "",
    checked = false,
    onClick,
    ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (ref.current && typeof indeterminate === "boolean") {
            ref.current.indeterminate = !checked && indeterminate
        }
    }, [ref, indeterminate, checked])

    return (
        <input
            type="checkbox"
            ref={ref}
            checked={checked}
            onClick={(e) => {
                e.stopPropagation()
                onClick?.(e)
            }}
            className={
                className + " h-4 w-4 rounded border-input text-primary focus:ring-ring accent-primary cursor-pointer"
            }
            {...rest}
        />
    )
}

export const columns: ColumnDef<typeof features, Student>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center px-1" onClick={(e) => e.stopPropagation()}>
                <IndeterminateCheckbox
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center px-1" onClick={(e) => e.stopPropagation()}>
                <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            </div>
        )
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
