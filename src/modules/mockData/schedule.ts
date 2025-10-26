export type Course = {
  code: string;
  description: string;
};

export type Term = {
  id: string;
  name: string;
  courses: Course[];
};

export const mockRequirements = {
  major: [
    { code: "ABC 123" },
    { code: "DEF 234" },
    { code: "GHI 345" },
    { code: "JKL 456" },
    { code: "MNO 567" },
    { code: "PQR 678" },
  ],
  minor: [{ code: "MIN 101" }, { code: "MIN 102" }],
  specialization: [{ code: "SPE 201" }, { code: "SPE 202" }],
};

export const terms: Term[] = [
  {
    id: "term1A",
    name: "Term 1A",
    courses: [
      { code: "MATH 135", description: "Algebra for Honours Math" },
      { code: "CS 135", description: "Designing Functional Programs" },
      { code: "COMM 101", description: "Intro to Business" },
      { code: "ENGL 109", description: "Intro to Academic Writing" },
    ],
  },
  {
    id: "term1B",
    name: "Term 1B",
    courses: [
      { code: "CS 136", description: "Elementary Algorithm Design" },
      { code: "MATH 136", description: "Linear Algebra" },
      { code: "ECON 101", description: "Intro to Microeconomics" },
      { code: "SPCOM 100", description: "Communication in Context" },
    ],
  },
  {
    id: "term2A",
    name: "Term 2A",
    courses: [
      { code: "STAT 230", description: "Probability" },
      { code: "CS 245", description: "Logic and Computation" },
      { code: "CS 240", description: "Data Structures and Algorithms" },
    ],
  },
  {
    id: "term2B",
    name: "Term 2B",
    courses: [
      { code: "STAT 230", description: "Probability" },
      { code: "CS 245", description: "Logic and Computation" },
      { code: "CS 240", description: "Data Structures and Algorithms" },
    ],
  },
  {
    id: "term3A",
    name: "Term 3A",
    courses: [
      { code: "STAT 230", description: "Probability" },
      { code: "CS 245", description: "Logic and Computation" },
      { code: "CS 240", description: "Data Structures and Algorithms" },
    ],
  },
  {
    id: "term3B",
    name: "Term 3B",
    courses: [
      { code: "STAT 230", description: "Probability" },
      { code: "CS 245", description: "Logic and Computation" },
      { code: "CS 240", description: "Data Structures and Algorithms" },
    ],
  },
  {
    id: "term4A",
    name: "Term 4A",
    courses: [
      { code: "STAT 230", description: "Probability" },
      { code: "CS 245", description: "Logic and Computation" },
      { code: "CS 240", description: "Data Structures and Algorithms" },
    ],
  },
  {
    id: "term4B",
    name: "Term 4B",
    courses: [
      { code: "STAT 230", description: "Probability" },
      { code: "CS 245", description: "Logic and Computation" },
      { code: "CS 240", description: "Data Structures and Algorithms" },
    ],
  },
];

export const mockCourses = [
  { label: "CS 134 - Introduction to Computer Science", value: "cs134" },
  { label: "CS 210 - Data Structures and Algorithms", value: "cs210" },
  { label: "CS 220 - Computer Architecture", value: "cs220" },
  { label: "CS 240 - Operating Systems", value: "cs240" },
  { label: "CS 250 - Software Engineering Principles", value: "cs250" },
  { label: "CS 310 - Database Systems", value: "cs310" },
  { label: "CS 320 - Artificial Intelligence", value: "cs320" },
  { label: "CS 330 - Web Development", value: "cs330" },
  { label: "CS 340 - Networks and Security", value: "cs340" },
  { label: "CS 350 - Mobile App Development", value: "cs350" },
  { label: "CS 360 - Machine Learning", value: "cs360" },
  { label: "CS 370 - Compiler Design", value: "cs370" },
  { label: "CS 380 - Computer Graphics", value: "cs380" },
  { label: "CS 390 - Game Development", value: "cs390" },
  { label: "CS 400 - Capstone Project", value: "cs400" },
];
