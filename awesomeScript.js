import { AGEMULTIPLERS, EXERCISEINFO } from "./RankingData.js"

const GenderSelect = document.getElementById("GenderSelect")

const LoadInput = document.getElementById("LoadInput")
const RepsInput = document.getElementById("RepsInput")
const WeightInput = document.getElementById("WeightInput")
const AgeInput = document.getElementById("AgeInput")

const ExerciseSelect = document.getElementById("ExerciseSelect")

const MeasurementUnit = document.getElementById("UnitSelect")

const CalculateButton = document.getElementById("CalculateButton")

const OneRMBuildup = document.getElementById("ScoreBuildup")
const RankBuildup = document.getElementById("RankBuildup")

const OneRMResultText = document.getElementById("OneRMResult")
const RankingResultText = document.getElementById("RankingResult")

const ONERMFORMULAS = {
    Weight: (Load, Reps) => Number((Load * Reps * 0.033 + Load).toFixed(1)),
    Bodyweight: (Load, Reps, bw) => Number(((bw * Load) * (1 + 0.033 * Reps)).toFixed(1))
}

function GetAgeMultiplier() {
    const Length = AGEMULTIPLERS.length
    const Age = Number(AgeInput.value)
    for (let i = 0; i < Length; i++) {
        if (Age >= AGEMULTIPLERS[i].min && Age <= AGEMULTIPLERS[i].max) {
            return AGEMULTIPLERS[i].percent
        }
    }

    return 1
}

function GetRanking(OneRM, Exercise, ExerciseType, Gender, AgeMultiplier) {
    const ExerciseData = EXERCISEINFO[Gender][ExerciseType][Exercise]
    const levels = Object.keys(ExerciseData)

    if (ExerciseType == "Weight") {

        const Weight = Number(WeightInput.value)
        const MINmin = Math.round(ExerciseData.Novice.min * Weight * AgeMultiplier)

        if (OneRM < MINmin) {
            return "Beginner"
        }

        for (let i = 0; i < levels.length; i++) {
            const level = levels[i]
            const min = Math.round(ExerciseData[level].min * Weight * AgeMultiplier)
            const max = Math.round(ExerciseData[level].max * Weight * AgeMultiplier)
            if (OneRM >= min && OneRM <= max) {
                return levels[i]
            }
        }

    } else {

        const Reps = Number(RepsInput.value)
        const MINmin = Math.round(ExerciseData.Novice.min * AgeMultiplier)

        if (Reps < MINmin) {
            return "Beginner"
        }

        for (let i = 0; i < levels.length; i++) {
            const level = levels[i]
            const min = Math.round(ExerciseData[level].min * AgeMultiplier)
            const max = Math.round(ExerciseData[level].max * AgeMultiplier)
            if (Reps >= min && Reps <= max) {
                return levels[i]
            }
        }
    }
    return "Elite"
}

CalculateButton.addEventListener("click", () => {
    const SelectedOption = ExerciseSelect.selectedOptions[0]
    const Reps = Number(RepsInput.value)
    let OneRM
    let AgeMultiplier = GetAgeMultiplier()
    const Load = Number(LoadInput.value)

    if (Reps == 1) {
        OneRM = Load
        AgeMultiplier = 1
    } else {
        OneRM = ONERMFORMULAS[SelectedOption.dataset.type](Load, Reps, SelectedOption.dataset.bw)
    }

    OneRMResultText.textContent = String(OneRM) + MeasurementUnit.selectedOptions[0].value

    const Gender = GenderSelect.selectedOptions[0].value
    const Exercise = SelectedOption.value.replace(/\s/g, "")
    const ExerciseType = SelectedOption.dataset.type

    const Ranking = GetRanking(OneRM, Exercise, ExerciseType, Gender, AgeMultiplier)
    RankingResultText.textContent = Ranking + "!"

    OneRMBuildup.textContent = "Your 1RM is:"
    RankBuildup.textContent = "You're:"
})

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
        .register("/1rm-generator/service-worker.js")
        .then(reg => {
            console.log("Service Worker registered:", reg.scope);
        })
        .catch(err => {
            console.error("Service Worker failed:", err);
        });
    });

}
