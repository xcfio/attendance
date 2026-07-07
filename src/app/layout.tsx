// oxlint-disable

import { TemporalPolyfill } from "@/components/temporal-polyfill"
import { Temporal, toTemporalInstant } from "temporal-polyfill"
import { Fira_Code, Comfortaa } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"
import { Metadata } from "next"
import { cn } from "@/lib/utils"
import { Suspense } from "react"
import "./globals.css"

const comfortaa = Comfortaa({ subsets: ["latin"], variable: "--font-sans" })
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" })

if (typeof globalThis.Temporal === "undefined") {
    // @ts-ignore - Polyfill Temporal
    globalThis.Temporal = Temporal
    // @ts-ignore - Polyfill Temporal
    globalThis.Temporal.polyfilled = true

    console.info("Server -> Temporal not defined - polyfilled")
} else {
    console.info("Server -> Temporal is already defined - not polyfilling")
}

if (typeof Date.prototype.toTemporalInstant !== "function") {
    // @ts-ignore - Polyfill Temporal
    Date.prototype.toTemporalInstant = toTemporalInstant
    console.info("Server -> Date.prototype.toTemporalInstant not defined - polyfilling")
} else {
    console.info("Server -> Date.prototype.toTemporalInstant is already defined - not polyfilling")
}

export const metadata: Metadata = {
    title: "Class Attendance",
    description: "A presentation on the Class Attendance tracking system.",
    keywords: ["class attendance", "attendance system", "presentation", "education", "student tracking"],
    authors: [{ name: "xcfio", url: "https://xcfio.com" }],
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    },
    alternates: {
        canonical: "https://attendance-cst.netlify.app"
    },
    icons: {
        icon: [
            { url: "/icon.svg" },
            { url: "/icon.png", sizes: "16x16", type: "image/png" },
            { url: "/icon.png", sizes: "32x32", type: "image/png" }
        ],
        apple: [
            { url: "/icon.png" },
            { url: "/icon.png", sizes: "152x152" },
            { url: "/icon.png", sizes: "167x167" },
            { url: "/icon.png", sizes: "180x180" }
        ]
    },
    manifest: "/manifest.json",
    openGraph: {
        title: "Class Attendance",
        description: "A presentation on the Class Attendance tracking system.",
        url: "https://attendance-cst.netlify.app",
        siteName: "Class Attendance",
        type: "website",
        images: [
            {
                url: "https://attendance-cst.netlify.app/icon.png",
                width: 512,
                height: 512,
                alt: "Class Attendance Presentation Logo"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Class Attendance Presentation",
        description: "A presentation on the Class Attendance tracking system.",
        images: ["https://presentation-xcfio.netlify.app/icon.png"]
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Class Attendance"
    },
    applicationName: "Class Attendance"
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            className={cn("font-sans scroll-smooth", firaCode.variable, comfortaa.variable)}
        >
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                {process.env.NODE_ENV !== "development" && (
                    <script
                        defer
                        src="https://cool-xcfio.vercel.app/script.js"
                        data-website-id="b10e3e9e-c478-4771-b755-44c5546a801e"
                    ></script>
                )}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            try {
                                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#141414')
                                }
                                if (localStorage.layout) {
                                    document.documentElement.classList.add('layout-' + localStorage.layout)
                                }
                            } catch (_) {}
                        `
                    }}
                />
                <meta name="theme-color" content={"#ffffff"} />
            </head>
            <body className={`antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <Toaster richColors position="top-right" />
                    <Suspense>{children}</Suspense>
                    <TemporalPolyfill />
                </ThemeProvider>
            </body>
        </html>
    )
}
