import React, {useState, useEffect} from 'react'
import './style.sass'
import {fetchData, deleteTask, updateTask} from "../../services/board.js";
import BoardItem from "./BoardItem/BoardItem.jsx";

export default function Board() {
    const [tasks, setTasks] = useState([]);

    const updateTasksState = async task => {
        let response;

        if (task.status > 2) {
            response = await deleteTask(task.id);
        } else {
            response = await updateTask(task.id, task.status);
        }

        if (response?.ok) {
            setTasks(prevState => {
                const tasksCopy = JSON.parse(JSON.stringify(prevState));
                tasksCopy.find(item => item.id === task.id).status = task.status;
                return tasksCopy;
            })
        }
    }

    const prev = task => {
        task.status--;
        updateTasksState(task);
    }

    const next = task => {
        task.status++;
        updateTasksState(task);
    }

    useEffect(() => {
        async function getData() {
            setTasks(await fetchData());
        }
        getData();
    }, [])

    const statuses = [
        {
            name: 'To Do',
            statusCode: 0,
            actions: [
                {
                    name: 'In progress',
                    action: next,
                }
            ]
        },
        {
            name: 'In Progress',
            statusCode: 1,
            actions: [
                {
                    name: 'To Do',
                    action: prev,
                },
                {
                    name: 'Done',
                    action: next,
                }
            ]
        },
        {
            name: 'Done',
            statusCode: 2,
            actions: [
                {
                    name: 'To archive',
                    action: next,
                }
            ]
        },
    ];

    const getTasksByCode = statusCode => {
        return tasks.filter(item => item.status === statusCode);
    };

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        {statuses.map((item, index) => {
                            const currentTasks = getTasksByCode(item.statusCode);
                            return <BoardItem key={index} currentTasks={currentTasks} item={item}/>
                        })}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
