import { RANKCOLORS } from "../RankingData.js"

const Canvas = document.getElementById("GasMeter")
const ctx = Canvas.getContext("2d")

const WIDTH = Canvas.width
const HEIGHT = Canvas.height

const CENTER_X = Canvas.width / 2

const RANKS = Object.keys(RANKCOLORS)

const ANGLE = 180 / RANKS.length

ctx.font = "14px Arial"

export function ResetOneRMVisual() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
}

export function SetupOneRMVisual() {
    ctx.fillStyle = "black"

    // Draws The Background Semi-Circle
    ctx.beginPath()
    ctx.arc(CENTER_X, HEIGHT, HEIGHT, Math.PI, 0)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = "white"

    // Draws The Semi-Circle Outline thing
    ctx.beginPath()
    ctx.arc(CENTER_X, HEIGHT, HEIGHT - 18, Math.PI, 0)
    ctx.closePath()
    ctx.fill()

    for (let i = 0; i < RANKS.length; i++) {
        const STARTANGLE = 180 + (i * ANGLE)
        const ENDANGLE = (180 + ANGLE) + (i * ANGLE)

        ctx.fillStyle = RANKCOLORS[RANKS[i]]
        ctx.beginPath()
        ctx.moveTo(CENTER_X, HEIGHT)
        ctx.arc(CENTER_X, HEIGHT, HEIGHT - 20, deg_to_rad(STARTANGLE), deg_to_rad(ENDANGLE))
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = "white"

        const RANK = RANKS[i].slice(0, 3).toUpperCase()
        const RankWidth = ctx.measureText(RANK).width
        const RankAngle = ENDANGLE - ANGLE / 2

        ctx.save()

        ctx.translate(CENTER_X, HEIGHT)
        ctx.rotate(deg_to_rad(90 + RankAngle))

        ctx.fillText(RANK, -RankWidth / 2, -HEIGHT + 14)

        ctx.restore()
    }
}

export function FinishOneRMVisual(Rotation, Width = 20, Height = 100, BorderWidth = 5) {
    ctx.fillStyle = "white"

    ctx.save()

    ctx.translate(CENTER_X, HEIGHT)
    ctx.rotate(deg_to_rad(-90 + Rotation))

    // Needle Base Outline
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, Width / 2 + BorderWidth, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()

    // Needle Point Outline
    ctx.beginPath()
    ctx.moveTo(-Width / 2 - BorderWidth, 0)
    ctx.lineTo(0, -Height - BorderWidth)
    ctx.lineTo(Width / 2 + BorderWidth, 0)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = "black"

    // Needle Base (the circle part)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, Width / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()

    // Needle Point (the triangle part)
    ctx.beginPath()
    ctx.moveTo(-Width / 2, 0)
    ctx.lineTo(0, -Height)
    ctx.lineTo(Width / 2, 0)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
}

function deg_to_rad(degrees) {
    return degrees * (Math.PI / 180)
}
