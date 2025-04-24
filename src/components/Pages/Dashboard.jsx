/** @format */
import { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";

import { ConnectButton } from "./ConnectButton.jsx";
import { Hooks } from "../Wagmi/Hooks.jsx";

export const Dashboard = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [hash, setHash] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [newStatus, setNewStatus] = useState(true);

  const submitHandler = async () => {
    if (taskName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Task Name is required",
      });
      return false;
    }

    if (taskDescription == "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Task Description is required",
      });
      return false;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Transfer it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        document.getElementById("loaderVisibility").classList.add("is-active");

        try {
          const contract = Hooks();
          const response = await contract.createTask(taskName, taskDescription);

          if (response.status) {
            Swal.fire({
              icon: "success",
              title: "Transferred Amount",
              text: response.message,
            });
            setTaskName("");
            setTaskDescription("");
            getAllTasks();
            setHash(response.hash);
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: response.message,
            });
          }
        } catch (e) {
          console.log("Amount not Transferd", e);
          document
            .getElementById("loaderVisibility")
            .classList.remove("is-active");

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }

        document
          .getElementById("loaderVisibility")
          .classList.remove("is-active");
      }
    });
  };

  const getAllTasks = async () => {
    try {
      const contract = Hooks();
      const response = await contract.getAllTodoData();
      // const response = await contract.getTodoData(0);
      // const filteredTasks = response.result.filter((task) => task.status === false);
      console.log("response", response.result);
      setTasks(response.result);
    } catch (e) {
      console.log("Amount not Transferd --->>", e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const handleEdit = (task, taskId) => {
    setEditMode(true);
    setEditTaskId(taskId);
    setTaskName(task.name);
    setTaskDescription(task.taskDescription);
    console.log("index task: ", taskId);
  };

  const handleDelete = (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        document.getElementById("loaderVisibility").classList.add("is-active");

        try {
          const contract = Hooks();
          const response = await contract.deleteTaskHandler(taskId);

          document
            .getElementById("loaderVisibility")
            .classList.remove("is-active");

          if (response && response.status) {
            Swal.fire("Deleted!", "Task has been deleted.", "success");
            getAllTasks();
          } else {
            Swal.fire("Failed", response?.message || "Delete failed", "error");
          }
        } catch (error) {
          console.error("Delete error:", error);
          document
            .getElementById("loaderVisibility")
            .classList.remove("is-active");
          Swal.fire("Error", "Something went wrong!", "error");
        }
      }
    });
  };

  const updateHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this task?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        document.getElementById("loaderVisibility").classList.add("is-active");

        try {
          const contract = Hooks();
          const response = await contract.updateStatusHandler(
            editTaskId,
            taskName,
            taskDescription,
            newStatus
          );

          document
            .getElementById("loaderVisibility")
            .classList.remove("is-active");

          if (response && response.status) {
            Swal.fire("Updated!", "Task has been updated.", "success");
            setEditMode(false);
            setTaskName("");
            setTaskDescription("");
            setNewStatus(false);
            getAllTasks();
          } else {
            Swal.fire("Failed", response?.message || "Update failed", "error");
          }
        } catch (error) {
          console.error("Update Error:", error);
          document
            .getElementById("loaderVisibility")
            .classList.remove("is-active");
          Swal.fire("Error", "Something went wrong!", "error");
        }
      }
    });
  };

  return (
    <div>
      <Row style={{ backgroundColor: "rgb(14, 52, 100)", minHeight: "4rem" }}>
        <Col>
          <h4 className="p-3" style={{ color: "#ffffff" }}>
            Todo Dapp
          </h4>
        </Col>

        <Col>
          <div className="connectWallet text-end">
            <ConnectButton />
          </div>
        </Col>
      </Row>

      <Row className="pt-5">
        <Col className="d-flex justify-content-center">
          <Form className="form col-md-6">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter Task Name"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                type="tel"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter Task Description"
              />
            </Form.Group>

            <Button
              onClick={editMode ? updateHandler : submitHandler}
              className="btn btn-sucess form-control"
              style={{
                maxWidth: "fit-content",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                backgroundColor: "rgb(14, 52, 100)",
                color: "#ffffff",
              }}
            >
              {editMode ? "Update Task" : "Add Task"}
            </Button>
          </Form>
        </Col>
      </Row>

      {/* <Button
        onClick={getAllTasks}
        className="btn btn-sucess form-control"
        style={{
          maxWidth: "fit-content",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          backgroundColor: "rgb(14, 52, 100)",
          color: "#ffffff",
        }}
       >
        Get All Task
      </Button> */}
      <div className="container mt-4">
        <h5>All Tasks</h5>
        {tasks.filter((task) => task.name.trim() !== "").length === 0 ? (
          <p>No tasks found</p>
        ) : (
          tasks
            .filter((task) => task.name.trim() !== "")
            .map((task, index) => (
              <div
                key={index}
                className="p-3 mb-2"
                style={{
                  backgroundColor: "#f2f2f2",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h6 style={{ margin: 0 }}>{task.name}</h6>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>
                    {task.taskDescription}
                  </p>
                  <small>Status: {task.status ? "true" : "Pending"}</small>
                </div>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(task, task.taskId)}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(index)}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            ))
        )}
      </div>

      {hash != "" && (
        <div className="mt-5 text-center">
          <hr />
          <a
            href={"https://sepolia.etherscan.io/tx/" + hash}
            target="_blank"
            className="mt-5  text-decoration-none"
          >
            View Transaction
          </a>
        </div>
      )}
    </div>
  );
};
