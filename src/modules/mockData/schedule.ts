export type Course = {
  code: string;
  description: string;
};

export type Term = {
  id: string;
  name: string;
  courses: Course[];
};

export type Requirement = {
  major: Course[];
  minor: Course[];
  specialization: Course[];
};

export const mockRequirements: Requirement = {
  major: [
    { code: "ABC 123", description: "Lorem Ipsum" },
    { code: "DEF 234", description: "Lorem Ipsum" },
    { code: "GHI 345", description: "Lorem Ipsum" },
    { code: "JKL 456", description: "Lorem Ipsum" },
    { code: "MNO 567", description: "Lorem Ipsum" },
    { code: "PQR 678", description: "Lorem Ipsum" },
  ],
  minor: [
    { code: "MIN 101", description: "Lorem Ipsum" },
    { code: "MIN 102", description: "Lorem Ipsum" },
  ],
  specialization: [
    { code: "SPE 201", description: "Lorem Ipsum" },
    { code: "SPE 202", description: "Lorem Ipsum" },
  ],
};

export const mockTerms: Term[] = [
  {
    id: "term1A",
    name: "Term 1A",
    courses: [
      { code: "MATH 135", description: "Algebra for Honours Mathematics" },
      { code: "CS 135", description: "Designing Functional Programs" },
      { code: "COMM 101", description: "Introduction to Business" },
      { code: "ENGL 109", description: "Introduction to Academic Writing" },
    ],
  },
  {
    id: "term1B",
    name: "Term 1B",
    courses: [
      {
        code: "CS 136",
        description: "Elementary Algorithm Design and Data Abstraction",
      },
      { code: "MATH 136", description: "Linear Algebra I" },
      { code: "ECON 101", description: "Introduction to Microeconomics" },
      { code: "SPCOM 100", description: "Communication in Context" },
    ],
  },
  {
    id: "term2A",
    name: "Term 2A",
    courses: [
      { code: "STAT 230", description: "Probability" },
      { code: "CS 240", description: "Data Structures and Algorithms" },
      { code: "CS 245", description: "Logic and Computation" },
      { code: "PHIL 145", description: "Critical Thinking" },
    ],
  },
  {
    id: "term2B",
    name: "Term 2B",
    courses: [
      { code: "CS 246", description: "Object-Oriented Software Development" },
      { code: "STAT 231", description: "Statistics" },
      { code: "MATH 239", description: "Introduction to Combinatorics" },
      { code: "ECON 102", description: "Introduction to Macroeconomics" },
    ],
  },
  {
    id: "term3A",
    name: "Term 3A",
    courses: [
      { code: "CS 251", description: "Computer Organization and Design" },
      { code: "CS 241", description: "Foundations of Sequential Programs" },
      { code: "CS 350", description: "Operating Systems" },
      { code: "STAT 330", description: "Mathematical Statistics" },
    ],
  },
  {
    id: "term3B",
    name: "Term 3B",
    courses: [
      { code: "CS 341", description: "Algorithms" },
      { code: "CS 348", description: "Introduction to Database Management" },
      { code: "CS 349", description: "User Interfaces" },
      { code: "MATH 239B", description: "Graph Theory and Applications" },
    ],
  },
  {
    id: "term4A",
    name: "Term 4A",
    courses: [
      { code: "CS 444", description: "Compiler Construction" },
      { code: "CS 454", description: "Distributed Systems" },
      { code: "CS 490", description: "Information Systems Management" },
      { code: "ENGL 210", description: "Business Communications" },
    ],
  },
  {
    id: "term4B",
    name: "Term 4B",
    courses: [
      { code: "CS 499", description: "Capstone Design Project" },
      {
        code: "CS 486",
        description: "Introduction to Artificial Intelligence",
      },
      { code: "CS 489", description: "Neural Networks and Deep Learning" },
      { code: "STAT 440", description: "Computational Statistics" },
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
