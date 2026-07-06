// oxlint-disable

"use client"

import { Temporal, toTemporalInstant } from "temporal-polyfill"
import { useEffect } from "react"
import { toast } from "sonner"

if (typeof globalThis.Temporal === "undefined") {
    // @ts-ignore - Polyfill Temporal
    globalThis.Temporal = Temporal
    // @ts-ignore - Polyfill Temporal
    globalThis.Temporal.polyfilled = true
}

if (typeof Date.prototype.toTemporalInstant !== "function") {
    // @ts-ignore - Polyfill Temporal
    Date.prototype.toTemporalInstant = toTemporalInstant
}

export function TemporalPolyfill() {
    useEffect(() => {
        if ("polyfilled" in globalThis.Temporal) {
            console.warn("[Temporal] Native support not detected. Polyfill loaded via temporal-polyfill.")
            toast.warning("Temporal API not supported", {
                description: "Your browser doesn't support the Temporal API. Some features may not work as expected.",
                dismissible: true,
                duration: 5000,
                action: {
                    label: "See Compatible Browsers",
                    onClick: () => {
                        window.open(
                            "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal#browser_compatibility",
                            "_blank",
                            "noopener,noreferrer"
                        )
                    }
                }
            })
        } else {
            console.info("[Temporal] Running on native Temporal API.")
        }
    }, [])
    return null
}
