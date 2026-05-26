import React, {useState, useEffect} from "react";
import './style.sass';

export default function List() {
    const animals = [
        {type: `turtle`, icon: `🐢`},
        {type: `octopus`, icon: `🐙`},
        {type: `fish`, icon: `🐠`},
        {type: `flamingo`, icon: `🦩`},
        {type: `penguin`, icon: `🐧`}
    ]

    const [list, setList] = useState(animals);
    const [intervalId, setIntervalId] = useState(null);

    const getClassList = (isActive) => {
        return isActive ? 'active_row' : '';
    }

    const setRandomActiveItem = () => {
        setList(prevState => {
            const listCopy = JSON.parse(JSON.stringify(prevState));
            const inactiveItems = listCopy.filter(item => !item.active);

            if (inactiveItems.length) {
                const elementIndex = Math.floor(Math.random() * inactiveItems.length);
                inactiveItems[elementIndex].active = true;
            }

            return listCopy;
        });
    }

    const removeInterval = () => {
        const inactiveItems = list.filter(item => !item.active);

        if (!inactiveItems.length) {
            clearInterval(intervalId);
        }
    }

    useEffect( () => {
            const _intervalId = setInterval(
                setRandomActiveItem,
                1000
            );
            setIntervalId(_intervalId);
        }, []
    )

    useEffect(
        removeInterval,
        [list]
    )

    return <table>
        <tbody>
            {list.map((item, index) => {
                return <tr key={index} className={getClassList(item.active)}>
                    <td>{item.type}</td>
                    <td>{item.icon}</td>
                </tr>
            })}
        </tbody>
    </table>;
}