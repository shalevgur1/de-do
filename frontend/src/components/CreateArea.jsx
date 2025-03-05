import React, { useState } from "react";

function CreateArea(props) {
  const [task, setTask] = useState({
    title: "",
    content: ""
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
      title: "",
      content: ""
    });
    event.preventDefault();
  }

  return (
    <div>
      <form>
        <input
          name="title"
          onChange={handleChange}
          value={task.title}
          placeholder="Title"
        />
        <textarea
          name="content"
          onChange={handleChange}
          value={task.content}
          placeholder="Description..."
          rows="3"
        />
        <button onClick={submitTask}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
