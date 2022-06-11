export default {
    camel: {
        snake: (str) => {
            return str
                .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        },
        kebab: (str) => {
            return str
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase();
        }
    },
    snake: {
        camel: (str) => {
            return str
                .replace(/_[a-z]/g, (letter) => {
                return letter
                    .toUpperCase()
                    .replace(/_/g, '');
            });
        },
        kebab: (str) => {
            return str
                .replace(/([a-z])_([a-z])/g, '$1-$2')
                .toLowerCase();
        }
    },
    kebab: {
        camel: (str) => {
            return str
                .replace(/-[a-z]/g, (letter) => {
                return letter
                    .toUpperCase()
                    .replace(/-/g, '');
            });
        },
        snake: (str) => {
            return str
                .replace(/([a-z])-([a-z])/g, '$1_$2')
                .toLowerCase();
        }
    }
};
