"use client"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldContent } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { CurrentStudent } from "@/text/current-student"
import { Button } from "@/components/ui/button"
import { columns, Student, IndeterminateCheckbox } from "./columns"
import { useState, useMemo, useEffect } from "react"
import { student } from "@/text/students"
import { Subject } from "@/text/subject"
import { DataTable } from "./data-table"
import { TableCell, TableRow } from "@/components/ui/table"
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

const STORAGE_KEY = "extra-students"
type ExtraStudent = {
    roll: string
    name: string
}

export default function StudentPage() {
    const [date, setDate] = useState<Temporal.PlainDate | undefined>(Temporal.Now.plainDateISO())
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
    const [selectedSubject, setSelectedSubject] = useState<string>("")
    const [extraStudents, setExtraStudents] = useState<ExtraStudent[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored) as Array<Partial<ExtraStudent>>
                return parsed.map((e) => ({ roll: e.roll ?? "", name: e.name ?? "" }))
            }
        } catch {}
        return [{ roll: "", name: "" }]
    })

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(extraStudents))
    }, [extraStudents])

    function handleExtraStudentChange(index: number, field: "roll" | "name", value: string) {
        const updated = [...extraStudents]
        updated[index] = { ...updated[index], [field]: value }
        setExtraStudents(updated)
    }

    function handleExtraRollBlur(index: number) {
        const roll = extraStudents[index].roll.trim()
        // Only append a new empty row when leaving the last roll field with content
        if (roll !== "" && index === extraStudents.length - 1) {
            setExtraStudents((prev) => [...prev, { roll: "", name: "" }])
        }
        // Auto-select the roll in rowSelection if not already tracked
        if (roll !== "") {
            setRowSelection((prev) => (roll in prev ? prev : { ...prev, [roll]: true }))
        }
    }

    function removeExtraStudent(index: number) {
        const roll = extraStudents[index].roll.trim()
        const updated = extraStudents.filter((_, i) => i !== index)
        // Always keep at least one empty row
        setExtraStudents(updated.length > 0 ? updated : [{ roll: "", name: "" }])
        // Clean up rowSelection for this roll
        if (roll !== "") {
            setRowSelection((prev) => {
                const next = { ...prev }
                delete next[roll]
                return next
            })
        }
    }

    function toggleExtraStudent(index: number) {
        const roll = extraStudents[index].roll.trim()
        if (!roll) return
        setRowSelection((prev) => ({ ...prev, [roll]: !prev[roll] }))
    }
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
                ...student.map((row) => row.roll),
                ...extraStudents
                    .filter((e) => e.roll.trim() !== "" && rowSelection[e.roll.trim()])
                    .map((e) => e.roll.trim())
            ]

            await navigator.clipboard.writeText(textArray.join("\n"))
            toast.success("Copied to clipboard!", { id })
        } catch (error) {
            console.trace(error)
            toast.error("Failed to copy to clipboard!", { id })
        }
    }
    return (
        <div className="relative w-full flex flex-1 items-center justify-center overflow-hidden bg-linear-to-br from-background via-muted/40 to-background">
            {/* Decorative background: soft color blobs + subtle grid */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_45%),radial-gradient(circle_at_80%_10%,color-mix(in_oklab,var(--chart-1)_16%,transparent),transparent_40%),radial-gradient(circle_at_50%_95%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_55%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-40 mask-[radial-gradient(ellipse_at_center,black,transparent_75%)] bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_60%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_60%,transparent)_1px,transparent_1px)] bg-size-[2.5rem_2.5rem]"
            />
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
                        extraRows={extraStudents.map((entry, index) => (
                            <TableRow key={`extra-${index}`}>
                                <TableCell className="w-10">
                                    <div className="flex items-center px-1">
                                        <IndeterminateCheckbox
                                            checked={rowSelection[entry.roll.trim()]}
                                            onChange={() => toggleExtraStudent(index)}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono">
                                    <Input
                                        placeholder="Roll"
                                        value={entry.roll}
                                        onChange={(e) => handleExtraStudentChange(index, "roll", e.target.value)}
                                        onBlur={() => handleExtraRollBlur(index)}
                                        className="h-7 w-24 px-2 text-sm"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="Name (optional)"
                                            value={entry.name}
                                            onChange={(e) => handleExtraStudentChange(index, "name", e.target.value)}
                                            className="h-7 flex-1 px-2 text-sm"
                                        />
                                        {(entry.roll !== "" || extraStudents.length > 1) && (
                                            <button
                                                type="button"
                                                onClick={() => removeExtraStudent(index)}
                                                aria-label="Remove row"
                                                className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    />
                </CardContent>
                <CardFooter className="flex flex-row justify-start items-start gap-2">
                    <Button disabled variant="default" className="w-fit">
                        Save
                    </Button>
                    <Button variant="default" className="w-fit" onClick={() => void copy()}>
                        Copy
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
