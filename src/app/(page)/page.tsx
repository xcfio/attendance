"use client"

import { columns, Student } from "./columns"
import { DataTable } from "./data-table"
import { student } from "@/text/students"
import { CurrentStudent } from "@/text/current-student"
import { useState, useMemo } from "react"

function getStudentData(): Student[] {
    const list: Student[] = []
    student.forEach((value, key) => {
        if (CurrentStudent.has(key)) {
            list.push({
                roll: value.roll,
                name: value.name,
                reg: value.reg,
                class: value.class,
                father: value.father,
                mother: value.mother,
                subjects: value.subjects,
                isCurrent: CurrentStudent.has(key)
            })
        }
    })
    return list.sort((a, b) => a.roll.localeCompare(b.roll))
}

export default function StudentPage() {
    const data = useMemo(() => getStudentData(), [])

    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {}
        data.forEach((student) => {
            if (student.isCurrent) {
                initial[student.roll] = true
            }
        })
        return initial
    })

    return (
        <div>
            <DataTable
                columns={columns}
                data={data}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                getRowId={(row) => row.roll}
            />

            <hr />
            <div className="mt-4">
                <h2 className="text-lg font-semibold">Selected Students:</h2>
                {Object.keys(rowSelection)
                    .filter((roll) => rowSelection[roll])
                    .map((roll) => (
                        <p key={roll}>{roll}</p>
                    ))}
            </div>
        </div>
    )
}
