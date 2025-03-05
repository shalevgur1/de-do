import React from "react";

function Task(props) {
  //Rreact component for a task on the dashboard

  function handleClick() {
    // Handle click on delete or complete buttons
    props.onComplete(props.id);
  }

  return (
    <div className="task">
      <h1>{props.title}</h1>
      <p>{props.description}</p>
      <button onClick={handleClick}>Complete</button>
    </div>
  );
}

export default Task;
