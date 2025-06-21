function taskReducer(state, action) {
    switch (action.type) {
        case "FETCH_START":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { loading: false, tasks: action.payload };
        case "ADD_TASK":
            return {
                ...state,
                tasks: [...state.tasks, action.payload]
            };
        case "SET_TASK":
            // This is now handled by FETCH_SUCCESS, but kept for compatibility if needed elsewhere
            return { ...state, tasks: action.payload };
        case "REMOVE_TASK":
            return {
                ...state,
                tasks: state.tasks.filter((task, index) => index !== action.id)
            };
        case "MARK_DONE":
            return {
                ...state,
                tasks: state.tasks.map((task, index) => {
                    if (index === action.id) {
                        return { ...task, completed: !task.completed };
                    }
                    return task;
                })
            };
        default: {
            throw Error("Unknown Action" + action.type)
        }
    }
}

export default taskReducer;