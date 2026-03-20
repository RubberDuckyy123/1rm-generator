import { RANKCOLORS, PERFORMMETRICSINFO } from "../RankingData.js"

const Canvas = document.getElementById("BarGraph")
const ctx = Canvas.getContext("2d")

const WIDTH = Canvas.width
const HEIGHT = Canvas.height

const TopBarHeight = HEIGHT / 8

let EXERCISES = []

const ExerciseInputBoxes = document.querySelectorAll(".PerformMetricInfo")
ExerciseInputBoxes.forEach( (InputBox) => {
    EXERCISES.push(InputBox.dataset.shortname)
})

const RANKS = Object.keys(RANKCOLORS)
const RANKHEIGHT = (HEIGHT - TopBarHeight) / RANKS.length
const RANKWIDTH = WIDTH / 5

const BarWidth = (WIDTH - RANKWIDTH) / EXERCISES.length
const SeparatorLineWidth = 2
const SemiCircleHeight = 25

const TWEENLENGTH = 1.5
let TweenTime = 0.0
let Progress = 0.0
let lastTime = 0.0

let ExercisesToUpdate = {}

export function DrawPerformMetricsVisual(ExercisesAndRanks) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    DrawGraphSetup()
    DrawFinishedGraph(ExercisesAndRanks)

    Progress = 0.0
    TweenTime = 0.0

    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            lastTime = performance.now()
            requestAnimationFrame(UpdateGraphPositions)
            observer.disconnect()
        }
    },
    {
        threshold: 0.67
    })

    observer.observe(Canvas)
}

function DrawGraphSetup() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, WIDTH, TopBarHeight)

    ctx.font = "20px Arial"

    for (let i = 0; i < RANKS.length; i++) {
        // Draws The Rank Box
        ctx.fillStyle = RANKCOLORS[RANKS[i]]

        const YPos = HEIGHT - RANKHEIGHT - RANKHEIGHT * i
        ctx.fillRect(0, YPos, RANKWIDTH, RANKHEIGHT)

        // Draws The Rank Text
        const RANK = RANKS[i].slice(0, 3).toUpperCase()
        ctx.fillStyle = "black"
        const RankTextDimensions = ctx.measureText(RANK)
        const RankTextWidth = RankTextDimensions.width
        const RankTextHeight = RankTextDimensions.actualBoundingBoxAscent + RankTextDimensions.actualBoundingBoxDescent
        ctx.fillText(RANK, RANKWIDTH / 2 - RankTextWidth / 2, YPos + RANKHEIGHT / 2 + RankTextHeight / 2)
    }

    ctx.font = "14px Arial"
    ctx.fillStyle = "white"

    const RankColumnTextDimensions = ctx.measureText("RANK")
    const RankColumnTextWidth = RankColumnTextDimensions.width
    const RankColumnTextHeight = RankColumnTextDimensions.actualBoundingBoxAscent + RankColumnTextDimensions.actualBoundingBoxDescent
    ctx.fillText("RANK", RANKWIDTH / 2 - RankColumnTextWidth / 2, TopBarHeight / 2 + RankColumnTextHeight / 2)

    for (let i = 0; i < EXERCISES.length; i++) {
        const XPos = RANKWIDTH + BarWidth * i

        ctx.fillStyle = "black"
        ctx.fillRect(XPos - (SeparatorLineWidth / 2), TopBarHeight, SeparatorLineWidth, HEIGHT)

        ctx.fillStyle = "white"
        const ExerciseName = EXERCISES[i]
        const TextDimensions = ctx.measureText(ExerciseName)
        const TextWidth = TextDimensions.width
        const TextHeight = TextDimensions.actualBoundingBoxAscent + TextDimensions.actualBoundingBoxDescent
        ctx.fillText(ExerciseName, XPos + BarWidth / 2 - TextWidth / 2, TopBarHeight / 2 + TextHeight / 2)
    }
}

function DrawFinishedGraph(ExercisesAndRanks) {
    ctx.font = "14px Arial"

    const ProvidedExercises = Object.keys(ExercisesAndRanks)

    for (let i = 0; i < ProvidedExercises.length; i++) {
        EXERCISES[EXERCISES.indexOf(ProvidedExercises[i])] = EXERCISES[i]
        EXERCISES[i] = ProvidedExercises[i]
    }

    ExercisesToUpdate = {}

    for (let i = 0; i < ProvidedExercises.length; i++) {
        const RankNumber = RANKS.indexOf(ExercisesAndRanks[ProvidedExercises[i]].RANK)
        const Percentage = ExercisesAndRanks[ProvidedExercises[i]].PERCENT
        const BarHeight = (HEIGHT - RANKHEIGHT * RankNumber) - (RANKHEIGHT * Percentage)

        ExercisesToUpdate[ProvidedExercises[i]] = {EndBarHeight: Math.max(BarHeight, TopBarHeight), RankNumber: RankNumber}
    }
}

function DrawBar(BarHeight, RANKNUMBER, XNumber) {
    ctx.fillStyle = Object.values(RANKCOLORS)[RANKNUMBER]

    const XPos = RANKWIDTH + BarWidth * XNumber

    ctx.fillRect(XPos + SeparatorLineWidth / 2, BarHeight + SemiCircleHeight, BarWidth - SeparatorLineWidth, HEIGHT - BarHeight)
    ctx.beginPath()
    ctx.ellipse(XPos + BarWidth / 2, BarHeight + SemiCircleHeight, BarWidth / 2 - SeparatorLineWidth / 2, SemiCircleHeight, 0, Math.PI, 0)
    ctx.fill()
}

function UpdateGraphPositions(time) {
    const deltaTime = (time - lastTime) / 1000
    lastTime = time

    TweenTime += deltaTime
    Progress = TweenTime / TWEENLENGTH

    const ExerciseNames = Object.keys(ExercisesToUpdate)

    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    DrawGraphSetup()

    for (let i = 0; i < ExerciseNames.length; i++) {
        const EndBarHeight = ExercisesToUpdate[ExerciseNames[i]].EndBarHeight
        const StartBarHeight = HEIGHT

        const CurrentBarHeight = StartBarHeight + (EndBarHeight - StartBarHeight) * easeOut(Progress, 2)

        const RankNumber = ExercisesToUpdate[ExerciseNames[i]].RankNumber

        DrawBar(CurrentBarHeight, RankNumber, i)
    }

    ctx.fillStyle = "black"
    // Left Line
    ctx.fillRect(0, 0, SeparatorLineWidth, HEIGHT)
    // Bottom Line
    ctx.fillRect(0, HEIGHT - SeparatorLineWidth, WIDTH, SeparatorLineWidth)
    // Right Line
    ctx.fillRect(WIDTH - SeparatorLineWidth, 0, SeparatorLineWidth, HEIGHT)

    if (Progress < 1) {
        requestAnimationFrame(UpdateGraphPositions)
    } else {
        ctx.clearRect(0, 0, WIDTH, HEIGHT)
        DrawGraphSetup()

        for (let i = 0; i < ExerciseNames.length; i++) {
            const EndBarHeight = ExercisesToUpdate[ExerciseNames[i]].EndBarHeight
            const StartBarHeight = HEIGHT

            const RankNumber = ExercisesToUpdate[ExerciseNames[i]].RankNumber

            DrawBar(EndBarHeight, RankNumber, i)
        }

        ctx.fillStyle = "black"
        // Left Line
        ctx.fillRect(0, 0, SeparatorLineWidth, HEIGHT)
        // Bottom Line
        ctx.fillRect(0, HEIGHT - SeparatorLineWidth, WIDTH, SeparatorLineWidth)
        // Right Line
        ctx.fillRect(WIDTH - SeparatorLineWidth, 0, SeparatorLineWidth, HEIGHT)
    }
}

function easeOut(Progress, power) {
    return 1 - Math.pow(1 - Progress, power)
}
