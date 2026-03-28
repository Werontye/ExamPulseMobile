export interface IELTSQuestion {
  id: string;
  module: 'listening' | 'reading' | 'writing' | 'speaking';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: { A: string; B: string; C: string; D: string };
  answer: string;
  explanation: string;
  topic: string;
}

export const ieltsQuestions: IELTSQuestion[] = [
  // ── LISTENING ────────────────────────────────────────────────────────────────
  {
    id: 'ielts-l-001',
    module: 'listening',
    difficulty: 'easy',
    topic: 'Form Completion',
    question:
      'You hear: "The booking is for Friday the 14th at half past seven." What time is the booking?',
    options: { A: '7:00', B: '7:15', C: '7:30', D: '7:45' },
    answer: 'C',
    explanation: '"Half past seven" = 7:30.',
  },
  {
    id: 'ielts-l-002',
    module: 'listening',
    difficulty: 'medium',
    topic: 'Multiple Choice',
    question:
      'In a lecture about climate, the speaker says carbon dioxide levels have risen by approximately what percentage since the Industrial Revolution?',
    options: { A: '30%', B: '47%', C: '52%', D: '60%' },
    answer: 'B',
    explanation: 'CO₂ has risen roughly 47% above pre-industrial levels (~280 ppm to ~415 ppm).',
  },
  {
    id: 'ielts-l-003',
    module: 'listening',
    difficulty: 'medium',
    topic: 'Map / Diagram',
    question:
      'The speaker describes the library: "Turn left at the reception, pass the computers, and the reference section is on your right." Where is the reference section?',
    options: {
      A: 'Next to reception',
      B: 'Past the computers, on the right',
      C: 'On the left after reception',
      D: 'Opposite the computers',
    },
    answer: 'B',
    explanation: 'Following the directions: left → past computers → reference section on right.',
  },
  {
    id: 'ielts-l-004',
    module: 'listening',
    difficulty: 'hard',
    topic: 'Note Completion',
    question:
      'A speaker discussing renewable energy says: "The main advantage over fossil fuels is not just cost, but ___." Which fits best?',
    options: {
      A: 'Availability',
      B: 'Environmental sustainability',
      C: 'Political stability',
      D: 'Transportation ease',
    },
    answer: 'B',
    explanation:
      'In IELTS listening discussions about renewables, environmental sustainability is the most commonly cited advantage beyond cost.',
  },
  {
    id: 'ielts-l-005',
    module: 'listening',
    difficulty: 'easy',
    topic: 'Number / Spelling',
    question:
      'The speaker spells a name: "S-M-I-T-H." What is the name?',
    options: { A: 'Smyth', B: 'Smith', C: 'Smitth', D: 'Smiith' },
    answer: 'B',
    explanation: 'S-M-I-T-H spells "Smith."',
  },
  {
    id: 'ielts-l-006',
    module: 'listening',
    difficulty: 'medium',
    topic: 'Short Answer',
    question:
      'In a campus tour recording, what does the speaker say students must bring to register for a library card?',
    options: {
      A: 'Passport and bank statement',
      B: 'Student ID and proof of enrollment',
      C: 'Driving license and utility bill',
      D: 'Letter of acceptance',
    },
    answer: 'B',
    explanation:
      'Library registration typically requires proof of student status: student ID and enrollment proof.',
  },
  {
    id: 'ielts-l-007',
    module: 'listening',
    difficulty: 'hard',
    topic: 'Sentence Completion',
    question:
      'Complete the sentence from the lecture: "Urban migration has led to increased demand for ___ services in cities."',
    options: { A: 'agricultural', B: 'municipal', C: 'international', D: 'industrial' },
    answer: 'B',
    explanation: 'Urban migration creates demand for municipal (city) services: transport, housing, utilities.',
  },
  {
    id: 'ielts-l-008',
    module: 'listening',
    difficulty: 'medium',
    topic: 'Matching',
    question:
      'A speaker describes three tourist attractions. The speaker says the art museum is "free on weekends but charges on weekdays." Which best matches?',
    options: {
      A: 'Free all week',
      B: 'Paid all week',
      C: 'Free on weekends, paid on weekdays',
      D: 'Free on weekdays, paid on weekends',
    },
    answer: 'C',
    explanation: 'Directly stated: free on weekends, charges on weekdays.',
  },

  // ── READING ──────────────────────────────────────────────────────────────────
  {
    id: 'ielts-r-001',
    module: 'reading',
    difficulty: 'medium',
    topic: 'Heading Matching',
    question:
      'A paragraph reads: "Despite advances in medicine, malnutrition remains the leading cause of child mortality in low-income countries." The best heading is:',
    options: {
      A: 'Medical breakthroughs save children',
      B: 'Malnutrition: A persistent threat in poor nations',
      C: 'The history of child mortality',
      D: 'Why low-income countries lack doctors',
    },
    answer: 'B',
    explanation:
      'The paragraph focuses on malnutrition as a persistent problem despite medical progress.',
  },
  {
    id: 'ielts-r-002',
    module: 'reading',
    difficulty: 'easy',
    topic: 'True / False / Not Given',
    question:
      'Statement: "All species of sea turtles are endangered." The passage says: "Seven species of sea turtles exist, and six are classified as vulnerable, endangered, or critically endangered." The statement is:',
    options: { A: 'True', B: 'False', C: 'Not Given', D: 'Cannot Say' },
    answer: 'B',
    explanation:
      'The passage says 6 out of 7 are threatened — not all seven. The statement is FALSE.',
  },
  {
    id: 'ielts-r-003',
    module: 'reading',
    difficulty: 'hard',
    topic: 'Summary Completion',
    question:
      'Complete the summary: "The Industrial Revolution began in Britain because of its ___."',
    options: {
      A: 'Large population and tropical climate',
      B: 'Abundant coal reserves and colonial trade networks',
      C: 'Democratic government and free education',
      D: 'Advanced naval technology',
    },
    answer: 'B',
    explanation:
      'Historians consistently point to coal resources and trade networks as key factors for Britain\'s industrialization.',
  },
  {
    id: 'ielts-r-004',
    module: 'reading',
    difficulty: 'medium',
    topic: 'Matching Information',
    question:
      'The passage mentions that researcher A focused on genetics while researcher B focused on environment. Which researcher\'s findings best support the nature vs. nurture debate?',
    options: {
      A: 'Researcher A only',
      B: 'Researcher B only',
      C: 'Both researchers together',
      D: 'Neither researcher',
    },
    answer: 'C',
    explanation:
      'The nature vs. nurture debate requires both sides — both researchers together provide a complete picture.',
  },
  {
    id: 'ielts-r-005',
    module: 'reading',
    difficulty: 'hard',
    topic: 'Yes / No / Not Given',
    question:
      'The author claims: "Remote work increases productivity." The passage states studies show "mixed results." The claim is:',
    options: { A: 'Yes', B: 'No', C: 'Not Given', D: 'True' },
    answer: 'B',
    explanation:
      '"Mixed results" contradicts an unqualified claim that productivity increases. Answer is NO.',
  },
  {
    id: 'ielts-r-006',
    module: 'reading',
    difficulty: 'medium',
    topic: 'Vocabulary',
    question:
      'In IELTS Academic Reading, "ubiquitous" most nearly means:',
    options: { A: 'Rare', B: 'Present everywhere', C: 'Expensive', D: 'Temporary' },
    answer: 'B',
    explanation: '"Ubiquitous" = present, appearing, or found everywhere.',
  },
  {
    id: 'ielts-r-007',
    module: 'reading',
    difficulty: 'easy',
    topic: 'Multiple Choice',
    question:
      'The passage about the Amazon rainforest states it covers approximately how much of Earth\'s land surface?',
    options: { A: '1%', B: '3%', C: '5%', D: '10%' },
    answer: 'C',
    explanation: 'The Amazon covers about 5.5 million km², roughly 3–5% of Earth\'s land.',
  },
  {
    id: 'ielts-r-008',
    module: 'reading',
    difficulty: 'hard',
    topic: 'Writer\'s Views',
    question:
      'The writer\'s attitude toward genetic modification of crops can best be described as:',
    options: {
      A: 'Strongly in favour',
      B: 'Strongly against',
      C: 'Balanced, acknowledging both benefits and risks',
      D: 'Indifferent',
    },
    answer: 'C',
    explanation:
      'Academic IELTS texts typically present balanced perspectives, especially on controversial topics like GMOs.',
  },
  {
    id: 'ielts-r-009',
    module: 'reading',
    difficulty: 'medium',
    topic: 'List Selection',
    question:
      'Which THREE factors does the passage cite as contributing to obesity? (Choose 3 from: Diet, Genetics, Pollution, Sedentary lifestyle, Weather, Stress)',
    options: {
      A: 'Diet, Genetics, Sedentary lifestyle',
      B: 'Diet, Pollution, Weather',
      C: 'Genetics, Stress, Weather',
      D: 'Pollution, Sedentary lifestyle, Stress',
    },
    answer: 'A',
    explanation:
      'Diet, genetics, and sedentary lifestyle are the three most widely documented contributors to obesity in health literature.',
  },
  {
    id: 'ielts-r-010',
    module: 'reading',
    difficulty: 'easy',
    topic: 'True / False / Not Given',
    question:
      'Statement: "Shakespeare was born in London." The passage does not mention his birthplace. The statement is:',
    options: { A: 'True', B: 'False', C: 'Not Given', D: 'Incorrect' },
    answer: 'C',
    explanation:
      'When the passage gives no information about a claim, the answer is NOT GIVEN. (Shakespeare was born in Stratford-upon-Avon, but if the passage doesn\'t say, it\'s NG.)',
  },

  // ── WRITING ──────────────────────────────────────────────────────────────────
  {
    id: 'ielts-wr-001',
    module: 'writing',
    difficulty: 'medium',
    topic: 'Task 2 — Opinion Essay',
    question:
      'Some people believe universities should only offer practical subjects. To what extent do you agree or disagree?',
    options: {
      A: 'Agree — practical skills guarantee employment.',
      B: 'Disagree — theoretical knowledge builds critical thinking.',
      C: 'Balanced — both practical and theoretical subjects are valuable.',
      D: 'Disagree — universities should focus on research only.',
    },
    answer: 'C',
    explanation:
      'IELTS Band 7+ essays typically acknowledge both sides. A balanced view demonstrates sophisticated reasoning.',
  },
  {
    id: 'ielts-wr-002',
    module: 'writing',
    difficulty: 'medium',
    topic: 'Task 1 — Graph Description',
    question:
      'A line graph shows CO₂ emissions rising from 1990 to 2020. The best opening sentence is:',
    options: {
      A: 'The graph is about CO₂.',
      B: 'The line graph illustrates changes in CO₂ emissions over a 30-year period from 1990 to 2020.',
      C: 'CO₂ emissions went up.',
      D: 'As can be seen, the graph shows emissions.',
    },
    answer: 'B',
    explanation:
      'A Task 1 introduction should paraphrase the title, mention the type of graph and time period — without copying the title word-for-word.',
  },
  {
    id: 'ielts-wr-003',
    module: 'writing',
    difficulty: 'hard',
    topic: 'Coherence & Cohesion',
    question:
      'Which transition best signals an addition of a supporting point in Task 2?',
    options: {
      A: 'However',
      B: 'In contrast',
      C: 'Furthermore',
      D: 'Nevertheless',
    },
    answer: 'C',
    explanation:
      '"Furthermore" adds an additional point. "However" and "nevertheless" signal contrast.',
  },
  {
    id: 'ielts-wr-004',
    module: 'writing',
    difficulty: 'medium',
    topic: 'Lexical Resource',
    question:
      'Instead of repeating "important," which word shows the most lexical variety in an IELTS essay?',
    options: { A: 'Very important', B: 'Significant', C: 'Quite important', D: 'Really important' },
    answer: 'B',
    explanation:
      'Synonyms like "significant," "crucial," "vital," and "paramount" demonstrate lexical variety. "Very important" just adds an intensifier.',
  },
  {
    id: 'ielts-wr-005',
    module: 'writing',
    difficulty: 'hard',
    topic: 'Task 2 — Discussion Essay',
    question:
      'In a "Discuss both views and give your opinion" essay, where should your opinion ideally appear?',
    options: {
      A: 'Only in the introduction',
      B: 'Only in the conclusion',
      C: 'In the introduction and reinforced in the conclusion',
      D: 'It should not appear — remain neutral',
    },
    answer: 'C',
    explanation:
      'For Band 7+, clearly state your opinion in the introduction thesis and reinforce it in the conclusion.',
  },
  {
    id: 'ielts-wr-006',
    module: 'writing',
    difficulty: 'easy',
    topic: 'Task 1 — Word Count',
    question: 'What is the minimum word count required for IELTS Academic Task 1?',
    options: { A: '100', B: '120', C: '150', D: '200' },
    answer: 'C',
    explanation: 'IELTS Task 1 requires a minimum of 150 words.',
  },
  {
    id: 'ielts-wr-007',
    module: 'writing',
    difficulty: 'medium',
    topic: 'Task 2 — Argument Structure',
    question:
      'What is the recommended paragraph structure for each body paragraph in a Task 2 essay?',
    options: {
      A: 'Topic sentence → Example → Explanation',
      B: 'Example → Topic sentence → Conclusion',
      C: 'Topic sentence → Explanation → Example → Link',
      D: 'Statistics → Topic sentence → Restatement',
    },
    answer: 'C',
    explanation:
      'PEEL (Point → Explain → Example → Link) or TEEL structure produces the clearest IELTS body paragraphs.',
  },

  // ── SPEAKING ─────────────────────────────────────────────────────────────────
  {
    id: 'ielts-sp-001',
    module: 'speaking',
    difficulty: 'easy',
    topic: 'Part 1 — Personal Questions',
    question: 'Do you prefer watching films at home or in the cinema? Why?',
    options: {
      A: 'Focus on one option only',
      B: 'Give a preference with 2–3 reasons',
      C: 'Say you have no preference',
      D: 'Give a very short one-word answer',
    },
    answer: 'B',
    explanation:
      'Part 1 answers should be 2–4 sentences with a clear preference and reasons. Avoid one-word answers.',
  },
  {
    id: 'ielts-sp-002',
    module: 'speaking',
    difficulty: 'medium',
    topic: 'Part 2 — Cue Card',
    question:
      'Cue card: Describe a memorable journey. Which structure scores highest?',
    options: {
      A: 'One sentence about where you went',
      B: 'Random facts without structure',
      C: 'Where/when/who with, what happened, why memorable — using past tenses',
      D: 'Future plans for a journey',
    },
    answer: 'C',
    explanation:
      'Part 2 requires ~2 minutes of structured speaking covering all bullet points on the cue card using appropriate tenses.',
  },
  {
    id: 'ielts-sp-003',
    module: 'speaking',
    difficulty: 'hard',
    topic: 'Part 3 — Abstract Discussion',
    question:
      'Part 3 question: "How has social media changed the way people communicate?" Which answer style scores Band 7+?',
    options: {
      A: '"Social media is good and bad."',
      B: '"People use phones more now."',
      C:
        '"Social media has fundamentally transformed communication by enabling instant global connectivity; however, critics argue it has diminished the depth of interpersonal relationships."',
      D: '"I think social media is important for business."',
    },
    answer: 'C',
    explanation:
      'Band 7+ requires complex sentences, specific vocabulary, and a nuanced view with contrasting ideas.',
  },
  {
    id: 'ielts-sp-004',
    module: 'speaking',
    difficulty: 'medium',
    topic: 'Fluency Strategies',
    question:
      'If you need a moment to think in Part 3, which is the best strategy?',
    options: {
      A: 'Stay silent for several seconds',
      B: 'Say "um" repeatedly',
      C: 'Use a natural filler: "That\'s an interesting question. Let me think about that..."',
      D: 'Ask the examiner to repeat the question',
    },
    answer: 'C',
    explanation:
      'Natural discourse markers like "That\'s a good question" or "Let me think..." give you thinking time without hurting fluency scores.',
  },
  {
    id: 'ielts-sp-005',
    module: 'speaking',
    difficulty: 'easy',
    topic: 'Band Descriptors',
    question: 'Which factor is NOT one of the four IELTS Speaking band descriptors?',
    options: {
      A: 'Fluency and Coherence',
      B: 'Lexical Resource',
      C: 'Reading Comprehension',
      D: 'Grammatical Range and Accuracy',
    },
    answer: 'C',
    explanation:
      'The four IELTS Speaking criteria are: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation.',
  },
];

export const ieltsListeningQuestions = ieltsQuestions.filter(q => q.module === 'listening');
export const ieltsReadingQuestions = ieltsQuestions.filter(q => q.module === 'reading');
export const ieltsWritingQuestions = ieltsQuestions.filter(q => q.module === 'writing');
export const ieltsSpeakingQuestions = ieltsQuestions.filter(q => q.module === 'speaking');
