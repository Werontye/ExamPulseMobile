export interface SpeakingQuestion {
  id: number;
  part: 'Part 1' | 'Part 2' | 'Part 3';
  topic: string;
  question: string;
  prepTime: number; // seconds
  tips?: string[];
}

export const speakingQuestions: SpeakingQuestion[] = [
  // ── Part 1 (Personal, 30s prep) ───────────────────────────────────────────
  {
    id: 1, part: 'Part 1', topic: 'Hometown', prepTime: 30,
    question: 'Describe your hometown. What do you like most about it?',
    tips: ['Mention location', 'Give 2-3 features', 'Use present tense'],
  },
  {
    id: 2, part: 'Part 1', topic: 'Studies', prepTime: 30,
    question: 'Do you prefer studying alone or with others? Why?',
    tips: ['State preference clearly', 'Give reasons', 'Use comparative language'],
  },
  {
    id: 3, part: 'Part 1', topic: 'Music', prepTime: 30,
    question: 'What kind of music do you enjoy? How often do you listen to it?',
    tips: ['Name a genre', 'Explain why you like it', 'Mention frequency'],
  },
  {
    id: 4, part: 'Part 1', topic: 'Technology', prepTime: 30,
    question: 'How important is technology in your daily life?',
    tips: ['Give specific examples', 'Use adverbs of frequency', 'Mention both pros and cons'],
  },
  {
    id: 5, part: 'Part 1', topic: 'Food', prepTime: 30,
    question: 'Do you enjoy cooking? What is your favourite dish to prepare?',
    tips: ['Be specific about the dish', 'Describe preparation briefly', 'Show enthusiasm'],
  },
  {
    id: 6, part: 'Part 1', topic: 'Travel', prepTime: 30,
    question: 'Do you like travelling? Where have you visited recently?',
    tips: ['Name a specific place', 'Use past tense for visits', 'Say what you enjoyed'],
  },
  {
    id: 7, part: 'Part 1', topic: 'Sports', prepTime: 30,
    question: 'Do you play any sports? Which ones do you enjoy watching?',
    tips: ['Distinguish playing vs watching', 'Use present simple', 'Give reasons'],
  },
  {
    id: 8, part: 'Part 1', topic: 'Reading', prepTime: 30,
    question: 'Do you enjoy reading? What types of books do you prefer?',
    tips: ['Name a genre or book', 'Explain why you enjoy it', 'Mention how often'],
  },
  {
    id: 9, part: 'Part 1', topic: 'Friends', prepTime: 30,
    question: 'How do you usually spend time with your friends?',
    tips: ['Describe typical activities', 'Use frequency adverbs', 'Sound natural'],
  },
  {
    id: 10, part: 'Part 1', topic: 'Weather', prepTime: 30,
    question: 'What kind of weather do you prefer? How does weather affect your mood?',
    tips: ['Name a season or weather type', 'Link weather to feelings', 'Use conditional language'],
  },
  {
    id: 11, part: 'Part 1', topic: 'Weekends', prepTime: 30,
    question: 'What do you usually do on weekends? Is this different from your weekdays?',
    tips: ['Contrast weekend/weekday routines', 'Use present simple', 'Sound relaxed'],
  },
  {
    id: 12, part: 'Part 1', topic: 'Shopping', prepTime: 30,
    question: 'Do you prefer shopping online or in-store? Has this changed recently?',
    tips: ['Give clear preference', 'Mention convenience or experience', 'Use present perfect for change'],
  },
  {
    id: 13, part: 'Part 1', topic: 'Social Media', prepTime: 30,
    question: 'How much time do you spend on social media each day? Do you think it is too much?',
    tips: ['Give honest estimate', 'Reflect on habit', 'Use hedging language like "I think" or "perhaps"'],
  },

  // ── Part 2 (Cue cards, 60s prep) ─────────────────────────────────────────
  {
    id: 14, part: 'Part 2', topic: 'Place', prepTime: 60,
    question: 'Describe a place you would like to visit.\nYou should say:\n• where it is\n• why you want to go there\n• what you would do there\nand explain why it interests you.',
    tips: ['Speak for 1-2 minutes', 'Cover all bullet points', 'Use future/conditional tense', 'Add vivid details'],
  },
  {
    id: 15, part: 'Part 2', topic: 'Person', prepTime: 60,
    question: 'Describe a person who has greatly influenced your life.\nYou should say:\n• who this person is\n• how you know them\n• what qualities they have\nand explain how they influenced you.',
    tips: ['Name a real person', 'Describe their character vividly', 'Use past and present tense', 'Show personal reflection'],
  },
  {
    id: 16, part: 'Part 2', topic: 'Childhood Event', prepTime: 60,
    question: 'Describe a memorable event from your childhood.\nYou should say:\n• what the event was\n• when and where it happened\n• who was involved\nand explain why it was memorable.',
    tips: ['Use past simple and past continuous', 'Include emotions', 'Be specific about details'],
  },
  {
    id: 17, part: 'Part 2', topic: 'Object', prepTime: 60,
    question: 'Describe a valuable object you own.\nYou should say:\n• what it is\n• how long you have had it\n• why it is valuable to you\nand explain why you would like to keep it.',
    tips: ['Describe the object physically', 'Explain sentimental or monetary value', 'Use present perfect for duration'],
  },
  {
    id: 18, part: 'Part 2', topic: 'Book', prepTime: 60,
    question: 'Describe a book you have read that made an impression on you.\nYou should say:\n• what the book is about\n• when you read it\n• what you liked about it\nand explain why it was impressive.',
    tips: ['Summarise plot briefly', 'Focus on your reaction', 'Use reporting verbs: "the author argues/shows"'],
  },
  {
    id: 19, part: 'Part 2', topic: 'Achievement', prepTime: 60,
    question: 'Describe a personal achievement you are proud of.\nYou should say:\n• what you achieved\n• how long it took\n• what difficulties you faced\nand explain why you are proud of it.',
    tips: ['Choose a specific achievement', 'Describe challenges', 'Express genuine pride'],
  },
  {
    id: 20, part: 'Part 2', topic: 'Technology', prepTime: 60,
    question: 'Describe a piece of technology you find useful.\nYou should say:\n• what it is\n• how often you use it\n• what you use it for\nand explain why you find it useful.',
    tips: ['Be specific (not just "my phone")', 'Describe features', 'Link to daily life'],
  },
  {
    id: 21, part: 'Part 2', topic: 'Tradition', prepTime: 60,
    question: 'Describe a tradition from your country or culture.\nYou should say:\n• what the tradition is\n• when it takes place\n• how people celebrate it\nand explain why it is important.',
    tips: ['Describe rituals and customs', 'Use present simple for habitual actions', 'Show cultural pride'],
  },

  // ── Part 3 (Abstract, 30s prep) ───────────────────────────────────────────
  {
    id: 22, part: 'Part 3', topic: 'Education', prepTime: 30,
    question: 'Do you think formal education will always be necessary in the future? Why or why not?',
    tips: ['Give balanced view', 'Use hedging: "it could be argued"', 'Mention technology\'s role', 'Conclude with your view'],
  },
  {
    id: 23, part: 'Part 3', topic: 'Technology', prepTime: 30,
    question: 'How has technology changed the way people communicate compared to 20 years ago?',
    tips: ['Use comparative structures', 'Give specific examples (social media, video calls)', 'Discuss both positive and negative changes'],
  },
  {
    id: 24, part: 'Part 3', topic: 'Environment', prepTime: 30,
    question: 'What do you think are the most serious environmental problems facing the world today?',
    tips: ['Prioritise 2-3 issues', 'Use superlatives', 'Support with facts or examples', 'Suggest solutions'],
  },
  {
    id: 25, part: 'Part 3', topic: 'Globalisation', prepTime: 30,
    question: 'What are the advantages and disadvantages of globalisation for developing countries?',
    tips: ['Structure: advantages → disadvantages', 'Use discourse markers', 'Show nuanced thinking', 'Conclude with balance'],
  },
  {
    id: 26, part: 'Part 3', topic: 'Work', prepTime: 30,
    question: 'Do you think working from home will become more common in the future? What are the implications?',
    tips: ['Make a prediction', 'Discuss both employer and employee perspectives', 'Use conditionals'],
  },
  {
    id: 27, part: 'Part 3', topic: 'Health', prepTime: 30,
    question: 'Why do many people in modern society struggle to maintain a healthy lifestyle?',
    tips: ['Identify causes (stress, time, cost)', 'Use causal language: "due to", "as a result"', 'Avoid oversimplification'],
  },
  {
    id: 28, part: 'Part 3', topic: 'Social Media', prepTime: 30,
    question: 'What impact does social media have on the way young people see themselves and others?',
    tips: ['Discuss identity and self-image', 'Mention comparison culture', 'Use academic vocabulary'],
  },
  {
    id: 29, part: 'Part 3', topic: 'Cities', prepTime: 30,
    question: 'What are the main problems that people living in big cities face today?',
    tips: ['Cover multiple issues (pollution, cost, overcrowding)', 'Use firstly/moreover/finally', 'Speak confidently'],
  },
  {
    id: 30, part: 'Part 3', topic: 'Government', prepTime: 30,
    question: 'To what extent should governments control what people eat and drink?',
    tips: ['Acknowledge both sides', 'Use modal verbs for obligation/permission', 'Give a clear personal stance'],
  },
  {
    id: 31, part: 'Part 3', topic: 'Arts', prepTime: 30,
    question: 'Do you think governments should spend money on arts and culture? Why or why not?',
    tips: ['Mention economic and social benefits', 'Counter the argument (healthcare priority)', 'Use reported speech for opposing views'],
  },
  {
    id: 32, part: 'Part 3', topic: 'Transport', prepTime: 30,
    question: 'How might transportation change in the next 50 years? What are the potential benefits and risks?',
    tips: ['Speculate using "might", "could", "is likely to"', 'Mention autonomous vehicles or hyperloop', 'Balance optimism with caution'],
  },
];

export const part1Questions = speakingQuestions.filter(q => q.part === 'Part 1');
export const part2Questions = speakingQuestions.filter(q => q.part === 'Part 2');
export const part3Questions = speakingQuestions.filter(q => q.part === 'Part 3');
