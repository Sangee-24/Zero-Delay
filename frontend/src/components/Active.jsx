import React from 'react';
import Task from './Task/Task';
import { useContext } from 'react';
import TaskContext from '../context/TaskContext';

function Active() {
    const { taskState } = useContext(TaskContext);
    const { loading, tasks } = taskState;
    
    if (loading) {
        return <div className="text-center text-gray-500 mt-10">Loading tasks...</div>;
    }

    const activeTasks = tasks.filter(task => !task.completed);

    // Case 1: There are active tasks to show
    if (activeTasks.length > 0) {
        return (
            <div>
                {tasks.map((task, index) => (
                    !task.completed && <Task key={index} task={task} id={index} />
                ))}
            </div>
        );
    }

    // Case 2: All tasks are complete
    if (tasks.length > 0) {
        return (
            <div className="text-center text-gray-500 mt-10">
                <p className="text-lg font-semibold">🧘 All clear. Nothing active.</p>
                <p>Take a breath or prep for what's next 🌿🗂️</p>
            </div>
        );
    }

    // Case 3: There are no tasks at all
    return (
        <div className="text-center text-gray-500 mt-10">
            <p className="text-lg font-semibold">🚀 No tasks yet? Let's change that!</p>
            <p>Kickstart your productivity by adding your first task — your goals are waiting! ✅</p>
        </div>
    );
}

export default Active;