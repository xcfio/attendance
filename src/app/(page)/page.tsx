"use client"

import { columns, Student } from "./columns"
import { DataTable } from "./data-table"
import { student } from "@/text/students"
import { Subject } from "@/text/subject"
import { CurrentStudent } from "@/text/current-student"
import { useState, useMemo } from "react"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldContent } from "@/components/ui/field"

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

function getSubjectData(): Array<[number, string]> {
    const subject: Array<[number, string]> = []

    for (const [_semester, department] of Subject) {
        for (const [code, name] of department) {
            subject.push([code, name])
        }
    }

    return subject
}

export default function StudentPage() {
    const [date, setDate] = useState<Temporal.PlainDate | undefined>(Temporal.Now.plainDateISO())
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
    const [_selectedSubject, setSelectedSubject] = useState<string>("")
    const data = useMemo(() => getStudentData(), [])

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
                                                <SelectItem key={code} value={code.toString()}>
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
                    <Button variant="default" className="w-fit">
                        Save
                    </Button>
                    <Button variant="default" className="w-fit">
                        Copy
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
