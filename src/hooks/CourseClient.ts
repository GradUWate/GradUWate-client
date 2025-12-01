import { get } from "./axios";

export type ReqCourse = {
  id: string;
  code: string;
  group_id?: string;
};

export const TermType = {
  F: "fall",
  W: "winter",
  S: "spring",
};
export type TermType = (typeof TermType)[keyof typeof TermType];

export type Course = {
  id: string;
  code: string;
  title: string;
  description?: string;
  level?: number;
  prereqs?: string;
  antireqs?: string;
  coreqs?: string;
  offeredOnlineOnly?: boolean;
  offeredOnline?: boolean;
  offeredInTerms?: TermType[];
};

export type Node = Pick<Course, "id" | "code" | "title" | "level">;
export type Link = {
  start: string;
  end: string;
  type: string;
  group_id: string;
};

export type CoursePath = {
  nodes: Node[];
  links: Link[];
};

function normalizeCourse(p: {
  id: string;
  code: string;
  title: string;
  description?: string;
}): Course {
  let raw = (p.description ?? "").trim();
  raw = raw.replace(/,(\S)/g, ", $1");

  // Extract "Offered: F,W,S"
  const termMatch = raw.match(/Offered:\s*([FWS,]+)/i);
  const offeredInTerms: TermType[] | undefined = termMatch
    ? termMatch[1]
        .split(",")
        .map((t) => t.trim().toUpperCase() as keyof typeof TermType)
        .filter((t) => ["F", "W", "S"].includes(t))
        .map((t) => TermType[t])
    : undefined;

  // Extract raw info
  const offeredOnlineOnly = /only offered online/i.test(raw);
  const offeredOnline = /also offered online/i.test(raw);
  let clean = raw
    .replace(/Only offered Online/gi, "")
    .replace(/Also offered Online/gi, "");
  const prereqMatch = clean.match(/Prereq:\s*([^\.\n]*)/i);
  const antireqMatch = clean.match(/Antireq:\s*([^\.\n]*)/i);
  const coreqMatch = clean.match(/Coreq:\s*([^\.\n]*)/i);
  const prereqs = prereqMatch?.[1]?.trim() || undefined;
  const antireqs = antireqMatch?.[1]?.trim() || undefined;
  const coreqs = coreqMatch?.[1]?.trim() || undefined;

  // Clean description by removing system suffixes + noise
  clean = clean
    .replace(/Offered:[^\.\n]*/gi, "")
    .replace(/Prereq:[^\.\n]*/gi, "")
    .replace(/Antireq:[^\.\n]*/gi, "")
    .replace(/Coreq:[^\.\n]*/gi, "") // ← remove Coreq
    .replace(/Not open to [^.]+/gi, "")
    .replace(/\[[^\]]*\]?/g, "") // ← remove [ ... ] and stray "["
    .replace(/\s+/g, " ")
    .trim();
  clean += ".";

  // Remove odd trailing punctuation repetitions
  clean = clean.replace(/([.,;])\s*$/g, ""); // strip final punctuation
  clean = clean.replace(/\s*([.,;]){2,}/g, "$1"); // collapse double periods

  return {
    id: p.id,
    code: p.code,
    title: p.title,
    description: clean,
    prereqs,
    antireqs,
    coreqs,
    offeredInTerms,
    offeredOnlineOnly,
    offeredOnline,
  };
}

export const getCourseById = async (id: string): Promise<Course> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = (await get(`v1/courses/${id}`)) as any;

    return normalizeCourse(res.data as Course);
  } catch (error: unknown) {
    throw new Error(`Failed to fetch course with id ${id} with error ${error}`);
  }
};

export const getCourseFrontPathById = async (
  id: string
): Promise<CoursePath> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = (await get(`v1/courses/${id}/frontpath`)) as any;

    return res.data as CoursePath;
  } catch (error: unknown) {
    throw new Error(`Failed to fetch course with id ${id} with error ${error}`);
  }
};

export const getCourseBackPathById = async (
  id: string
): Promise<CoursePath> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = (await get(`v1/courses/${id}/backpath`)) as any;

    return res.data as CoursePath;
  } catch (error: unknown) {
    throw new Error(`Failed to fetch course with id ${id} with error ${error}`);
  }
};

export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const res = (await get(`v1/courses/`)) as any;

    // Normalize all courses before returning
    return (res.data as Course[]).map((course) => normalizeCourse(course));
  } catch (error: unknown) {
    throw new Error(`Failed to fetch courses with error ${error}`);
  }
};
