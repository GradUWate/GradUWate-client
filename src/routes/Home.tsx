import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSchedules } from "@/contexts/SchedulesContext";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Home() {
  const navigate = useNavigate();
  const { schedules, createSchedule, deleteSchedule } = useSchedules();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newScheduleName, setNewScheduleName] = useState("");

  const handleCreateSchedule = () => {
    if (newScheduleName.trim()) {
      const newSchedule = createSchedule(newScheduleName.trim());
      setNewScheduleName("");
      setIsCreateDialogOpen(false);
      navigate(`/schedule/${newSchedule.id}`);
    }
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      deleteSchedule(scheduleId);
    }
  };

  const getTotalCourses = (scheduleId: string) => {
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) return 0;
    return schedule.terms.reduce((acc, term) => acc + term.courses.length, 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Hi, prospective graduate! 🎓</h1>
        <p className="text-lg mt-2">
          Let's start planning for{" "}
          <span className="font-semibold">GradUWation</span>!
        </p>
      </div>

      {/* Profile Info Card */}
      {/* <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Profile Info</CardTitle>
          <CardDescription>Your default academic details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Major:</span>
            <span>Computer Science</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Minor:</span>
            <span>None chosen</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Specialization:</span>
            <span>None chosen</span>
          </div>
        </CardContent>
      </Card> */}

      {/* Drafted Schedules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">My Schedules</h2>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Schedule
          </Button>
        </div>

        {schedules.length === 0 ? (
          <Card className="shadow-sm border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">
                No schedules yet. Create your first schedule to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle>{schedule.name}</CardTitle>
                  <CardDescription>
                    Created {schedule.createdAt.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-sm text-gray-600">
                      {getTotalCourses(schedule.id)} Courses •{" "}
                      {schedule.terms.length} Terms
                    </p>
                    <div className="flex justify-end gap-2 p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/schedule/${schedule.id}`)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Schedule Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription>
              Give your schedule a name to help you identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="schedule-name">Schedule Name</Label>
              <Input
                id="schedule-name"
                placeholder="e.g., Software Engineering Path"
                value={newScheduleName}
                onChange={(e) => setNewScheduleName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateSchedule();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setNewScheduleName("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSchedule}
              disabled={!newScheduleName.trim()}
            >
              Create Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
