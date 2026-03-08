import { AGEMULTIPLERS, ONERMEXERCISEINFO, PERFORMMETRICSINFO } from "./RankingData.js"

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

const MenuOptions = document.querySelectorAll(".MenuOption")
const MenuOptionsContainer = document.getElementById("MenuOptions")

const MenuSwitchers = document.querySelectorAll(".SwitchButton")

const ONERMFORMULAS = {
    Weight: (Load, Reps) => Number((Load * Reps * 0.033 + Load).toFixed(1)),
    Bodyweight: (Load, Reps, bw) => Number(((bw * Load) * (1 + 0.033 * Reps)).toFixed(1))
}

let OneRM
let AgeMultiplier

let CurrentOpenMenu

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

        CalculateOneRM()

        OneRMBuildup.textContent = "Your 1RM is:"
        RankBuildup.textContent = "You're:"

        OneRMResultText.textContent = String(OneRM) + MeasurementUnit.selectedOptions[0].value

        const Gender = OneRMGenderSelect.selectedOptions[0].value
        const Exercise = ExerciseSelect.selectedOptions[0].value.replace(/\s/g,  "")
        const ExerciseType = ExerciseSelect.selectedOptions[0].dataset.type

        const ExerciseData = ONERMEXERCISEINFO[Gender][ExerciseType][Exercise]

        if (IsBeginner(ExerciseType, ExerciseData.Novice, AgeMultiplier)) {
            RankingResultText.textContent = "Beginner!"
            return
        }
    
        const levels = Object.keys(ExerciseData)
        const Comparer = ONERMRANKINGINFO[ExerciseType].Comparer()
        const DataMultiplier = ONERMRANKINGINFO[ExerciseType].DataMultiplier(AgeMultiplier)

        for (let i = 0; i < levels.length; i++) {
            const level = levels[i]
            const min = Math.round(ExerciseData[level].min * DataMultiplier)
            const max = Math.round(ExerciseData[level].max * DataMultiplier)
            if (Comparer >= min && Comparer <= max) {
                RankingResultText.textContent = levels[i]
                return
            }
        }
        RankingResultText.textContent = "Elite!"

    } else {

        Results.innerHTML = ""
        ResultsContainer.classList.remove("NotRendered")
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

            for (let i = 0; i < levels.length; i++) {
                const level = levels[i]
                const min = ExerciseData[level].min
                const max = ExerciseData[level].max
                if (InputValue >= min && InputValue <= max) {
                    ShowExerciseRank(InputBox.dataset.shortname, level)
                    return
                }
            }
            ShowExerciseRank(InputBox.dataset.shortname, "Elite")
        })
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

function IsBeginner(ExerciseType, Novice, AgeMultiplier) {
    let Comparer
    let MINmin
    if (ExerciseType == "Weight") {
        Comparer = OneRM
        const Weight = Number(WeightInput.value)
        MINmin = Math.round(Novice.min * Weight * AgeMultiplier)
    } else {
        Comparer = Number(RepsInput.value)
        MINmin = Math.round(Novice.min * AgeMultiplier)
    }

    if (Comparer < MINmin) {
        return true
    }
    return false
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
        inches = Number(parts[0]) * 12;
    }

    return (feet * 12) + inches;
}

function ShowExerciseRank(Name, Rank) {
    const Cloned = RankTemplate.content.cloneNode(true)
    
    const NameText = Cloned.children[1].children[0]
    const RankText = Cloned.children[1].children[1]

    NameText.textContent = Name
    RankText.textContent = Rank

    Results.appendChild(Cloned)
}

CalculateButtons.forEach( (CalculateButton) => {
    CalculateButton.addEventListener("click", () => {
        EvaluatePerformance(CalculateButton.id)
    })
}) 

MenuOptions.forEach( (Button) => {
    Button.addEventListener("click", () => {
        MenuOptionsContainer.classList.add("NotRendered")
        const MenuToOpen = document.getElementById(Button.dataset.menu)

        MenuToOpen.classList.remove("NotRendered")
        CurrentOpenMenu = MenuToOpen
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
