"use client"

import { useEffect, useRef, useState } from "react"
import type { RowSelectionState } from "@tanstack/react-table"

const STORAGE_KEY = "extra-students"

export type ExtraStudent = { roll: string; name: string }

/**
 * Manually-typed roll numbers that aren't in the main student list.
 * Persisted to localStorage. Always keeps a trailing empty row so
 * the user can keep typing without clicking "add".
 */
export function useExtraStudents(
    rowSelection: RowSelectionState,
    setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>
) {
    const [extraStudents, setExtraStudents] = useState<ExtraStudent[]>([{ roll: "", name: "" }])
    const [isLoaded, setIsLoaded] = useState(false)
    const prevRollsRef = useRef<string[]>([""])

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored) as Array<Partial<ExtraStudent>>
                if (parsed.length > 0) {
                    const loaded = parsed.map((e) => ({ roll: e.roll ?? "", name: e.name ?? "" }))
                    setExtraStudents(loaded)
                    prevRollsRef.current = loaded.map((e) => e.roll.trim())
                }
            }
        } catch {}
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(extraStudents))
        }
    }, [extraStudents, isLoaded])

    function update(index: number, field: keyof ExtraStudent, value: string) {
        setExtraStudents((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
    }

    function handleRollBlur(index: number) {
        const newRoll = extraStudents[index].roll.trim()
        const oldRoll = prevRollsRef.current[index] ?? ""
        const isLastRow = index === extraStudents.length - 1

        if (newRoll !== "" && isLastRow) {
            setExtraStudents((prev) => [...prev, { roll: "", name: "" }])
            prevRollsRef.current.push("")
        }

        if (oldRoll !== "" && oldRoll !== newRoll) {
            const isOldRollUsedElsewhere = extraStudents.some((s, i) => i !== index && s.roll.trim() === oldRoll)
            if (!isOldRollUsedElsewhere) {
                setRowSelection((prev) => {
                    const next = { ...prev }
                    delete next[oldRoll]
                    return next
                })
            }
        }

        if (newRoll !== "") {
            setRowSelection((prev) => (newRoll in prev ? prev : { ...prev, [newRoll]: true }))
        }

        prevRollsRef.current[index] = newRoll
    }

    function remove(index: number) {
        const roll = extraStudents[index].roll.trim()
        setExtraStudents((prev) => {
            const next = prev.filter((_, i) => i !== index)
            return next.length > 0 ? next : [{ roll: "", name: "" }]
        })
        prevRollsRef.current = prevRollsRef.current.filter((_, i) => i !== index)
        if (prevRollsRef.current.length === 0) {
            prevRollsRef.current = [""]
        }
        if (roll !== "") {
            setRowSelection((prev) => {
                const next = { ...prev }
                delete next[roll]
                return next
            })
        }
    }

    function toggle(index: number) {
        const roll = extraStudents[index].roll.trim()
        if (!roll) return
        setRowSelection((prev) => {
            if (prev[roll]) {
                const next = { ...prev }
                delete next[roll]
                return next
            }
            return { ...prev, [roll]: true }
        })
    }

    /** Selected extra students, ready to append to the export text. */
    function selectedRolls() {
        return extraStudents
            .filter((e) => e.roll.trim() !== "" && rowSelection[e.roll.trim()])
            .map((e) => e.roll.trim())
    }

    return { extraStudents, update, handleRollBlur, remove, toggle, selectedRolls }
}
