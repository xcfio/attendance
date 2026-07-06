"use client"

import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"

export default function DatePickerDemo() {
    const [date, setDate] = useState<Temporal.PlainDate | undefined>(Temporal.Now.plainDateISO())

    return (
        <div>
            <DatePicker value={date} onChange={setDate} className="w-53 justify-between" required showWeekNumber />
        </div>
    )
}
