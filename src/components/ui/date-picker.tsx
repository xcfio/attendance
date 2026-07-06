"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function DatePicker({
    value,
    onChange,
    placeholder = "Pick a date",
    className,
    ...props
}: {
    value?: Temporal.PlainDate
    onChange?: (date: Temporal.PlainDate | undefined) => void
    placeholder?: string
    className?: string
} & Omit<React.ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect" | "className">) {
    const [date, setDate] = React.useState<Temporal.PlainDate | undefined>(value)

    const selected = value ?? date

    // oxlint-disable-next-line eslint-js/no-restricted-syntax
    const handleSelect = (selectedDate: Date | undefined) => {
        const plainDate = selectedDate
            ? selectedDate.toTemporalInstant().toZonedDateTimeISO(Temporal.Now.timeZoneId()).toPlainDate()
            : undefined
        if (onChange) {
            onChange(plainDate)
        } else {
            setDate(plainDate)
        }
    }

    // oxlint-disable-next-line eslint-js/no-restricted-syntax
    const calendarSelected = selected ? new Date(selected.year, selected.month - 1, selected.day) : undefined

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!selected}
                    className={cn(
                        "justify-start px-4 text-left font-normal data-[empty=true]:text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon />
                    {selected ? selected.toLocaleString(undefined, { dateStyle: "long" }) : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={calendarSelected} onSelect={handleSelect} {...props} />
            </PopoverContent>
        </Popover>
    )
}

export { DatePicker }
