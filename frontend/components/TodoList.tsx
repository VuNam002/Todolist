"use client";
import React, { useState, useEffect } from "react";
import {
  fetchTodoItems,
  TodoItem,
  fetchItemCreate,
  fetchTodoItemDelete,
  fetchTodoItemStatus,
  fetchItemEdit,
} from "../lib/api";
import { toast } from "react-toastify";
// Import các icon cần thiết
import { PiCheckCircleDuotone, PiHourglassDuotone, PiWrenchDuotone, PiPencilSimple, PiTrashSimple, PiEye } from "react-icons/pi";
import { FaSave, FaTimes } from "react-icons/fa";

// Enum giống backend
enum TodoStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const loadTodos = async () => {
    setLoading(true);
    const items = await fetchTodoItems();
    setTodos(items);
    setLoading(false);
  };

  useEffect(() => {
    const getTodos = async () => {
      setLoading(true);
      const items = await fetchTodoItems();
      setTodos(items);
      setLoading(false);
    };
    getTodos();
  }, []);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newItem = await fetchItemCreate({
      title: newTodoTitle,
      status: TodoStatus.Pending,
    });
    if (newItem) {
      setTodos([...todos, newItem]);
      setNewTodoTitle("");
      toast.success("Đã thêm công việc mới!");
    } else {
      toast.error("Không thể thêm công việc!");
    }
  };

  const handleDeleteTodo = async (id: number) => {
    const success = await fetchTodoItemDelete(id);
    if (success) {
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Đã xóa công việc!");
    } else {
      toast.error("Không thể xóa công việc!");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    let nextStatus: TodoStatus;
    
    if (currentStatus === TodoStatus.Pending) {
      nextStatus = TodoStatus.InProgress;
    } else if (currentStatus === TodoStatus.InProgress) {
      nextStatus = TodoStatus.Completed;
    } else {
      nextStatus = TodoStatus.Pending;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status: nextStatus } : todo
      )
    );

    const result = await fetchTodoItemStatus(id, nextStatus);
    
    if (result) {
      // Không cần cập nhật lại vì optimistic update đã chạy
      
      if (nextStatus === TodoStatus.InProgress) {
        toast.success("Đã chuyển sang Đang làm!");
      } else if (nextStatus === TodoStatus.Completed) {
        toast.success("Đã hoàn thành!");
      } else {
        toast.success("Đã chuyển về Chờ xử lý!");
      }
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, status: currentStatus } : todo
        )
      );
      toast.error("Không thể cập nhật trạng thái!");
    }
  };

  const handleEditStart = (id: number, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const handleEditSave = async (id: number) => {
    if (!editingTitle.trim()) return;

    const updatedItem = await fetchItemEdit(id, editingTitle);
    if (updatedItem) {
      setTodos(todos.map((todo) => (todo.id === id ? updatedItem : todo)));
      setEditingId(null);
      setEditingTitle("");
      toast.success("Đã cập nhật công việc!");
    } else {
      toast.error("Không thể cập nhật công việc!");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const getStatusInfo = (status: number): { label: string, color: string, icon: React.ReactNode } => {
    switch (status) {
      case TodoStatus.Pending:
        return {
          label: "Chờ xử lý",
          color: "bg-yellow-100 text-yellow-800", 
          icon: <PiHourglassDuotone className="inline-block" />,
        };
      case TodoStatus.InProgress:
        return {
          label: "Đang làm",
          color: "bg-blue-100 text-blue-800",
          icon: <PiWrenchDuotone className="inline-block" />,
        };
      case TodoStatus.Completed:
        return {
          label: "Hoàn thành",
          color: "bg-green-100 text-green-800",
          icon: <PiCheckCircleDuotone className="inline-block" />,
        };
      default:
        return {
          label: "Không xác định",
          color: "bg-gray-200 text-gray-700",
          icon: "❓"
        };
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Đang tải...</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full">
      <form onSubmit={handleCreateTodo} className="flex gap-2 mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Nhập tên công việc mới..."
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
              + Thêm
          </button>
      </form>

      {todos.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">Không có công việc nào.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên công việc</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {todos.map((todo) => {
                const statusInfo = getStatusInfo(todo.status);
                return (
                  <tr key={todo.id} className="hover:bg-gray-50">
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      #{todo.id}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="p-1 border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`${
                            todo.status === TodoStatus.Completed ? "line-through text-gray-500" : "text-gray-800"
                          } font-medium`}
                        >
                          {todo.title}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(todo.id, todo.status)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md font-semibold text-xs transition-colors border border-transparent hover:border-gray-300 ${statusInfo.color}`}
                        title="Bấm để chuyển trạng thái"
                      >
                        {statusInfo.icon} <span className="ml-1">{statusInfo.label}</span>
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {editingId === todo.id ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEditSave(todo.id)}
                            className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100"
                            title="Lưu"
                          >
                            <FaSave className="text-base" />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
                            title="Hủy"
                          >
                            <FaTimes className="text-base" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEditStart(todo.id, todo.title)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100"
                            title="Sửa"
                          >
                            <PiPencilSimple className="text-lg" />
                          </button>
                          <button
                            className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100"
                            title="Xem chi tiết (Không có logic)"
                          >
                            <PiEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100"
                            title="Xóa"
                          >
                            <PiTrashSimple className="text-lg" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TodoList;