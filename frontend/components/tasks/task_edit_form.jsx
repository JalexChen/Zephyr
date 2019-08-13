import React from "react";
import { Link, withRouter } from "react-router-dom";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";
import { faCheck, faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskDate from './task_date';
import SubtaskIndex from './subtask_index';

class TaskEditForm extends React.Component {
  constructor(props) {
    
    super(props);
    this.state = {
      task: { ...this.props.task },
    };

    this.handleInput = this.handleInput.bind(this);
    this.createSubtask = this.createSubtask.bind(this);
    this.closeModalEsc = this.closeModalEsc.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
  }

  componentDidMount() {
    this.closeModalEsc();
  }

  handleInput(type) {
    return e => {
      const task = this.state.task;
      task[type] = e.target.value;

      this.setState({ task }, () => {
        this.handleSubmit();
      });
    };
  }

  handleSubmit() {
    this.props.updateTask(this.state.task);
  }

  createSubtask() {
    const { task, createTask, updateTask } = this.props;
    const subtask = {
      name: '',
      column_id: task.column_id,
    };

    createTask(subtask).then(result => {
      const subtask = result.task;
      const updatedTask = task;
      updatedTask.subtask.unshift(subtask.id);
      updateTask(updatedTask);
    })
  }

  closeModalEsc() {
    $(document).keydown(e => {
      if (e.keyCode == 27) {
        this.props.closeModal();
      }
    });
  }

  closeModal() {
    const workspaceId = this.props.match.params.workspaceId;
    const projectId = this.props.match.params.projectId;
    this.props.history.push(`/${workspaceId}/${projectId}`);
    this.props.closeModal();
  }

  toggleCompleted() {
    const { task, updateTask } = this.props;
    const updatedTask = task;
    updatedTask.completed = !task.completed;
    updateTask(updatedTask);
  }

  render() {
    const { closeModal, updateTask, tasks } = this.props;
    const { task } = this.state;
    let completed;

    // task.completed -> move to separate component
    if (task.completed === false) {
      completed = (
        <button
          className="btn task-edit-incomplete"
          onClick={this.toggleCompleted}
        >
          <FontAwesomeIcon icon={faCheck} className="task-edit-check" />
          <div className="task-edit-mark-complete">Mark Complete</div>
        </button>
      );
    } else {
      completed = (
        <button
          className="btn task-edit-complete"
          onClick={this.toggleCompleted}
        >
          <FontAwesomeIcon icon={faCheck} className="task-edit-check" />
          <div className="task-edit-completed">Completed</div>
        </button>
      );
    }

    return (
      <div className="task-edit-form">
        <div className="task-edit-top">
          {completed}
          <div className="task-edit-top-right">
            <div>
              <FontAwesomeIcon 
                icon={faTasks}
                className="task-edit-new-subtask"
                onClick={() => this.createSubtask()} />
            </div>
            <div onClick={closeModal} className="task-edit-cross">
              ×
            </div>
          </div>
        </div>
        <div className="task-edit-header">
          <input
            className="task-edit-name"
            type="text"
            value={task.name}
            placeholder="Write a task name"
            onChange={this.handleInput("name")}
          />
          <div className="task-edit-header-sub">
            <TaskDate {...this.props} task={task} updateTask={updateTask} />
          </div>
        </div>
        <SubtaskIndex task={task} tasks={tasks} updateTask={updateTask} />
        <div className="task-edit-border" />
        <div className="task-edit-description-container">
          <FontAwesomeIcon
            icon={faGripLines}
            className="task-edit-description-icon"
          />
          <textarea
            className="task-edit-description"
            type="text"
            value={task.description || ''}
            onChange={this.handleInput('description')}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(TaskEditForm);
