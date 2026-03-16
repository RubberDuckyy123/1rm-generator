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

export function ResetPerformMetricsVisual() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
}

export function SetupPerformMetricsVisual() {
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
}

export function FinishPerformMetricsVisual(ExercisesAndRanks) {
    ctx.font = "14px Arial"

    const ProvidedExercises = Object.keys(ExercisesAndRanks)

    const BarWidth = (WIDTH - RANKWIDTH) / EXERCISES.length
    ctx.fillStyle = "orange"
    const SeparatorLineWidth = 2
    const SemiCircleHeight = 25

    for (let i = 0; i < ProvidedExercises.length; i++) {
        EXERCISES[EXERCISES.indexOf(ProvidedExercises[i])] = EXERCISES[i]
        EXERCISES[i] = ProvidedExercises[i]
    }

    for (let i = 0; i < EXERCISES.length; i++) {
        const XPos = RANKWIDTH + BarWidth * i

        ctx.fillStyle = "black"
        ctx.fillRect(XPos - (SeparatorLineWidth / 2), TopBarHeight, SeparatorLineWidth, HEIGHT)

        ctx.fillStyle = "white"
        const ExerciseName = EXERCISES[i]
        const TextDimensions = ctx.measureText(EXERCISES[i])
        const TextWidth = TextDimensions.width
        const TextHeight = TextDimensions.actualBoundingBoxAscent + TextDimensions.actualBoundingBoxDescent
        ctx.fillText(EXERCISES[i], XPos + BarWidth / 2 - TextWidth / 2, TopBarHeight / 2 + TextHeight / 2)
    }

    for (let i = 0; i < ProvidedExercises.length; i++) {
        ctx.fillStyle = RANKCOLORS[ExercisesAndRanks[ProvidedExercises[i]].RANK]
        const RANKNUMBER = RANKS.indexOf(ExercisesAndRanks[ProvidedExercises[i]].RANK)
        const XPos = RANKWIDTH + BarWidth * i
        const Percent = ExercisesAndRanks[ProvidedExercises[i]].PERCENT
        const BarHeight = (HEIGHT - RANKHEIGHT * RANKNUMBER) - (RANKHEIGHT * Percent)
        const YPos = BarHeight

        ctx.fillRect(XPos + SeparatorLineWidth / 2, YPos + SemiCircleHeight, BarWidth - SeparatorLineWidth, HEIGHT - BarHeight)
        ctx.beginPath()
        ctx.ellipse(XPos + BarWidth / 2, YPos + SemiCircleHeight, BarWidth / 2 - SeparatorLineWidth / 2, SemiCircleHeight, 0, Math.PI, 0)
        ctx.fill()
    }

    ctx.fillStyle = "black"
    // Left Line
    ctx.fillRect(0, 0, SeparatorLineWidth, HEIGHT)
    // Bottom Line
    ctx.fillRect(0, HEIGHT - SeparatorLineWidth, WIDTH, SeparatorLineWidth)
    // Right Line
    ctx.fillRect(WIDTH - SeparatorLineWidth, 0, SeparatorLineWidth, HEIGHT)
}
