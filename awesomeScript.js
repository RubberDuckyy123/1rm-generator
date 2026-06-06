import { ONERMAGEMULTIPLERS, ONERMEXERCISEINFO, PERFORMMETRICSINFO, VO2MAXINFO, RANKCOLORS } from "./RankingData.js"
import { DrawOneRMVisual } from "./VisualDrawers/OneRMVisual.js"
import { DrawPerformMetricsVisual } from "./VisualDrawers/PerformMetricsVisual.js"

const OneRMComponents = {
    genderSelect: document.getElementById("OneRMGenderSelect"),
    loadInput: document.getElementById("OneRMLoadInput"),
    repsInput: document.getElementById("OneRMRepsInput"),
    weightInput: document.getElementById("OneRMWeightInput"),
    ageInput: document.getElementById("OneRMAgeInput"),
    exerciseSelect: document.getElementById("OneRMExerciseSelect"),
    unitSelect: document.getElementById("OneRMUnitSelect"),
    scoreResult: document.getElementById("OneRMResult"),
    rankResult: document.getElementById("OneRMRankingResult"),
    OneRM: null,
    AgeMultiplier: null,
    ONERMFORMULAS: {
        Weight: (Load, Reps) => Number((Load * Reps * 0.033 + Load).toFixed(1)),
        Bodyweight: (Load, Reps, bw) => Number(((bw * Load) * (1 + 0.033 * Reps)).toFixed(1))
    },
    ONERMRANKINGINFO: {
        Weight: {
            DataMultiplier(AgeMultiplier) {
                return Number(OneRMComponents.weightInput.value) * AgeMultiplier
            },
            Comparer() {
                return OneRMComponents.OneRM
            }
        },
        Bodyweight: {
            DataMultiplier: (AgeMultiplier) => AgeMultiplier,
            Comparer() {
                return Number(OneRMComponents.repsInput.value)
            }
        }
    },
    ShowAndReturnOneRMRanking() {
        OneRMComponents.scoreResult.textContent = String(this.OneRM) + this.unitSelect.selectedOptions[0].value

        const Gender = this.genderSelect.selectedOptions[0].value
        const Exercise = this.exerciseSelect.selectedOptions[0].value.replace(/\s/g,  "")
        const ExerciseType = this.exerciseSelect.selectedOptions[0].dataset.type

        const ExerciseData = ONERMEXERCISEINFO[Gender][ExerciseType][Exercise]
    
        const levels = Object.keys(ExerciseData)
        const Comparer = this.ONERMRANKINGINFO[ExerciseType].Comparer()
        const DataMultiplier = this.ONERMRANKINGINFO[ExerciseType].DataMultiplier(this.AgeMultiplier)

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
    },
    CalculateAndSetOneRM() {
        const SelectedOption = this.exerciseSelect.selectedOptions[0]
        const Reps = Number(this.repsInput.value)
        this.AgeMultiplier = this.GetAgeMultiplier()
        const Load = Number(this.loadInput.value)

        if (Reps == 1) {
            this.OneRM = Load
            this.AgeMultiplier = 1
        } else {
            this.OneRM = this.ONERMFORMULAS[SelectedOption.dataset.type](Load, Reps, SelectedOption.dataset.bw)
        }
    },
    GetAgeMultiplier() {
        const Length = ONERMAGEMULTIPLERS.length
        const Age = Number(this.ageInput.value)
        for (let i = 0; i < Length; i++) {
            if (Age >= ONERMAGEMULTIPLERS[i].min && Age <= ONERMAGEMULTIPLERS[i].max) {
                return ONERMAGEMULTIPLERS[i].percent
            }
        }
        return 1
    },
    EvalOneRM() {
        OneRMComponents.CalculateAndSetOneRM()

        document.getElementById("OneRMScoreBuildup").textContent = "Your 1RM is:"
        document.getElementById("OneRMRankBuildup").textContent = "You're:"
        const RANKING = OneRMComponents.ShowAndReturnOneRMRanking()
        OneRMComponents.rankResult.textContent = RANKING.Name
        OneRMComponents.rankResult.style.color = RANKCOLORS[RANKING.Name]

        const ANGLE = 180 / Object.keys(RANKCOLORS).length
        const NeedleRotation = Math.max(Math.min((ANGLE * RANKING.RankNumber) + ANGLE * GetPercentage(RANKING.Score, RANKING.Info.min, RANKING.Info.max), 180), 0)

        document.getElementById("GasMeter").classList.remove("NotRendered")

        DrawOneRMVisual(NeedleRotation)
    }
}

const PerformMetricsComponents = {
    genderSelect: document.getElementById("MetricsGenderSelect"),
    inputs: document.querySelectorAll(".PerformMetricInfo"),
    resultsContainer: document.getElementById("ResultsContainer"),
    results: document.getElementById("Results"),
    rankTemplate: document.getElementById("ExerciseRankTemplate"),
    ShowAndReturnPerformMetricsRankings() {
        PerformMetricsComponents.results.innerHTML = ""
        PerformMetricsComponents.resultsContainer.classList.remove("NotRendered")

        let ExercisesAndRanks = {}

        PerformMetricsComponents.inputs.forEach( (InputBox) => { 
            let InputValue
            if (InputBox.dataset.inputtype == "distance") {
                InputValue = FeetToInches(InputBox.value)
            } else {
                InputValue = Number(InputBox.value)
            }
            
            if (isNaN(InputValue) || InputValue == "") {
                return
            }

            const ExerciseData = PERFORMMETRICSINFO[PerformMetricsComponents.genderSelect.selectedOptions[0].value][InputBox.dataset.name]

            const levels = Object.keys(ExerciseData)

            let IsReversed = false
            let EliteRank = {RANK: "Elite"}

            if (InputBox.dataset.shortname == "20m") {
                IsReversed = true
                EliteRank.PERCENT = GetPercentage(InputValue, 0, ExerciseData.Advanced.min, true)
                if (InputValue > ExerciseData.Beginner.max) {
                    ExercisesAndRanks[InputBox.dataset.shortname] = {RANK: "Beginner", PERCENT: 0}
                    return
                }
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
    },
    ShowPerformMetricsExerciseRank(Name, Rank) {
        const Cloned = PerformMetricsComponents.rankTemplate.content.cloneNode(true)
    
        const NameText = Cloned.children[1].children[0]
        const RankText = Cloned.children[1].children[1]

        NameText.textContent = Name
        RankText.textContent = Rank

        PerformMetricsComponents.results.appendChild(Cloned)
    },
    EvalPerformMetrics() {
        const RANKINGS = PerformMetricsComponents.ShowAndReturnPerformMetricsRankings()
        const Names = Object.keys(RANKINGS)
        for (let i = 0; i < Names.length; i++) {
            PerformMetricsComponents.ShowPerformMetricsExerciseRank(Names[i], RANKINGS[Names[i]].RANK)
        }

        document.getElementById("BarGraph").classList.remove("NotRendered")

        DrawPerformMetricsVisual(RANKINGS)
    }
}

const VMaxComponents = {
    genderSelect: document.getElementById("VMaxGenderSelect"),
    ageInput: document.getElementById("VMaxAgeInput"),
    exerciseType: document.getElementById("VMaxExerciseType"),
    scoreInput: document.getElementById("VMaxScoreInput"),
    scoreResult: document.getElementById("VMaxResult"),
    rankResult: document.getElementById("VMaxRankingResult"),
    vMax: null,
    EvalVMax() {
        document.getElementById("VMaxScoreBuildup").textContent = "Your Vo2 Max is:"
        document.getElementById("VMaxRankBuildup").textContent = "Your Rank is:"
        VMaxComponents.vMax = VMaxComponents.CalculateVMax()
        VMaxComponents.scoreResult.textContent = VMaxComponents.vMax
        const RankInfo = VMaxComponents.GetRankingAndColor()
        console.log(RankInfo)
        VMaxComponents.rankResult.textContent = RankInfo.Rank
        VMaxComponents.rankResult.style.color = RankInfo.Color
    },
    CalculateVMax() {
        const Score = Number(VMaxComponents.scoreInput.value)
        let VMax
        if (Score == "") {
            VMax = 0
        } else {
            if (VMaxComponents.exerciseType.selectedOptions[0].value == "12 Min") {
                VMax = 35.97 * Score - 11.29
            } else {
                VMax = 483 / Score + 3.5
            }
        }
        return VMax.toFixed(2)
    },
    GetRankingAndColor() {
        const Age = (Number(VMaxComponents.ageInput.value) == "") ? 0 : Number(VMaxComponents.ageInput.value)
        const ClampedAge = clamp(20, 79, Age)
        const AgeIndex = Math.floor((ClampedAge - 20) / 10)
        const RankData = VO2MAXINFO[VMaxComponents.genderSelect.selectedOptions[0].value]
        console.log(ClampedAge)
        const Ranks = Object.keys(RankData)
        const Thresholds = Object.values(RankData)
        const AllColors = Object.values(RANKCOLORS)
        for (let i = 0; i < Ranks.length; i++) {
            const Threshold = Thresholds[i][AgeIndex]
            console.log(Threshold)
            if (VMaxComponents.vMax >= Threshold) {
                let ReturnedObject = {Rank: Ranks[i], Color: null}
                if (Ranks[i] == "Excellent") {
                    ReturnedObject.Color = "#51db61"
                } else {
                    ReturnedObject.Color = AllColors[i]
                }
                return ReturnedObject
            }
        }
        return {Rank: "Poor", Color: AllColors[AllColors.length - 1]}
    },
    Init() {
        VMaxComponents.exerciseType.addEventListener("input", () => {
            if (VMaxComponents.exerciseType.selectedOptions[0].value == "12 Min") {
                VMaxComponents.scoreInput.setAttribute("placeholder", "Miles")
            } else {
                VMaxComponents.scoreInput.setAttribute("placeholder", "Minutes")
            }
        })
    }
}

VMaxComponents.Init()
const CalculateButtons = document.querySelectorAll(".CalculateButton")
const MenuSwitchers = document.querySelectorAll(".MenuSwitcher")
let CurrentOpenMenu = document.getElementById("MenuOptions")

const EvalFunctions = {
    "OneRMCalculateButton": OneRMComponents.EvalOneRM,
    "PerformMetricsCalculateButton": PerformMetricsComponents.EvalPerformMetrics,
    "VMaxCalculateButton": VMaxComponents.EvalVMax
}

function FeetToInches(input) {
    const parts = input.trim().split(/['"]/)

    let feet = 0;
    let inches = 0;

    if (parts.length === 2) {
        if (parts[1] == "") { // Typed inches'
            inches = Number(parts[0])
        } else { // Typed ft'inches
            feet = Number(parts[0]);
            inches = Number(parts[1])
        }
    } 
    else if (parts.length === 1) {
        inches = Number(parts[0]) * 12;
    }

    return (feet * 12) + inches;
}

function GetPercentage(Score, Min, Max, Reversed=false) {
    if (Reversed) {
        return (Max - Score) / (Max - Min)
    } else {
        return (Score - Min) / (Max - Min)
    }
}

function clamp(Min, Max, Val) {
    return Math.max(Math.min(Max, Val), Min)
}

CalculateButtons.forEach( (CalculateButton) => {
    CalculateButton.addEventListener("click", () => {
        EvalFunctions[CalculateButton.id]()
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
