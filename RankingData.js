export const AGEMULTIPLERS = [
    {min: 0, max: 17, percent: 0.85},
    {min: 18, max: 29, percent: 1.0},
    {min: 30, max: 39, percent: 0.97},
    {min: 40, max: 49, percent: 0.92},
    {min: 50, max: 59, percent: 0.85},
    {min: 60, max: 69, percent: 0.75},
    {min: 70, max: Infinity, percent: 0.65}
]

export const EXERCISEINFO = {
    Male: {
        Weight: {
            OverheadPress: {
                Novice: {min: 0.5, max: 0.75},
                Intermediate: {min: 0.75, max: 1.0},
                Advanced: {min: 1.0, max: 1.25},
                Elite: {min: 1.25, max: 1.5}
            },
            BenchPress: {
                Novice: {min: 0.9, max: 1.2},
                Intermediate: {min: 1.2, max: 1.6},
                Advanced: {min: 1.6, max: 2.0}
            },
            Squat: {
                Novice: {min: 1.25, max: 1.5},
                Intermediate: {min: 1.5, max: 2.0},
                Advanced: {min: 2.0, max: 2.7}
            },
            Deadlift: {
                Novice: {min: 1.5, max: 1.9},
                Intermediate: {min: 1.9, max: 2.4},
                Advanced: {min: 2.4, max: 3.1}
            }
        },
        Bodyweight: {
            PushUps: {
                Novice: {min: 17, max: 38},
                Intermediate: {min: 39, max: 67},
                Advanced: {min: 68, max: 98}
            },
            Dips: {
                Novice: {min: 8, max: 19},
                Intermediate: {min: 20, max: 33},
                Advanced: {min: 34, max: 48}
            },
            ChinUps: {
                Novice: {min: 5, max: 14},
                Intermediate: {min: 14, max: 25},
                Advanced: {min: 25, max: 36}
            }
        }
    },
    Female: {
        Weight: {
            OverheadPress: {
                Novice: {min: 0.4, max: 0.6},
                Intermediate: {min: 0.6, max: 0.81},
                Advanced: {min: 0.81, max: 0.967}
            },
            BenchPress: {
                Novice: {min: 0.5, max: 0.75},
                Intermediate: {min: 0.75, max: 1.0},
                Advanced: {min: 1.0, max: 1.3}
            },
            Squat: {
                Novice: {min: 0.9, max: 1.2},
                Intermediate: {min: 1.2, max: 1.6},
                Advanced: {min: 1.6, max: 2.0}
            },
            Deadlift: {
                Novice: {min: 1.1, max: 1.4},
                Intermediate: {min: 1.4, max: 1.8},
                Advanced: {min: 1.8, max: 2.3}
            }
        },
        Bodyweight: {
            PushUps: {
                Novice: {min: 5, max: 19},
                Intermediate: {min: 19, max: 37},
                Advanced: {min: 37, max: 55}
            },
            Dips: {
                Novice: {min: 1, max: 10},
                Intermediate: {min: 10, max: 22},
                Advanced: {min: 22, max: 34}
            },
            ChinUps: {
                Novice: {min: 1, max: 6},
                Intermediate: {min: 6, max: 15},
                Advanced: {min: 15, max: 25}
            }
        }
    }
}