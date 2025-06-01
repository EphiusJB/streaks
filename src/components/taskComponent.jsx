import React from 'react'
import CheckboxComponent from './checkbox'

export default function TaskComponent({tasks}) {
    

    return (
        <>
            {tasks ? (tasks.map((task)=>{
            <div className="task">temp{task.name} <CheckboxComponent />
            </div>
            })) : <p>No tasks available</p> }
        </>
    )
}
