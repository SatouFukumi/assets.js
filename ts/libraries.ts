export const libraries = {
    /**
     * formatted time
     *
     * @docs `dd` - `31`
     * @docs `WW` - `Monday`
     * @docs `ww` - `monday`
     * @docs `W` - `Mon`
     * @docs `w` - `mon`
     * @docs `Mo` - `Jan`
     * @docs `mo` - `jan`
     * @docs `MM` - `January`
     * @docs `mm` - `january`
     * @docs `o` - `am`
     * @docs `yyyy` - `2022`
     * @docs `hh` - `24`
     * @docs `mi` - `60`
     * @docs `ss` - `60`
     *
     * @param       data            time prop
     * @param       data.time       input time
     * @param       data.format     format for the return
     */
    prettyTime({
        timestamp = new Date(),
        format = "hh:mi:ss - dd Mo yyyy",
    } = {}) {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]
        const weekDays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ]
        const ordinal = ["Th", "St", "Nd", "Rd"]

        const formats: Record<string, number | string> = {
            dd: timestamp.getDate(),
            WW: weekDays[timestamp.getDay()],
            ww: weekDays[timestamp.getDay()].toLowerCase(),
            Mo: months[timestamp.getMonth()].slice(0, 3),
            mo: months[timestamp.getMonth()].slice(0, 3).toLowerCase(),
            MM: months[timestamp.getMonth()],
            mm: months[timestamp.getMonth()].toLowerCase(),
            W: weekDays[timestamp.getDay()].slice(0, 3),
            w: weekDays[timestamp.getDay()].slice(0, 3).toLowerCase(),
            m: (timestamp.getMonth() + 1).toString().padStart(2, "0"),
            o: ordinal[timestamp.getDate() % 10],
        }

        return format
            .replace(/YYYY|yyyy/g, timestamp.getFullYear().toString())
            .replace(/hh/g, timestamp.getHours().toString().padStart(2, "0"))
            .replace(/mi/g, timestamp.getMinutes().toString().padStart(2, "0"))
            .replace(/ss/g, timestamp.getSeconds().toString().padStart(2, "0"))
            .replace(/dd|WW|ww|Mo|mo|MM|mm|W|w|m|o/g, (match) =>
                formats[match].toString()
            )
    },

    /**
     * Return a rounded number with a specified number of decimal places
     *
     * @param       number      value to be rounded
     * @param       to          the decimal place
     * @returns                 rounded number
     */
    round(number: number, to: number = 0): number {
        const d = Math.pow(10, to)
        return Math.round(number * d) / d
    },

    /** this function returns the smallest number */
    min: (...args: number[]): number => Math.min(...args),

    /** this function returns the biggest number */
    max: (...args: number[]): number => Math.max(...args),

    /** this function returns the absolute value of the number */
    abs: (num: number): number => Math.abs(num),

    /** this function returns the clamped number */
    clamp(min: number, dynamic: number, max: number): number {
        return this.min(this.max(min, dynamic), max)
    },

    randomColor() {
        return Math.floor(Math.random() * 16777216)
    },

    randomHexColor(hexLength?: 3 | 6): string {
        const hex = `#${Math.floor(Math.random() * 16777215).toString(16)}`
        if (hexLength === undefined) return hex

        return hex.length - 1 === hexLength
            ? hex
            : this.randomHexColor(hexLength)
    },

    hexToRgb(hex: string) {
        if (hex.charAt(0) === "#") hex = hex.substring(1)

        if (hex.length !== 3 && hex.length !== 6)
            throw new Error("'lib.hexToRgb()' : 'hex' is not valid")

        if (hex.length === 3)
            hex = hex
                .split("")
                .map((c) => c.repeat(2))
                .join("")

        let red = parseInt(hex.substring(0, 2), 16)
        let green = parseInt(hex.substring(2, 4), 16)
        let blue = parseInt(hex.substring(4, 6), 16)

        return { red, green, blue, rgb: `rgb(${red}, ${green}, ${blue})` }
    },

    /**
     * Return random number between min and max
     *
     * @param	{ Number }		    min		        Minimum Random Number
     * @param	{ Number }		    max		        Maximum Random Number
     * @param   { boolean }         toInt           by default is true
     * @param   { Number[2] }       outRange
     */
    randomBetween(
        min: number,
        max: number,
        toInt: boolean = true,
        outRange: number[] = []
    ): number {
        if (max < min) {
            let tmp = max
            max = min
            min = tmp
        }

        let res = toInt
            ? Math.floor(Math.random() * (max - min + 1) + min)
            : Math.random() * (max - min) + min

        if (!outRange.length) return res

        let [minEdge, maxEdge] = outRange
        if (res > minEdge && res < maxEdge)
            return this.randomBetween(min, max, toInt, outRange)
        return res
    },

    /**
     * @param   array     array of items
     */
    randomItem<T extends any>(array: T[]): T {
        if (!(array instanceof Array))
            throw new Error('`randomItem()` : "array" is not a valid array')

        return array[this.randomBetween(0, array.length - 1)]
    },

    /** random string list */
    randomStringList: [] as string[],
    /**
     *
     * @param       len             length of the returned string
     * @param       charSet         a set of characters
     * @returns                     a random string with length of `len`
     */
    randomString(
        len: number = 16,
        charSet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    ): string {
        let str = ""

        for (let i = 0; i < len; i++) {
            let p = Math.floor(Math.random() * charSet.length)
            str += charSet.substring(p, p + 1)
        }

        if (this.randomStringList.includes(str))
            return this.randomString(len, charSet)

        this.randomStringList.push(str)

        return str
    },

    truncate(str: string, length: number = 20, suffix = "...") {
        return str.length > length
            ? str.substring(0, length - suffix.length - 1) + suffix
            : str
    },
}

/** */

/**
 * throttle a function
 * @param           fn                      function
 * @param           throttleTime            throttler delay in milliseconds
 * @returns                                 func(...args)
 */
export function throttle(
    this: any,
    fn: (...args: any[]) => void,
    throttleTime: number
): (...args: any[]) => any {
    let throttler: boolean = false

    const context: any = this

    return function (...args: any[]): any {
        if (throttler) return
        throttler = true

        setTimeout(() => (throttler = false), throttleTime)

        return fn.call(context, ...args)
    }
}

/**
 * throttle a function and always run the last call
 * @param           fn                      function
 * @param           throttleTime            throttler delay in milliseconds
 * @returns                                 func(...args)
 */
export function throttled(
    this: any,
    fn: (...args: any[]) => void,
    throttleTime: number
): (...args: any[]) => any {
    const context: any = this
    const t: (...args: any[]) => any = throttle.call(context, fn, throttleTime)
    const d: (...args: any[]) => any = debounce.call(context, fn, throttleTime)

    return function (...args: any[]): void {
        t.call(context, ...args)
        d.call(context, ...args)
    }
}

/**
 * debounce a function
 * @param           fn              function
 * @param           timeout         debounce limit in milliseconds
 * @param           firstCall       debounce limit in milliseconds
 * @returns                         func(...args)
 */
export function debounce(
    this: any,
    fn: (...args: any[]) => void,
    timeout: number,
    firstCall: boolean = false
): (...args: any[]) => any {
    let timer: number | NodeJS.Timeout = -1
    let toCall: boolean = false
    if (firstCall) toCall = true

    const context: any = this

    return function (...args: any[]): void {
        if (toCall) {
            toCall = false
            fn.call(context, ...args)
        }

        clearTimeout(timer)
        timer = setTimeout(() => fn.call(context, ...args), timeout)
    }
}
