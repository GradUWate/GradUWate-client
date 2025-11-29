import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type ScheduleCourse = {
  id: string;
  code: string;
  courseId: string;
  description: string;
};

export type ScheduleTerm = {
  id: string;
  name: string;
  courses: ScheduleCourse[];
};

export type Schedule = {
  id: string;
  name: string;
  terms: ScheduleTerm[];
  createdAt: Date;
  updatedAt: Date;
};

interface SchedulesContextType {
  schedules: Schedule[];
  createSchedule: (name: string) => Schedule;
  updateSchedule: (id: string, updatedSchedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  getScheduleById: (id: string) => Schedule | undefined;
}

const SchedulesContext = createContext<SchedulesContextType | undefined>(
  undefined
);

export function SchedulesProvider({ children }: { children: ReactNode }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const createSchedule = useCallback((name: string): Schedule => {
    const newSchedule: Schedule = {
      id: `schedule-${Date.now()}`,
      name,
      terms: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSchedules((prev) => [...prev, newSchedule]);
    return newSchedule;
  }, []);

  const updateSchedule = useCallback(
    (id: string, updatedSchedule: Partial<Schedule>): void => {
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === id
            ? { ...schedule, ...updatedSchedule, updatedAt: new Date() }
            : schedule
        )
      );
    },
    []
  );

  const deleteSchedule = useCallback((id: string): void => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
  }, []);

  const getScheduleById = useCallback(
    (id: string): Schedule | undefined => {
      return schedules.find((schedule) => schedule.id === id);
    },
    [schedules]
  );

  return (
    <SchedulesContext.Provider
      value={{
        schedules,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        getScheduleById,
      }}
    >
      {children}
    </SchedulesContext.Provider>
  );
}

export function useSchedules() {
  const context = useContext(SchedulesContext);
  if (context === undefined) {
    throw new Error("useSchedules must be used within a SchedulesProvider");
  }
  return context;
}
