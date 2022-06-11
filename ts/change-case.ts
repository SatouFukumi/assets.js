export default {
    camel: {
        snake: (str: string): string => {
            return str
                .replace(
                    /[A-Z]/g,
                    (letter: string): string => `_${letter.toLowerCase()}`
                )
        },

        kebab: (str: string): string => {
            return str
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase()
        }
    },

    snake: {
        camel: (str: string): string => {
            return str
                .replace(
                    /_[a-z]/g,
                    (letter: string): string => {
                        return letter
                            .toUpperCase()
                            .replace(/_/g, '')
                    }
                )
        },

        kebab: (str: string): string => {
            return str
                .replace(/([a-z])_([a-z])/g, '$1-$2')
                .toLowerCase()
        }
    },

    kebab: {
        camel: (str: string): string => {
            return str
                .replace(
                    /-[a-z]/g,
                    (letter: string): string => {
                        return letter
                            .toUpperCase()
                            .replace(/-/g, '')
                    }
                )
        },

        snake: (str: string): string => {
            return str
                .replace(/([a-z])-([a-z])/g, '$1_$2')
                .toLowerCase()
        }
    }
}
