const statuses = [
    {
        name: 'To Do',
        statusCode: 0,
        actions: [
            {
                name: 'In progress',
                action: 'next',
            }
        ]
    },
    {
        name: 'In Progress',
        statusCode: 1,
        actions: [
            {
                name: 'To Do',
                action: 'prev',
            },
            {
                name: 'Done',
                action: 'next',
            }
        ]
    },
    {
        name: 'Done',
        statusCode: 2,
        actions: [
            {
                name: 'To archive',
                action: 'next',
            }
        ]
    },
];

const NEW_TASK_DEFAULT = {
    title: "New Task",
    status: 0
}

export {
    statuses,
    NEW_TASK_DEFAULT
};