export const AGEMULTIPLERS = [
    {min: 0, max: 17, percent: 0.85},
    {min: 18, max: 29, percent: 1.0},
    {min: 30, max: 39, percent: 0.97},
    {min: 40, max: 49, percent: 0.92},
    {min: 50, max: 59, percent: 0.85},
    {min: 60, max: 69, percent: 0.75},
    {min: 70, max: Infinity, percent: 0.65}
]

export const ONERMEXERCISEINFO = {
    Male: {
        Weight: {
            OverheadPress: {
                Novice: {min: 0.5, max: 0.75},
                Intermediate: {min: 0.75, max: 1.0},
                Advanced: {min: 1.0, max: 1.25},
                Elite: {min: 1.25, max: 2.0}
            },
            BenchPress: {
                Novice: {min: 0.9, max: 1.2},
                Intermediate: {min: 1.2, max: 1.6},
                Advanced: {min: 1.6, max: 2.0},
                Elite: {min: 2.0, max: 3.0}
            },
            Squat: {
                Novice: {min: 1.25, max: 1.5},
                Intermediate: {min: 1.5, max: 2.0},
                Advanced: {min: 2.0, max: 2.7},
                Elite: {min: 2.7, max: 4.0}
            },
            Deadlift: {
                Novice: {min: 1.5, max: 1.9},
                Intermediate: {min: 1.9, max: 2.4},
                Advanced: {min: 2.4, max: 3.1},
                Elite: {min: 3.1, max: 4.5}
            },
            HipThrust: {
                Novice: {min: 0.75, max: 1.0},
                Intermediate: {min: 1.0, max: 1.5},
                Advanced: {min: 1.5, max: 2.0},
                Elite: {min: 2.0, max: 2.5}
            }
        },
        Bodyweight: {
            PushUps: {
                Novice: {min: 17, max: 38},
                Intermediate: {min: 39, max: 67},
                Advanced: {min: 68, max: 98},
                Elite: {min: 98, max: 130}
            },
            Dips: {
                Novice: {min: 8, max: 19},
                Intermediate: {min: 20, max: 33},
                Advanced: {min: 34, max: 48},
                Elite: {min: 48, max: 65}
            },
            ChinUps: {
                Novice: {min: 5, max: 14},
                Intermediate: {min: 14, max: 25},
                Advanced: {min: 25, max: 36},
                Elite: {min: 36, max: 53}
            }
        }
    },
    Female: {
        Weight: {
            OverheadPress: {
                Novice: {min: 0.4, max: 0.6},
                Intermediate: {min: 0.6, max: 0.81},
                Advanced: {min: 0.81, max: 0.967},
                Elite: {min: 0.967, max: 1.5}
            },
            BenchPress: {
                Novice: {min: 0.5, max: 0.75},
                Intermediate: {min: 0.75, max: 1.0},
                Advanced: {min: 1.0, max: 1.3},
                Elite: {min: 1.3, max: 1.67}
            },
            Squat: {
                Novice: {min: 0.9, max: 1.2},
                Intermediate: {min: 1.2, max: 1.6},
                Advanced: {min: 1.6, max: 2.0},
                Elite: {min: 2.0, max: 2.67}
            },
            Deadlift: {
                Novice: {min: 1.1, max: 1.4},
                Intermediate: {min: 1.4, max: 1.8},
                Advanced: {min: 1.8, max: 2.3},
                Elite: {min: 2.3, max: 3.1}
            },
            HipThrust: {
                Novice: {min: 0.5, max: 0.75},
                Intermediate: {min: 0.75, max: 1.25},
                Advanced: {min: 1.25, max: 1.75},
                Elite: {min: 1.75, max: 2.25}
            }
        },
        Bodyweight: {
            PushUps: {
                Novice: {min: 5, max: 19},
                Intermediate: {min: 19, max: 37},
                Advanced: {min: 37, max: 55},
                Elite: {min: 55, max: 75}
            },
            Dips: {
                Novice: {min: 1, max: 10},
                Intermediate: {min: 10, max: 22},
                Advanced: {min: 22, max: 34},
                Elite: {min: 34, max: 53}
            },
            ChinUps: {
                Novice: {min: 1, max: 6},
                Intermediate: {min: 6, max: 15},
                Advanced: {min: 15, max: 25},
                Elite: {min: 25, max: 35}
            }
        }
    }

}

export const PERFORMMETRICSINFO = {
    Male: {
        BroadJump: {
            Novice: {min: 65, max: 74},
            Intermediate: {min: 74, max: 89},
            Advanced: {min: 89, max: 99},
            Elite: {min: 99, max: 123}
        },
        VerticalJump: {
            Novice: {min: 16, max: 20},
            Intermediate: {min: 20, max: 24},
            Advanced: {min: 24, max: 28},
            Elite: {min: 28, max: 41}
        },
        MedicineBallChestThrow: {
            Novice: {min: 90, max: 137},
            Intermediate: {min: 137, max: 193},
            Advanced: {min: 193, max: 252},
            Elite: {min: 252, max: 312}
        },
        TwentyMeterSprint: {
            Beginner: {min: 4.0, max: 5.0},
            Novice: {min: 3.3, max: 4.0},
            Intermediate: {min: 2.99, max: 3.3},
            Advanced: {min: 2.7, max: 2.99}
        }
    },
    Female: {
        BroadJump: {
            Novice: {min: 53, max: 62},
            Intermediate: {min: 62, max: 72},
            Advanced: {min: 72, max: 84},
            Elite: {min: 84, max: 101}
        },
        VerticalJump: {
            Novice: {min: 12, max: 16},
            Intermediate: {min: 16, max: 20},
            Advanced: {min: 20, max: 24},
            Elite: {min: 24, max: 32}
        },
        MedicineBallChestThrow: {
            Novice: {min: 69, max: 81},
            Intermediate: {min: 81, max: 134},
            Advanced: {min: 134, max: 181},
            Elite: {min: 181, max: 229}
        },
        TwentyMeterSprint: {
            Beginner: {min: 4.1, max: 5.5},
            Novice: {min: 3.8, max: 4.1},
            Intermediate: {min: 3.41, max: 3.8},
            Advanced: {min: 3.1, max: 3.41}
        }
    }
}

export const RANKCOLORS = {
    Beginner: "#009eff",
    Novice: "blue",
    Intermediate: "yellow",
    Advanced: "orange",
    Elite: "red"
}
