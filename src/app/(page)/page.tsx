"use client"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldContent } from "@/components/ui/field"
import { DatePicker } from "@/components/ui/date-picker"
import { CurrentStudent } from "@/text/current-student"
import { Button } from "@/components/ui/button"
import { columns, Student } from "./columns"
import { useState, useMemo } from "react"
import { student } from "@/text/students"
import { Subject } from "@/text/subject"
import { DataTable } from "./data-table"
import { toast } from "sonner"

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

const Semester = Number(process.env.NEXT_PUBLIC_SEMESTER) as 1 | 2 | 3 | 4 | 5 | 6 | 7

function getSubjectData(): Array<[number, string]> {
    const subject: Array<[number, string]> = []

    for (const [semester, department] of Subject) {
        if (semester !== Semester) continue
        for (const [code, name] of department) subject.push([code, name])
    }

    return subject
}

export default function StudentPage() {
    const [date, setDate] = useState<Temporal.PlainDate | undefined>(Temporal.Now.plainDateISO())
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
    const [selectedSubject, setSelectedSubject] = useState<string>("")
    const data = useMemo(() => getStudentData(), [])

    async function copy() {
        const id = toast.loading("Copying...")
        try {
            const subject = selectedSubject
            const time = date?.toLocaleString("en-UK", { day: "2-digit", month: "2-digit", year: "numeric" })
            const student = data.filter((row) => rowSelection[row.roll])

            const header = `Date: ${time}\n${subject ? `Subject: ${subject}` : ""}`

            const textArray = [
                "-".padEnd(subject.length + 9, "-"),
                header,
                "-".padEnd(subject.length + 9, "-"),
                ...student.map((row) => row.roll)
            ]

            await navigator.clipboard.writeText(textArray.join("\n"))
            toast.success("Copied to clipboard!", { id })
        } catch (error) {
            console.trace(error)
            toast.error("Failed to copy to clipboard!", { id })
        }
    }
    return (
        <div className="w-full flex flex-1 items-center justify-center">
            <Card className="[--card-spacing:--spacing(4)]! sm:[--card-spacing:--spacing(6)]! m-2 md:m-4 lg:m-8 xl:m-16 max-w-4xl flex flex-1">
                <CardHeader className="grid-cols-1! sm:grid-cols-[1fr_auto]!">
                    <CardTitle>Students</CardTitle>
                    <CardDescription>List of students with their details</CardDescription>
                    <CardAction className="flex flex-col sm:flex-row justify-start items-stretch sm:items-end gap-2 w-full sm:w-auto col-start-1! row-start-auto! self-stretch! justify-self-start! sm:col-start-2! sm:row-span-2! sm:row-start-1! sm:self-start! sm:justify-self-end!">
                        <Field className="w-full sm:w-70">
                            <FieldContent>
                                <Select onValueChange={setSelectedSubject} required>
                                    <SelectTrigger className="w-full sm:w-70">
                                        <SelectValue placeholder="Select Subject" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        <SelectGroup>
                                            {getSubjectData().map(([code, subject]) => (
                                                <SelectItem key={code} value={`${code} - ${subject}`}>
                                                    {`${code} - ${subject}`}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FieldContent>
                        </Field>
                        <Field className="w-full sm:w-35">
                            <FieldContent>
                                <DatePicker
                                    value={date}
                                    onChange={setDate}
                                    className="w-full justify-between"
                                    required
                                    showWeekNumber
                                />
                            </FieldContent>
                        </Field>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data}
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                        getRowId={(row) => row.roll}
                    />
                </CardContent>
                <CardFooter className="flex flex-row justify-start items-start gap-2">
                    <Button disabled variant="default" className="w-fit">
                        Save
                    </Button>
                    {/* oxlint-disable-next-line typescript/no-misused-promises */}
                    <Button variant="default" className="w-fit" onClick={copy}>
                        Copy
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
