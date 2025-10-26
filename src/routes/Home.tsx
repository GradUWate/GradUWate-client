import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Hi, Mr. Goose! 🎓</h1>
        <p className="text-lg mt-2">
          Let's start planning for{" "}
          <span className="font-semibold">GradUWation</span>!
        </p>
      </div>

      {/* Profile Info Card */}
      <Card className="shadow-sm">
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
      </Card>

      {/* Drafted Schedules */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Drafted Schedule 1</CardTitle>
            <CardDescription>
              Trying out software engineering as a major instead
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>4 Courses • 15 Credits</p>
          </CardContent>
          <div className="flex justify-end gap-2 px-4">
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Drafted Schedule 2</CardTitle>
            <CardDescription>
              Adding HCI specialization to CS major
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>3 Courses • 12 Credits</p>
          </CardContent>
          <div className="flex justify-end gap-2 px-4">
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
