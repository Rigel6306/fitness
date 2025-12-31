
interface schedule {
    day: string,
    focus: string,
    workouts: string[]
}
interface challenge {
    challangeIndex: number
    bckImg: string,
    title: string,
    discription: string,
    level: string,
    duration: number,
    schedule: schedule[]

}

type challenges = challenge[]


const challenges: challenges = [
    {
        challangeIndex: 1,
        bckImg: require('../assets/images/cardsImg/card9.jpg'),
        title: "Mission Slimpossible",
        discription: 'Build foundational strength and cardio endurance',
        level: 'Beginner',
        duration: 7,
        schedule: [
            {
                day: 'Day One',
                focus: 'Upper Body with Cardio',
                workouts: ['15mins tradmill walk', 'Chest press 3*12']
            },
            {
                day: 'Day Two',
                focus: 'Lower body',
                workouts: ['Leg press 3*15', 'Bodyweight squats 3 *15']
            },
            {
                day: 'Day Three',
                focus: 'Rest & Stretch',
                workouts: ['Light Streatching or Yoga']
            },
            {
                day: 'Day Four',
                focus: 'Back with Cardio',
                workouts: ['20mins treadmill walk', 'Lat pulldown 3*12']
            },
            {
                day: 'Day Five',
                focus: 'Core & Stability',
                workouts: ['Plank holds', 'Seated crunch machine']
            },
            {
                day: 'Day Six',
                focus: 'Full Body Circuit',
                workouts: ['10-min treadmill', '1 set each of all machines']
            },
            {
                day: 'Day Seven',
                focus: 'Active Recovery',
                workouts: ['Light walk', 'foam rolling']
            }

        ]

    },
    {
        challangeIndex: 2,
        bckImg: require('../assets/images/cardsImg/card10.jpg'),
        title: "Fat Burn Express",
        discription: 'Boost metabolism and burn fat',
        duration: 14,
        level: 'Intermediate',
        schedule: [
            {
                day: 'Odd Days',
                focus: 'Cardio',
                workouts: ['25-30 min cardio (Elliptical or Rowing)']
            },
            {
                day: 'Even Days',
                focus: 'Strength',
                workouts: ['Strength circuits (Cable rows, Leg curls, Lunges)']
            },
            {
                day: 'Day 7 & 14',
                focus: 'Full body',
                workouts: ['HIIT-style cardio', 'full-body stretch']
            },

        ]

    },
    {
        challangeIndex: 3,
        bckImg: require('../assets/images/cardsImg/card11.jpg'),
        title: "Fit and Gain",
        discription: 'Sculpt lean muscle and improve endurance',
        duration: 21,
        level: 'Advanced',
        schedule: [
            {
                day: 'Week One',
                focus: 'Strength Foundation (Heavy Lifts, Low Reps)',
                workouts: ['Smith Squats 4x6, Leg Press 4x8, Calf Raises', 'Chest Press 4x6, Lat Pulldown 4x8, Cable Flys', 'Stair Climber 20 min + Cable Crunches', 'Active recovery/stretching', 'Seated Row 4x6, Assisted Pull-ups 3x10', 'Smith Machine Shoulder Press 4x6, Dips 3x10', 'Circuit of all machines (2 rounds, 10 reps each)']
            },
            {
                day: 'Week Two',
                focus: 'Power & Explosiveness (Moderate Weight, Fast Tempo)',
                workouts: ['Leg Press 3x12, Jump Squats', 'Chest Press 3x12, Cable Twists, Plank Variations',
                    'Lat Pulldown 3x12, Cable Rows, Bicep Curls', 'Foam rolling + mobility drills',
                    '30-min machine HIIT', 'Smith Machine Push Press, Dips, Cable Triceps',
                    'Hanging Leg Raises, Cable Crunches, Russian Twists'
                ]
            },
            {
                day: 'Week Three',
                focus: 'Endurance & Volume (Light Weight, High Reps)',

                workouts: [
                    '3x15 on all major machines (light weight)',
                    'Cable Woodchoppers, Stability Ball Crunches',
                    'Light yoga or cardio',
                    '2 rounds of 10 machines, 15 reps each',
                    'Jump squats, push-ups, assisted pull-ups',
                    'Timed full-body circuit + cooldown stretch',
                ]
            },


        ]

    },
    {
        challangeIndex: 4,
        bckImg: require('../assets/images/cardsImg/card12.jpg'),
        title: "Cardio Core Crusher",
        discription: 'Strengthen core and improve cardiovascular health',
        duration: 10,
        level: 'Intermediate',
        schedule: [
            {
                day: 'Day One',
                focus: 'Bike Intervals',
                workouts: ['20-min intervals + Cable twists']
            },
            {
                day: 'Day Two',
                focus: 'Core Strength',
                workouts: ['Ab crunch machine + Planks']
            },
            {
                day: 'Day Three',
                focus: 'Rest',
                workouts: ['Light stretching']
            },
            {
                day: 'Day Four',
                focus: 'HIIT Bike',
                workouts: ['30-min HIIT ride']
            },
            {
                day: 'Day Five',
                focus: 'Core Burn',
                workouts: ['Hanging leg raises with Cable crunches'],
            },
            {
                day: 'Day Six',
                focus: 'Combo Day',
                workouts: ['Bike + Core circuit'],
            },
            {
                day: 'Day Seven',
                focus: 'Rest',
                workouts: ['Active recovery'],
            },
            {
                day: 'Day Eight',
                focus: 'Endurance Ride',
                workouts: ['40-min steady-state bike'],
            },
            {
                day: 'Day Nine',
                focus: 'Core Sculpt',
                workouts: ['Weighted crunches + Russian twists'],
            },
            {
                day: 'Day Ten',
                focus: 'Final Burn',
                workouts: ['HIIT + full core circuit'],
            },

        ]

    },
    {
        challangeIndex: 5,
        bckImg: require('../assets/images/cardsImg/card9.jpg'),
        title: "Core Revival",
        discription: 'Strengthen your foundation with core, posture, and Cardio',
        level: 'Beginner',
        duration: 7,
        schedule: [
            {
                day: 'Day One',
                focus: 'Core Activation & Cardio',
                workouts: ['10mins treadmill walk', 'Seated crunch machine 3*15']
            },
            {
                day: 'Day Two',
                focus: 'Lower Body Strength',
                workouts: ['Leg press 3*12', 'Glute bridges 3*15']
            },
            {
                day: 'Day Three',
                focus: 'Mobility & Recovery',
                workouts: ['Foam rolling', 'Dynamic stretching routine']
            },
            {
                day: 'Day Four',
                focus: 'Upper Body Sculpt',
                workouts: ['Chest press 3*12', 'Cable rows 3*12']
            },
            {
                day: 'Day Five',
                focus: 'Core Stability',
                workouts: ['Plank holds 3x30sec', 'Cable woodchoppers 3*12']
            },
            {
                day: 'Day Six',
                focus: 'Full Body Flow',
                workouts: ['15-min stair climber', '1 set each: leg press, chest press, lat pulldown']
            },
            {
                day: 'Day Seven',
                focus: 'Stretch & Reflect',
                workouts: ['Light yoga session', 'Breathing exercises']
            }
        ]
    }




]

export const workoutSchedule = {
    title: "Master Build Program",
    subtitle: "12-Week Transformational Journey",
    duration: 84,
    progress: 42,
    level: "Advanced",
    bckImg: require('../assets/images/workouts/schedule-bg.jpg'),
    weeklyStructure: [
        {
            week: 1,
            theme: "Foundation Building",
            focus: "Strength Base",
            intensity: "Low",
            workouts: [
                { day: "Day 1", type: "Strength", focus: "Upper Body", duration: "60 min", completed: true },
                { day: "Day 2", type: "Cardio", focus: "HIIT", duration: "45 min", completed: true },
                { day: "Day 3", type: "Strength", focus: "Lower Body", duration: "60 min", completed: true },
                { day: "Day 4", type: "Active Recovery", focus: "Yoga", duration: "30 min", completed: false },
                { day: "Day 5", type: "Strength", focus: "Full Body", duration: "75 min", completed: false },
                { day: "Day 6", type: "Cardio", focus: "Steady State", duration: "50 min", completed: false },
                { day: "Day 7", type: "Rest", focus: "Recovery", duration: "0 min", completed: false },
            ]
        },
        {
            week: 2,
            theme: "Progressive Overload",
            focus: "Muscle Hypertrophy",
            intensity: "Medium",
            workouts: [
                { day: "Day 8", type: "Strength", focus: "Chest & Back", duration: "70 min", completed: false },
                { day: "Day 9", type: "Cardio", focus: "Intervals", duration: "50 min", completed: false },
                { day: "Day 10", type: "Strength", focus: "Legs & Glutes", duration: "75 min", completed: false },
                { day: "Day 11", type: "Mobility", focus: "Flexibility", duration: "40 min", completed: false },
                { day: "Day 12", type: "Strength", focus: "Arms & Shoulders", duration: "65 min", completed: false },
                { day: "Day 13", type: "Cardio", focus: "Endurance", duration: "60 min", completed: false },
                { day: "Day 14", type: "Rest", focus: "Recovery", duration: "0 min", completed: false },
            ]
        },
        {
            week: 3,
            theme: "Intensity Peak",
            focus: "Strength Max",
            intensity: "High",
            workouts: [
                { day: "Day 15", type: "Strength", focus: "Push Day", duration: "80 min", completed: false },
                { day: "Day 16", type: "Cardio", focus: "Sprints", duration: "45 min", completed: false },
                { day: "Day 17", type: "Strength", focus: "Pull Day", duration: "80 min", completed: false },
                { day: "Day 18", type: "Active Recovery", focus: "Pilates", duration: "35 min", completed: false },
                { day: "Day 19", type: "Strength", focus: "Legs", duration: "85 min", completed: false },
                { day: "Day 20", type: "Cardio", focus: "Circuit", duration: "55 min", completed: false },
                { day: "Day 21", type: "Rest", focus: "Recovery", duration: "0 min", completed: false },
            ]
        }
    ],
    stats: {
        totalWorkouts: 84,
        completed: 42,
        caloriesBurned: 12500,
        avgDuration: "55 min"
    }
};

export const mealPlanData = {
    title: "Lean Muscle Meal Plan",
    subtitle: "10-Day High Protein Nutrition Program",
    duration: 10,
    level: "Intermediate",
    description: "Optimized for muscle growth and fat loss with balanced macronutrients. Perfect for your fitness journey.",
    bckImg: require('../assets/images/meals/breakfast1.jpg'),
    stats: {
        calories: 2500,
        protein: 180,
        carbs: 220,
        fat: 70,
    },
    schedule: [
        {
            day: "Day 1",
            focus: "High Protein Kickstart",
            meals: [
                { type: "Breakfast", name: "Protein Pancakes", calories: 420, time: "8:00 AM" },
                { type: "Lunch", name: "Grilled Chicken Bowl", calories: 520, time: "1:00 PM" },
                { type: "Dinner", name: "Salmon & Asparagus", calories: 480, time: "7:00 PM" },
                { type: "Snack", name: "Greek Yogurt & Nuts", calories: 220, time: "4:00 PM" },
            ],
        },
        {
            day: "Day 2",
            focus: "Carb Cycling",
            meals: [
                { type: "Breakfast", name: "Avocado Toast & Eggs", calories: 380, time: "8:00 AM" },
                { type: "Lunch", name: "Turkey & Quinoa Salad", calories: 450, time: "1:00 PM" },
                { type: "Dinner", name: "Lean Beef Stir Fry", calories: 520, time: "7:00 PM" },
                { type: "Snack", name: "Protein Shake", calories: 180, time: "4:00 PM" },
            ],
        },
        {
            day: "Day 3",
            focus: "High Energy Day",
            meals: [
                { type: "Breakfast", name: "Oatmeal & Berries", calories: 350, time: "8:00 AM" },
                { type: "Lunch", name: "Tuna Salad Wrap", calories: 400, time: "1:00 PM" },
                { type: "Dinner", name: "Chicken & Sweet Potato", calories: 460, time: "7:00 PM" },
                { type: "Snack", name: "Rice Cakes & Almond Butter", calories: 240, time: "4:00 PM" },
            ],
        },
        {
            day: "Day 4",
            focus: "Lean Protein Focus",
            meals: [
                { type: "Breakfast", name: "Egg White Scramble", calories: 320, time: "8:00 AM" },
                { type: "Lunch", name: "Shrimp & Veggie Bowl", calories: 380, time: "1:00 PM" },
                { type: "Dinner", name: "Turkey Meatballs", calories: 420, time: "7:00 PM" },
                { type: "Snack", name: "Cottage Cheese", calories: 160, time: "4:00 PM" },
            ],
        },
        {
            day: "Day 5",
            focus: "Recovery Day",
            meals: [
                { type: "Breakfast", name: "Smoothie Bowl", calories: 360, time: "8:00 AM" },
                { type: "Lunch", name: "Chicken Caesar Salad", calories: 420, time: "1:00 PM" },
                { type: "Dinner", name: "Baked Cod & Veggies", calories: 400, time: "7:00 PM" },
                { type: "Snack", name: "Protein Bar", calories: 200, time: "4:00 PM" },
            ],
        },
    ],
};

export const mainSchedules =
[
   {
        title: 'Basic Schedule',
        frequency: 'day after day',
        workoutsCount:10,
        workouts: [
            {
                day: 1,
                schedule:
                    [{ id: 1, name: "Leg Extension", reps: [10, 8, 6] },
                    { id: 2, name: "Barbell Shoulder Press", reps: [10, 8, 6] },
                    { id: 3, name: "Dumbbell Side Lateral", reps: [10, 8, 6] },
                    { id: 4, name: "Bent-Over Side Lateral", reps: ["10-12", "10-12", "10-12"] },
                    { id: 5, name: "Flat Bench Press", reps: [10, 8, 6] },
                    { id: 6, name: "Straight-Arm Pullover", reps: [12, 12, 12] },
                    { id: 7, name: "Lat Pulldown", reps: [12, 10, 8] },
                    { id: 8, name: "Barbell Curl", reps: [10, 8, 6] },
                    { id: 9, name: "Triceps Extension", reps: [10, 8, 6] },
                    { id: 10, name: "Forearm Exercise", reps: [15, 15, 15] }]
            }

        ],
        duration: 3,
        focus: ["Balanced full-body workout with emphasis on chest", "Shoulders", "Arms", "Basic strength"]
    },

   {
        title: '2nd Schedule',
        frequency: 'day after day',
        workoutsCount:11,
        workouts: [
            {
                day: 1,
                schedule: [{ id: 1, name: "Low Back Extension", reps: [10, 8, 6] },
                { id: 2, name: "Lat Pulldown", reps: [12, 10, 8] },
                { id: 3, name: "Barbell Pullover", reps: [12, 12, 12] },
                { id: 4, name: "Dumbbell Shoulder Press", reps: [12, 10, 8] },
                { id: 5, name: "Cable Side Lateral", reps: ["12-15", "12-15", "12-15"] },
                { id: 6, name: "Rear Bent-Over Side Lateral", reps: ["12-15", "12-15", "12-15"] },
                { id: 7, name: "Flat Bench Press", reps: [12, 10, 8] },
                { id: 8, name: "Super 7 Curl", reps: ["21", "21", "21", "21"] },
                { id: 9, name: "Overhead Cable Triceps Extension", reps: [12, 10, 8, 6] },
                { id: 10, name: "Goblet Squat", reps: [10, 8, 6] },
                { id: 11, name: "Dumbbell Wrist Twist (Forearm)", reps: [15, 15, 15] }]
            }
        ]
        ,
        duration: 3,
        focus: ["Upper-body dominant routine targeting back", "Shoulders", "Arms", "Legs and forearms"]
    },

     {
        title: '3rd Schedule',
        frequency: '2 Days',
        workoutsCount:20,
        workouts: [
            {
                day: 1,
                schedule: [{ id: 1, name: "Standing Shoulder Press", reps: [12, 10, 8, 6] },
                { id: 2, name: "One-Arm Dumbbell Side Lateral Raise", reps: ["10-12", "10-12", "10-12", "10-12"] },
                { id: 3, name: "Incline Dumbbell Press", reps: [12, 10, 8, 6] },
                { id: 4, name: "Incline Dumbbell Flyes", reps: ["10-12", "10-12", "10-12", "10-12"] },
                { id: 5, name: "Flat Dumbbell Press", reps: [12, 10, 8, 6] },
                { id: 6, name: "Overhead Cable Triceps Extension", reps: [12, 10, 8, 6] },
                { id: 7, name: "Skull Crusher", reps: [12, 10, 8, 6] },
                { id: 8, name: "Weighted Triceps Dips", reps: ["10-12", "10-12", "10-12", "10-12"] },
                { id: 9, name: "Full Squat", reps: [10, 8, 6, 6] },
                { id: 10, name: "Dumbbell Lunges", reps: [10, 9, 8, 7] }]
            },
            {
                day: 2,
                schedule: [{ id: 1, name: "Wide-Grip Upright Row", reps: ["10-12", "10-12", "10-12", "10-12"] },
                { id: 2, name: "Bent-Over Side Lateral (Chest Supported)", reps: ["12-15", "12-15", "12-15", "12-15"] },
                { id: 3, name: "Pull-Up", reps: [10, 10,10,10] },
                { id: 4, name: "One-Arm Dumbbell Row", reps: [12, 10, 8, 6] },
                { id: 5, name: "Wide-Grip T-Bar Row", reps: [12, 10, 8, 6] },
                { id: 6, name: "Wall Curl (Biceps)", reps: [12, 10, 8, 6] },
                { id: 7, name: "Preacher Curl", reps: [10, 8, 6, 6] },
                { id: 8, name: "Hammer Curl", reps: ["8-10", "8-10", "8-10", "8-10"] },
                { id: 9, name: "Deadlift", reps: [10, 8, 6, 4] },
                { id: 10, name: "Leg Curl", reps: [8, 4] }]
            }
        ],
        duration:3,
        focus:["Shoulders","Chest","Triceps","Compound leg work","Back", "Biceps", "Forearms", "Posterior chain"]

    }

];

export default challenges
