import React from 'react';
import Task from './Task/Task';
import { useContext } from 'react';
import TaskContext from '../context/TaskContext';
function AllTask() {
    const { taskState } = useContext(TaskContext);
    const { loading, tasks } = taskState;

    if (loading) {
        return <div className="text-center text-gray-500 mt-10">Loading tasks...</div>;
    }

    return (
        <div>
            {
                (tasks.length !==0) ? (
                    tasks.map((task, index) => {
                        return (
                            <Task
                                key={index}
                                task={task}
                                id={index}
                            />
                        )
                    })
                ) : (
                    <div className="text-center text-gray-500 mt-10">
                        <p className="text-lg font-semibold">🧭 Nothing scheduled yet.</p>
                        <p>But with ZeroDelay, you're just one step away from unstoppable 🏎️</p>
                    </div>
                )
            }
        </div>
    );
}

export default AllTask;