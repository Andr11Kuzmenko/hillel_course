import React, {useState, useEffect} from 'react'
import './style.sass'
import {fetchData, deleteTask, updateTask, createTask} from "../../services/board.js";
import BoardItem from "./BoardItem/BoardItem.jsx";
import BoardForm from "./BoardForm/BoardForm.jsx";
import {statuses} from "../../constants/board.js";

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

    const buttonActions = {
        prev: task => {
            task.status--;
            updateTasksState(task);
        },

        next: task => {
            task.status++;
            updateTasksState(task);
        }
    }

    useEffect(() => {
        statuses.forEach(status => status.actions.forEach(action => action.action = buttonActions[action.action]));
    }, [])

    useEffect(() => {
        async function getData() {
            setTasks(await fetchData());
        }
        getData();
    }, [])

    const getTasksByCode = statusCode => {
        return tasks.filter(item => item.status === statusCode);
    };

    const addNewTask = async task => {
        console.log('creating new task');
        try {
            await createTask(task);
            setTasks(await fetchData());
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <BoardForm taskCreate={addNewTask}/>
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
