export const libraries = {
    /**
     * formatted time
     *
     * `ap` - `am`
     * `AP` - `AM`
     * `hh` - `05`
     * `HH` - `17`
     * `MM` - `59`
     * `mm` - `59`
     * `ss` - `59`
     * `SS` - `59`
     * `dd` - `31`
     * `dth` - `st`
     * `Dth` - `St`
     * `DTH` - `ST`
     * `mo` - `12`
     * `Mo` - `jan`
     * `MO` - `Jan`
     * `Month` - `January`
     * `month` - `january`
     * `year` - `2022`
     * `YEAR` - `2022`
     * `YE` - `22`
     * `ye` - `22`
     * `We` - `Fri`
     * `we` - `fri`
     * `Wd` - `Friday`
     * `wd` - `friday`
     *
     * @param       data            time prop
     * @param       data.time       input time
     * @param       data.format     format for the return
     */
    prettyTime({
        time = new Date(),
        format = "HH:mm:ss dd/mo/year",
    }: {
        time?: Date
        format?: string
    } = {}): string {
        let hours = time.getHours()
        let minutes = time.getMinutes()
        let seconds = time.getSeconds()
        let date = time.getDate()
        let month = time.getMonth()
        let year = time.getFullYear()
        let weekday = time.getDay()

        const indexedZero = (value: number): string => {
            return (value < 10 ? "0" + value : value).toString()
        }
        const postFix = (lastIdx: number): string => {
            return ["St", "Nd", "Rd", "Th"][
                lastIdx - 1 >= 3 || lastIdx === 0 ? 3 : lastIdx - 1
            ]
        }

        const shortMonth = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ][month]
        const fullMonth = [
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
        ][month]
        const shortWeekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekday]
        const fullWeekday = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ][weekday]

        format = format.replace("ap", hours < 12 ? "am" : "pm")
        format = format.replace("AP", hours < 12 ? "AM" : "PM")

        format = format.replace("hh", indexedZero(hours > 12 ? hours % 12 : hours))
        format = format.replace("HH", indexedZero(hours))

        format = format.replace("mm", indexedZero(minutes))
        format = format.replace("MM", indexedZero(minutes))

        format = format.replace("ss", indexedZero(seconds))
        format = format.replace("SS", indexedZero(seconds))

        format = format.replace("dd", indexedZero(date))

        format = format.replace("dth", postFix(date % 10).toLowerCase())
        format = format.replace("Dth", postFix(date % 10).toLowerCase())
        format = format.replace("DTH", postFix(date % 10).toUpperCase())

        format = format.replace("mo", indexedZero(month))
        format = format.replace("MO", shortMonth)
        format = format.replace("Mo", shortMonth.toLowerCase)
        format = format.replace("Month", fullMonth)
        format = format.replace("month", fullMonth.toLowerCase())

        format = format.replace("year", year.toString())
        format = format.replace("YEAR", year.toString())
        format = format.replace("ye", (year % 2000).toString())
        format = format.replace("YE", (year % 2000).toString())

        format = format.replace("We", shortWeekday)
        format = format.replace("we", shortWeekday.toLowerCase())
        format = format.replace("Wd", fullWeekday)
        format = format.replace("wd", fullWeekday.toLowerCase())

        return format
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

    randomHexColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`
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
     * @param   { object }	        opt             options
     * @param   { boolean }         opt.toInt       by default is true
     * @param   { Number[2] }       opt.outRange
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

        if (this.randomStringList.includes(str)) return this.randomString(len, charSet)

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
