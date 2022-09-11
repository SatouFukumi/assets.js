export const cs = {
    /**
     * return whether the url exists
     * @param       url         url to check
     */
    urlExists(url: string): boolean {
        let http = new XMLHttpRequest()
        http.open("HEAD", url, false)
        http.send()
        if (http.status != 404 && http.status != 500) return true
        return false
    },

    isMobile(): boolean {
        if (typeof window === "undefined") return false

        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i,
        ]

        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem)
        })
    },

    /** this function parses cookie */
    parseCookie(name: string): string | undefined {
        const cookies = document.cookie.split(";")
        const cookie = cookies.find((c) => c.trim().startsWith(name + "="))

        if (!cookie) return undefined
        return cookie.split("=")[1]
    },

    preferDarkColorScheme: (): boolean =>
        window.matchMedia("(prefers-color-scheme: dark)").matches,

    preferLightColorScheme: (): boolean =>
        window.matchMedia("(prefers-color-scheme: light)").matches,

    get preferColorScheme(): "light" | "dark" {
        return this.preferDarkColorScheme() ? "dark" : "light"
    },
}

export default cs
