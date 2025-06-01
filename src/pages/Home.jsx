import React, { useState, useEffect } from 'react'
import streaks from '../assets/Streak-Logo-g.jpg'
import u_icon from '../assets/usericon.jpg'
import './Home.css'
import fire_services from '../fire_services'
import CheckboxComponent from '../components/checkbox'
import TaskPopup from '../components/addTask'
import useTasks from '../hooks/useTasks'


function Home(props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {startTasks, endTasks, loading} = useTasks(props.auth.currentUser.uid);

  useEffect(() => {
    loading ? console.log("Loading...!") :     console.log("done");
    console.log(startTasks, endTasks)
  }, [])
  /* 
  const loadTasks = async()=>{
    
    const storedTasks = await fire_services.getStartTasks(props.user.uid)
    const varEndTasks = fire_services.getEndTasks(props.user.uid)
    setTasks(storedTasks)
    setEndTasks(varEndTasks)
  } */
  const handleCreateTask = async(task) => {
    await fire_services.addTask(props.user.uid, task.name,task.category)
    console.log("New Task Created:", task.name);
    console.log(startTasks)
  };

    return (
        <><div id="root">
           <TaskPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateTask={handleCreateTask}
      />
        <nav>
          <div className="img">
            <img src={streaks} alt="logo" className="logo" />
          </div>
          <div className="menu">
            <div className="option" onClick={()=>{setIsModalOpen(true)}}>New Streak</div>
            <div className="option">View Streaks</div>
            <div className="option">Badges</div>
            <div className="option">Stats</div>
          </div>
        </nav>
        <div className="right">
          <div className="right-top">
            <div className="top-nav">
              Welcome {props.user? props.user.displayName: ""}
            </div>
            <div className="user" onClick={props.logout}>
              <img src={u_icon} alt="" className="user_icon" />
            </div>
          </div>
          <div className="week_view">
            <div className="day">
              <div className="status">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#1C274C"/>
                </svg>
              </div>
              <h2>Mon</h2>
            </div>
    
            
            <div className="day">
              <div className="status">
              </div>
              <h2>Tue</h2>
            </div>
    
            
            <div className="day">
            <div className="status">
              </div>
              <h2>Wed</h2>
            </div>
    
            
            <div className="day">
              <div className="status">
              </div>
              <h2>Thu</h2>
            </div>
    
            
            <div className="day">
              <div className="status">
              </div>
              <h2>Fri</h2>
            </div>
    
            
            <div className="day">
              <div className="status">
              </div>
              <h2>Sat</h2>
            </div>
    
            
            <div className="day">
              <div className="status">
              </div>
              <h2>Sun</h2>
            </div>
          </div>

          <div className="dash">
            <div className="daily_progress">
              <div className="current_day">

              </div>
              <div className="progress_bar">
                <div className="bar"></div>
              </div>
            </div>
            <div className="tasks">
              <div className="start">
                <h1>Start</h1>
                {startTasks ? startTasks.map((task) => (
                  <div className="task" key={task.id}>
                    {task.name} <CheckboxComponent uid={props.auth.currentUser.uid} task={task}/>
                  </div>
                )) : <p>No tasks available</p>}
              </div>
              <div className="start">
                <h1>End</h1>
                {endTasks ? endTasks.map((task) => (
                  <div className="task" key={task.id}>
                    {task.name} <CheckboxComponent uid={props.auth.currentUser.uid} task={task}/>
                  </div>
                )) : <p>No tasks available</p>}
              </div>
            </div>
          </div>
        </div>
            

        </div>
        </>
    )
}

export default Home;