import { RANKCOLORS } from "../RankingData.js"

const Canvas = document.getElementById("GasMeter")
const ctx = Canvas.getContext("2d")

const WIDTH = Canvas.width
const HEIGHT = Canvas.height

const CENTER_X = Canvas.width / 2

const RANKS = Object.keys(RANKCOLORS)

const ANGLE = 180 / RANKS.length

const TWEENLENGTH = 1.0
let TweenTime = 0.0
let Progress = 0.0
let lastTime = 0.0
let NeedlePos = 0
let StartNeedlePos = -90
let TargetNeedlePos = 0

const NEEDLEWIDTH = 20
const NEEDLEHEIGHT = 100
const NEEDLEBORDERWIDTH = 5

ctx.font = "14px Arial"

export function DrawOneRMVisual(Rotation) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    const ProperRotation = -90 + Rotation

    DrawGasMeter()
    DrawGasNeedle(-90)

    TargetNeedlePos = ProperRotation
    TweenTime = 0.0
    Progress = 0.0

    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            lastTime = performance.now()
            requestAnimationFrame(UpdateNeedlePos)
            observer.disconnect()
        }
    },
    {
        threshold: 0.67
    })

    observer.observe(Canvas)
}

function DrawGasMeter() {
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

function DrawGasNeedle(Rotation) {
    ctx.fillStyle = "white"

    ctx.save()

    ctx.translate(CENTER_X, HEIGHT)
    ctx.rotate(Rotation)

    // Needle Base Outline
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, NEEDLEWIDTH / 2 + NEEDLEBORDERWIDTH, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()

    // Needle Point Outline
    ctx.beginPath()
    ctx.moveTo(-NEEDLEWIDTH / 2 - NEEDLEBORDERWIDTH, 0)
    ctx.lineTo(0, -NEEDLEHEIGHT - NEEDLEBORDERWIDTH)
    ctx.lineTo(NEEDLEWIDTH / 2 + NEEDLEBORDERWIDTH, 0)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = "black"

    // Needle Base (the circle part)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, NEEDLEWIDTH / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()

    // Needle Point (the triangle part)
    ctx.beginPath()
    ctx.moveTo(-NEEDLEWIDTH / 2, 0)
    ctx.lineTo(0, -NEEDLEHEIGHT)
    ctx.lineTo(NEEDLEWIDTH / 2, 0)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
}

function UpdateNeedlePos(time) {
    const deltaTime = (time - lastTime) / 1000
    lastTime = time

    TweenTime += deltaTime
    Progress = TweenTime / TWEENLENGTH
    NeedlePos = StartNeedlePos + (TargetNeedlePos - StartNeedlePos) * easeOut(Progress, 2)

    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    DrawGasMeter()
    DrawGasNeedle(deg_to_rad(NeedlePos))

    if (Progress < 1) {
        requestAnimationFrame(UpdateNeedlePos)
    } else {
        ctx.clearRect(0, 0, WIDTH, HEIGHT)
        DrawGasMeter()
        DrawGasNeedle(deg_to_rad(TargetNeedlePos))
    }
}

function deg_to_rad(degrees) {
    return degrees * (Math.PI / 180)
}

function easeOut(Progress, power) {
    return 1 - Math.pow(1 - Progress, power)
}
