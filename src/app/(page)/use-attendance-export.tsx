import { toast } from "sonner"
import type { Student } from "./columns"

interface BuildContentArgs {
    subject: string
    time?: string
    selectedRows: Student[]
    extraRolls: string[]
}

function buildContent({ subject, time, selectedRows, extraRolls }: BuildContentArgs) {
    const header = `Date: ${time}${subject ? `\nSubject: ${subject}` : ""}\nDepartment: CST-${process.env.NEXT_PUBLIC_SEMESTER}/1`
    const uniqueRolls = Array.from(new Set([...selectedRows.map((r) => r.roll), ...extraRolls]))
    const text = [header, "", ...uniqueRolls].join("\n")
    return { text }
}

export function useAttendanceExport() {
    async function copy(args: BuildContentArgs) {
        const id = toast.loading("Copying...")
        try {
            const { text } = buildContent(args)
            await navigator.clipboard.writeText(text)
            toast.success("Copied to clipboard!", { id })
        } catch (error) {
            console.trace(error)
            toast.error("Failed to copy to clipboard!", { id })
        }
    }

    function save(args: BuildContentArgs) {
        const id = toast.loading("Saving...")
        try {
            const { text } = buildContent(args)
            const datePart = args.time?.replaceAll("/", "-") ?? "unknown-date"
            const subjectPart = args.subject ? args.subject.replace(/[<>:"/\\|?*]+/gu, "-").trim() : "No-Subject"
            const filename = `${datePart} - ${subjectPart}.txt`

            const blob = new Blob([text], { type: "text/plain" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = filename
            a.click()
            URL.revokeObjectURL(url)

            toast.success(`Saved as ${filename}`, { id })
        } catch (error) {
            console.trace(error)
            toast.error("Failed to save file!", { id })
        }
    }

    return { copy, save }
}
