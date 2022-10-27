import BRIGHTNESS_SCOPE from "./brightness"

/** default color template */
const COLOR = Object.freeze({
    blue: {
        backgroundColor: "#44aadd",
        shapeColor: "#44aadd",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    red: {
        backgroundColor: "#fb3852",
        shapeColor: "hsl(352, 85%, 50%)",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    grey: {
        backgroundColor: "#485e74",
        shapeColor: "#485e74",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    green: {
        backgroundColor: "#38e538",
        shapeColor: "#38e538",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    pink: {
        backgroundColor: "#ff66aa",
        shapeColor: "#ff66aa",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    darkred: {
        backgroundColor: "#c52339",
        shapeColor: "#c52339",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.dark,
    },
    orange: {
        backgroundColor: "#ffa502",
        shapeColor: "#ffa502",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    navyblue: {
        backgroundColor: "#333d79",
        shapeColor: "#333d79",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    whitesmoke: {
        backgroundColor: "#f6f6f6",
        shapeColor: "#f6f6f6",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.light,
    },
    lightblue: {
        backgroundColor: "#b9e8fd",
        shapeColor: "#b9e8fd",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.light,
    },
    dark: {
        backgroundColor: "#1e1e1e",
        shapeColor: "#242424",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.dark,
    },
    yellow: {
        backgroundColor: "#ffc414",
        shapeColor: "#fccc3de6",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    purple: {
        backgroundColor: "rgb(95, 57, 155)",
        shapeColor: "rgb(95, 57, 155)",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
})

export default COLOR
