import React from 'react';
import Button from "../../../Button/Button.jsx";

function BoardItemMember({taskItem, item}) {
    return <li>
        {taskItem.title}
        {
            item.actions.map((actionItem, actionIndex) => {
                return <Button key={actionIndex} title={actionItem.name} onClick={() => actionItem.action(taskItem)}/>
            })
        }
    </li>
}

export default BoardItemMember;