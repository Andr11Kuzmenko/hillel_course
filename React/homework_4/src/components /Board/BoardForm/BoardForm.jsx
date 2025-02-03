import React, {useRef, useState} from 'react'
import {statuses} from "../../../constants/board.js";
import Button from "../../Button/Button.jsx";

import {NEW_TASK_DEFAULT} from "../../../constants/board.js";

export default function BoardForm({taskCreate}) {
    const formRef = useRef();
    const inputTitle = useRef();
    const selectStatus = useRef();

    const [newTask, setNewTask] = useState(NEW_TASK_DEFAULT);

    const handleFormTitle = evt => {
        setNewTask(prevState => {
            return {
                ...prevState,
                title: evt.target.value
            }
        });
    }

    const handleStatusSelect = evt => {
        setNewTask(prevState => {
            return {
                ...prevState,
                status: +evt.target.value
            }
        })
    }


    const handleFormSubmit = async evt => {
        evt.preventDefault();
        await taskCreate(newTask);
    }

    return <form onSubmit={handleFormSubmit} ref={formRef}>
        <label>
            <span className="form_item-label">Title</span>
            <input type="text"
                   ref={inputTitle}
                   onChange={handleFormTitle}
                   defaultValue={newTask.title}
            />
        </label>
        <label>
            <span className="form_item-label">Status</span>
            <select
                ref={selectStatus}
                onChange={handleStatusSelect}
                defaultValue={newTask.status}
            >
                {
                    statuses.map((status, statusIdx) => {
                        return <option key={statusIdx} value={status.statusCode}>{status.name}</option>
                    })
                }
            </select>
        </label>
        <Button title="Create Task" />
    </form>
}
