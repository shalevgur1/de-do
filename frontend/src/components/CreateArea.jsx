import React, { useState } from "react";

function CreateArea(props) {
  const [task, setTask] = useState({
    description: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setTask(prevTask => {
      return {
        ...prevTask,
        [name]: value
      };
    });
  }

  function submitTask(event) {
    props.onAdd(task);
    setTask({
      description: ""
    });
    event.preventDefault();
  }

  return (
    <div>
      <form>
        <textarea
          name="description"
          onChange={handleChange}
          value={task.description}
          placeholder="Description..."
          rows="3"
        />
        <button onClick={submitTask}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
