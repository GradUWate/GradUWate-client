export type Course = {
  id: string;
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
    { id: "req-major-1", code: "ABC 123", description: "Lorem Ipsum" },
    { id: "req-major-2", code: "DEF 234", description: "Lorem Ipsum" },
    { id: "req-major-3", code: "GHI 345", description: "Lorem Ipsum" },
    { id: "req-major-4", code: "JKL 456", description: "Lorem Ipsum" },
    { id: "req-major-5", code: "MNO 567", description: "Lorem Ipsum" },
    { id: "req-major-6", code: "PQR 678", description: "Lorem Ipsum" },
  ],
  minor: [
    { id: "req-minor-1", code: "MIN 101", description: "Lorem Ipsum" },
    { id: "req-minor-2", code: "MIN 102", description: "Lorem Ipsum" },
  ],
  specialization: [
    { id: "req-spec-1", code: "SPE 201", description: "Lorem Ipsum" },
    { id: "req-spec-2", code: "SPE 202", description: "Lorem Ipsum" },
  ],
};

export const mockTerms: Term[] = [
  {
    id: "term1A",
    name: "Term 1A",
    courses: [
      {
        id: "term1A-1",
        code: "MATH 135",
        description: "Algebra for Honours Mathematics",
      },
      {
        id: "term1A-2",
        code: "CS 135",
        description: "Designing Functional Programs",
      },
      {
        id: "term1A-3",
        code: "COMM 101",
        description: "Introduction to Business",
      },
      {
        id: "term1A-4",
        code: "ENGL 109",
        description: "Introduction to Academic Writing",
      },
    ],
  },
  {
    id: "term1B",
    name: "Term 1B",
    courses: [
      {
        id: "term1B-1",
        code: "CS 136",
        description: "Elementary Algorithm Design and Data Abstraction",
      },
      { id: "term1B-2", code: "MATH 136", description: "Linear Algebra I" },
      {
        id: "term1B-3",
        code: "ECON 101",
        description: "Introduction to Microeconomics",
      },
      {
        id: "term1B-4",
        code: "SPCOM 100",
        description: "Communication in Context",
      },
    ],
  },
  {
    id: "term2A",
    name: "Term 2A",
    courses: [
      { id: "term2A-1", code: "STAT 230", description: "Probability" },
      {
        id: "term2A-2",
        code: "CS 240",
        description: "Data Structures and Algorithms",
      },
      { id: "term2A-3", code: "CS 245", description: "Logic and Computation" },
      { id: "term2A-4", code: "PHIL 145", description: "Critical Thinking" },
    ],
  },
  {
    id: "term2B",
    name: "Term 2B",
    courses: [
      {
        id: "term2B-1",
        code: "CS 246",
        description: "Object-Oriented Software Development",
      },
      { id: "term2B-2", code: "STAT 231", description: "Statistics" },
      {
        id: "term2B-3",
        code: "MATH 239",
        description: "Introduction to Combinatorics",
      },
      {
        id: "term2B-4",
        code: "ECON 102",
        description: "Introduction to Macroeconomics",
      },
    ],
  },
  {
    id: "term3A",
    name: "Term 3A",
    courses: [
      {
        id: "term3A-1",
        code: "CS 251",
        description: "Computer Organization and Design",
      },
      {
        id: "term3A-2",
        code: "CS 241",
        description: "Foundations of Sequential Programs",
      },
      { id: "term3A-3", code: "CS 350", description: "Operating Systems" },
      {
        id: "term3A-4",
        code: "STAT 330",
        description: "Mathematical Statistics",
      },
    ],
  },
  {
    id: "term3B",
    name: "Term 3B",
    courses: [
      { id: "term3B-1", code: "CS 341", description: "Algorithms" },
      {
        id: "term3B-2",
        code: "CS 348",
        description: "Introduction to Database Management",
      },
      { id: "term3B-3", code: "CS 349", description: "User Interfaces" },
      {
        id: "term3B-4",
        code: "MATH 239B",
        description: "Graph Theory and Applications",
      },
    ],
  },
  {
    id: "term4A",
    name: "Term 4A",
    courses: [
      { id: "term4A-1", code: "CS 444", description: "Compiler Construction" },
      { id: "term4A-2", code: "CS 454", description: "Distributed Systems" },
      {
        id: "term4A-3",
        code: "CS 490",
        description: "Information Systems Management",
      },
      {
        id: "term4A-4",
        code: "ENGL 210",
        description: "Business Communications",
      },
    ],
  },
  {
    id: "term4B",
    name: "Term 4B",
    courses: [
      {
        id: "term4B-1",
        code: "CS 499",
        description: "Capstone Design Project",
      },
      {
        id: "term4B-2",
        code: "CS 486",
        description: "Introduction to Artificial Intelligence",
      },
      {
        id: "term4B-3",
        code: "CS 489",
        description: "Neural Networks and Deep Learning",
      },
      {
        id: "term4B-4",
        code: "STAT 440",
        description: "Computational Statistics",
      },
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
