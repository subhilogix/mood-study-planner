import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import NewTaskForm from "../components/tasks/NewTaskForm";
import TaskList from "../components/tasks/TaskList";

const PlannerPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-mind-textMain">Study Planner</h1>
        <p className="text-sm text-mind-textSoft">
          Import tasks from your brain, not your stress. Keep things light and realistic.
        </p>
      </div>

      {/* Add Task Form - Full width */}
      <Card>
        <CardHeader>
          <CardTitle>Add a gentle task</CardTitle>
        </CardHeader>
        <CardContent>
          <NewTaskForm />
        </CardContent>
      </Card>

      {/* Tasks List - Full width below form */}
      <Card className="bg-mind-cardSoft">
        <CardHeader>
          <CardTitle>Your tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlannerPage;
