const API = 'https://6793a0f45eae7e5c4d8f58c2.mockapi.io/tasks';

export async function fetchData() {
    try {
        const request = await fetch(API);
        return await request.json();
    } catch (e) {
        console.error(e);
    }

    return [];
}

export async function deleteTask(taskID) {
    try {
        return await fetch(`${API}/${taskID}`, {method: 'DELETE'});
    } catch (e) {
        console.error(e);
    }
}

export async function updateTask(taskID, taskStatus) {
    try {
        return await fetch(
            `${API}/${taskID}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: taskStatus
                })
            }
        );
    } catch (e) {
        console.error(e);
    }
}

export async function createTask(task) {
    try {
        return await fetch(
            API,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            }
        )
    } catch (e) {
        console.error(e);
    }
}