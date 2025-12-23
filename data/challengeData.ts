
interface schedule {
    day: string,
    focus: string,
    workouts: string[]
}
interface challenge {
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
        bckImg: require('../assets/images/cardsImg/card12.jpg'),
        title: "Cardio Core Crusher",
        discription:'Strengthen core and improve cardiovascular health',
        duration:10,
        level:'Intermediate',
        schedule: [
            {
                day: 'Day One',
                focus:'Bike Intervals',
                workouts: ['20-min intervals + Cable twists']
            },
             {
                day: 'Day Two',
                focus:'Core Strength',
                workouts: ['Ab crunch machine + Planks']
            },
            {
                day: 'Day Three',
                focus:'Rest',
                workouts: ['Light stretching']
            },
            {
                day: 'Day Four',
                focus:'HIIT Bike',
                workouts: ['30-min HIIT ride']
            },
             {
                day: 'Day Five',
                focus:'Core Burn',
                workouts: ['Hanging leg raises with Cable crunches'],
            },
             {
                day: 'Day Six',
                focus:'Combo Day',
                workouts: ['Bike + Core circuit'],
            },
             {
                day: 'Day Seven',
                focus:'Rest',
                workouts: ['Active recovery'],
            },
             {
                day: 'Day Eight',
                focus:'Endurance Ride',
                workouts: ['40-min steady-state bike'],
            },
             {
                day: 'Day Nine',
                focus:'Core Sculpt',
                workouts: ['Weighted crunches + Russian twists'],
            },
                  {
                day: 'Day Ten',
                focus:'Final Burn',
                workouts: ['HIIT + full core circuit'],
            },
        
        ]

    },
    {
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

export default challenges
