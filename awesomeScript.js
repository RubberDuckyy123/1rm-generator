import { AGEMULTIPLERS, ONERMEXERCISEINFO, PERFORMMETRICSINFO, RANKCOLORS } from "./RankingData.js"
import { ResetOneRMVisual, SetupOneRMVisual, FinishOneRMVisual } from "./VisualDrawers/OneRMVisual.js"
import { ResetPerformMetricsVisual, SetupPerformMetricsVisual, FinishPerformMetricsVisual } from "./VisualDrawers/PerformMetricsVisual.js"

const OneRMGenderSelect = document.getElementById("OneRMGenderSelect")
const MetricsGenderSelect = document.getElementById("MetricsGenderSelect")

const LoadInput = document.getElementById("LoadInput")
const RepsInput = document.getElementById("RepsInput")
const WeightInput = document.getElementById("WeightInput")
const AgeInput = document.getElementById("AgeInput")

const ExerciseSelect = document.getElementById("ExerciseSelect")

const MeasurementUnit = document.getElementById("UnitSelect")

const CalculateButtons = document.querySelectorAll(".CalculateButton")

const OneRMBuildup = document.getElementById("ScoreBuildup")
const RankBuildup = document.getElementById("RankBuildup")

const OneRMResultText = document.getElementById("OneRMResult")
const RankingResultText = document.getElementById("RankingResult")

const PerformMetricsInfo = document.querySelectorAll(".PerformMetricInfo")

const RankTemplate = document.getElementById("ExerciseRankTemplate")
const Results = document.getElementById("Results")
const ResultsContainer = document.getElementById("ResultsContainer")

const MenuSwitchers = document.querySelectorAll(".MenuSwitcher")

const ONERMFORMULAS = {
    Weight: (Load, Reps) => Number((Load * Reps * 0.033 + Load).toFixed(1)),
    Bodyweight: (Load, Reps, bw) => Number(((bw * Load) * (1 + 0.033 * Reps)).toFixed(1))
}

let OneRM
let AgeMultiplier

let CurrentOpenMenu = document.getElementById("MenuOptions")

const ONERMRANKINGINFO = {
    Weight: {
        DataMultiplier: (AgeMultiplier) => Number(WeightInput.value) * AgeMultiplier,
        Comparer: () => OneRM
    },
    Bodyweight: {
        DataMultiplier: (AgeMultiplier) => AgeMultiplier,
        Comparer: () => Number(RepsInput.value)
    }
}

function EvaluatePerformance(mode) {
    if (mode == "OneRMCalculateButton") {
        EvalOneRM()
    } else {
        EvalPerformMetrics()
    }
}

function EvalOneRM() {
    CalculateOneRM()

    const RANKING = ShowAndReturnOneRMRanking()
    RankingResultText.textContent = RANKING.Name
    RankingResultText.style.color = RANKCOLORS[RANKING.Name]

    ResetOneRMVisual()
    SetupOneRMVisual()

    const ANGLE = 180 / Object.keys(RANKCOLORS).length
    const NeedleRotation = (ANGLE * RANKING.RankNumber) + ANGLE * GetPercentage(RANKING.Score, RANKING.Info.min, RANKING.Info.max)

    FinishOneRMVisual(NeedleRotation)
}

function EvalPerformMetrics() {
    ResetPerformMetricsVisual()
    SetupPerformMetricsVisual()

    const RANKINGS = ShowAndReturnPerformMetricsRankings()
    const Names = Object.keys(RANKINGS)
    for (let i = 0; i < Names.length; i++) {
        ShowPerformMetricsExerciseRank(Names[i], RANKINGS[Names[i]].RANK)
    }

    FinishPerformMetricsVisual(RANKINGS)
}

function ShowAndReturnOneRMRanking() {
    OneRMBuildup.textContent = "Your 1RM is:"
    RankBuildup.textContent = "You're:"

    OneRMResultText.textContent = String(OneRM) + MeasurementUnit.selectedOptions[0].value

    const Gender = OneRMGenderSelect.selectedOptions[0].value
    const Exercise = ExerciseSelect.selectedOptions[0].value.replace(/\s/g,  "")
    const ExerciseType = ExerciseSelect.selectedOptions[0].dataset.type

    const ExerciseData = ONERMEXERCISEINFO[Gender][ExerciseType][Exercise]
    
    const levels = Object.keys(ExerciseData)
    const Comparer = ONERMRANKINGINFO[ExerciseType].Comparer()
    const DataMultiplier = ONERMRANKINGINFO[ExerciseType].DataMultiplier(AgeMultiplier)

    if (Comparer < ExerciseData.Novice.min * DataMultiplier) {
        return {Info: {min: 0, max: Math.round(ExerciseData.Novice.min * DataMultiplier)}, Name: "Beginner", Score: Comparer, RankNumber: 0} // Beginner Rank
    }

    for (let i = 0; i < levels.length; i++) {
        const level = levels[i]
        const min = Math.round(ExerciseData[level].min * DataMultiplier)
        const max = Math.round(ExerciseData[level].max * DataMultiplier)
        if (Comparer >= min && Comparer <= max) {
            return {Info: {min: min, max: max}, Name: levels[i], Score: Comparer, RankNumber: i + 1}
            
        }
    }

    return {Info: {min: ExerciseData.Advanced.max, max: ExerciseData.Elite.max}, Name: "Elite", Score: Comparer, RankNumber: levels.length}
}

function ShowAndReturnPerformMetricsRankings() {
    Results.innerHTML = ""
    ResultsContainer.classList.remove("NotRendered")

    let ExercisesAndRanks = {}

    PerformMetricsInfo.forEach( (InputBox) => { 
        let InputValue
        if (InputBox.dataset.inputtype == "distance") {
            InputValue = FeetToInches(InputBox.value)
        } else {
            InputValue = Number(InputBox.value)
        }
            
        if (isNaN(InputValue) || InputValue == "") {
            return
        }

        const ExerciseData = PERFORMMETRICSINFO[MetricsGenderSelect.selectedOptions[0].value][InputBox.dataset.name]

        const levels = Object.keys(ExerciseData)

        let IsReversed = false
        let EliteRank = {RANK: "Elite"}

        if (InputBox.dataset.shortname == "20m") {
            IsReversed = true
            EliteRank.PERCENT = GetPercentage(InputValue, 0, ExerciseData.Advanced.min, true)
        } else {
            EliteRank.PERCENT = GetPercentage(InputValue, ExerciseData.Elite.min, ExerciseData.Elite.max, IsReversed)
            if (InputValue < ExerciseData.Novice.min) {
                ExercisesAndRanks[InputBox.dataset.shortname] = {RANK: "Beginner", PERCENT: GetPercentage(InputValue, 0, ExerciseData.Novice.min)}
                return
            }
        }

        for (let i = 0; i < levels.length; i++) {
            const level = levels[i]
            const min = ExerciseData[level].min
            const max = ExerciseData[level].max
            if (InputValue >= min && InputValue <= max) {
                ExercisesAndRanks[InputBox.dataset.shortname] = {RANK: level, PERCENT: GetPercentage(InputValue, min, max, IsReversed)}
                return
            }
        }

        ExercisesAndRanks[InputBox.dataset.shortname] = EliteRank
    })
    return ExercisesAndRanks
}

function GetPercentage(Score, Min, Max, Reversed=false) {
    if (Reversed) {
        return (Max - Score) / (Max - Min)
    } else {
        return (Score - Min) / (Max - Min)
    }
}

function CalculateOneRM() {
    const SelectedOption = ExerciseSelect.selectedOptions[0]
    const Reps = Number(RepsInput.value)
    AgeMultiplier = GetAgeMultiplier()
    const Load = Number(LoadInput.value)

    if (Reps == 1) {
        OneRM = Load
        AgeMultiplier = 1
    } else {
        OneRM = ONERMFORMULAS[SelectedOption.dataset.type](Load, Reps, SelectedOption.dataset.bw)
    }
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

function ShowPerformMetricsExerciseRank(Name, Rank) {
    const Cloned = RankTemplate.content.cloneNode(true)
    
    const NameText = Cloned.children[1].children[0]
    const RankText = Cloned.children[1].children[1]

    NameText.textContent = Name
    RankText.textContent = Rank

    Results.appendChild(Cloned)
}

function FeetToInches(input) {
    const parts = input.trim().split(/['"]/).filter(p => p !== "");

    let feet = 0;
    let inches = 0;

    if (parts.length === 2) {
        feet = Number(parts[0]);
        inches = parts[1]
        const ActualInches = inches.slice(0, 1) + "." + inches.slice(1)
        inches = Number(ActualInches);
    } 
    else if (parts.length === 1) {
        inches = Number(parts[0]);
    }

    return (feet * 12) + inches;
}

CalculateButtons.forEach( (CalculateButton) => {
    CalculateButton.addEventListener("click", () => {
        EvaluatePerformance(CalculateButton.id)
    })
})

MenuSwitchers.forEach( (Button) => {
    Button.addEventListener("click", () => {
        CurrentOpenMenu.classList.add("NotRendered")
        const MenuToOpen = document.getElementById(Button.dataset.menu)

        MenuToOpen.classList.remove("NotRendered")
        CurrentOpenMenu = MenuToOpen
    })
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
