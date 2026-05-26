import React from 'react';
import BoardItemMember from "./BoardItemMember/BoardItemMember.jsx";

function BoardItem({currentTasks, item}) {
    return <td>
        <p>{item.name}: {currentTasks.length}</p>
        {
            currentTasks.length ?
            <ul>
                {
                    currentTasks.map((taskItem, taskIndex) => {
                        return <BoardItemMember item={item} taskItem={taskItem} key={taskIndex}/>
                    })
                }
            </ul>
            : null
        }
    </td>
}

export default BoardItem;