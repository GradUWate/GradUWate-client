import { get } from "./BaseClient";

export type ReqCourse = {
    id: string;
    code: string;
    group_id?: string;
}
export type Course = {
    id: string;
    code: string;
    title: string;
    description?: string;
    level?: number;
    prereqs?: ReqCourse[];
    coreqs?: ReqCourse[];
}

export type Node = Pick<Course, "id" | "code" | "title"| "level">;
export type Link = {
    start: string,
    end: string,
    type: string,
    group_id: string
}

export type CoursePath = {
  nodes: Node[];
  links: Link[];
}

export const getCourseById = async (id: string): Promise<Course> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await get(`v1/courses/${id}`) as any;

    return res.data as Course;
  } catch (error: unknown) {
    throw new Error(`Failed to fetch course with id ${id} with error ${error}`);
  }
};


export const getCourseFrontPathById = async (id: string): Promise<CoursePath> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await get(`v1/courses/${id}/frontpath`) as any;
    console.log("RES", res);

    return res.data as CoursePath;
  } catch (error: unknown) {
    throw new Error(`Failed to fetch course with id ${id} with error ${error}`);
  }
};

export const getCourseBackPathById = async (id: string): Promise<CoursePath> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await get(`v1/courses/${id}/backpath`) as any;

    return res.data as CoursePath;
  } catch (error: unknown) {
    throw new Error(`Failed to fetch course with id ${id} with error ${error}`);
  }
};
