import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import Sidebar from "../../layouts/Sidebar";

import {
  Search,
  CircleDashed,
  Loader,
  CheckCircle2,
} from "lucide-react";

const statuses = [
  "Pending",
  "In Progress",
  "Completed",
];

const KanbanPage = () => {
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // NEW
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  // FILTERED TASKS
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {

      const matchesSearch =
        task.title
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesPriority =
        priorityFilter === "All"
          ? true
          : task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, search, priorityFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <CircleDashed size={20} className="text-yellow-500" />;

      case "In Progress":
        return <Loader size={20} className="text-blue-500" />;

      case "Completed":
        return <CheckCircle2 size={20} className="text-green-500" />;

      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <div className="hidden md:block fixed h-screen">
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </div>

      {sidebarOpen && (
        <div className="fixed z-50 md:hidden">
          <Sidebar setSidebarOpen={setSidebarOpen} />
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 md:ml-64 p-6 overflow-x-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Kanban Board
            </h1>

            <p className="text-gray-500 mt-1">
              Drag and manage team tasks
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row gap-3">

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search task..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="pl-10 pr-4 py-2 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* FILTER */}
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
              className="px-4 py-2 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Priorities
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>

          </div>
        </div>

        {/* BOARD */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid md:grid-cols-3 gap-6 min-w-[1000px]">

            {statuses.map((status) => {

              const columnTasks = filteredTasks.filter(
                (task) => task.status === status
              );

              return (
                <Droppable
                  droppableId={status}
                  key={status}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-white rounded-2xl border p-5 min-h-[650px]"
                    >

                      {/* COLUMN HEADER */}
                      <div className="flex justify-between items-center mb-6">

                        <div className="flex items-center gap-2">
                          {getStatusIcon(status)}

                          <h2 className="text-xl font-bold">
                            {status}
                          </h2>
                        </div>

                        <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                          {columnTasks.length}
                        </span>

                      </div>

                      {/* TASKS */}
                      <div className="space-y-4">

                        {columnTasks.map((task, index) => (
                          <Draggable
                            draggableId={task._id}
                            index={index}
                            key={task._id}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-gray-50 border rounded-2xl p-4 hover:shadow-md transition"
                              >

                                <div className="flex justify-between items-start">

                                  <h3 className="font-bold text-lg">
                                    {task.title}
                                  </h3>

                                  <span
                                    className={`text-xs px-3 py-1 rounded-full font-semibold ${getPriorityColor(task.priority)}`}
                                  >
                                    {task.priority}
                                  </span>

                                </div>

                                <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                                  {task.description}
                                </p>

                                <div className="flex justify-between items-center mt-5">

                                  <span className="text-xs text-gray-400">
                                    {task.assignedTo?.name || "Unassigned"}
                                  </span>

                                  <span className="text-xs text-gray-400">
                                    {task.project?.name || "No Project"}
                                  </span>

                                </div>

                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}

                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanPage;