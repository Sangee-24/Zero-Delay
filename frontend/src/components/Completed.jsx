import React, { useContext } from "react";
import TaskContext from "../context/TaskContext";
import CompletedTask from "./CompletedTask";

function Completed() {
    const { taskState } = useContext(TaskContext);
    const { loading, tasks } = taskState;

    if (loading) {
        return <div className="text-center text-gray-500 mt-10">Loading tasks...</div>;
    }

    const completedTasks = tasks.filter(task => task.completed);
    const allTasksCompleted = tasks.length > 0 && completedTasks.length === tasks.length;

    return (
        <div>
            {allTasksCompleted && (
                <div className="text-center text-green-600 font-semibold p-4 text-lg rounded-lg bg-green-100 mb-4">
                    <p>🎉 All tasks completed! ZeroDelay, zero stress!</p>
                    <p>Take a moment to celebrate your productivity 🥳💪</p>
                </div>
            )}
            {
                completedTasks.length > 0 ? (
                    tasks.map((task, index) => {
                        return task.completed ? <CompletedTask key={index} task={task} id={index} /> : null;
                    })
                ) : (
                    <div className="text-center text-gray-500 mt-10">
                        <p className="text-lg font-semibold">⏳ No wins yet!</p>
                        <p>Start strong — mark your first task complete and celebrate small victories! 🏁</p>
                    </div>
                )
            }
        </div>
    );
}

export default Completed;