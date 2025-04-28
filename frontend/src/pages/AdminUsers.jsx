import { useEffect, useState } from "react";
import {axiosInstance} from "../lib/axiosInstance";
import { toast } from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/getAllUsers");
      setUsers(data.users || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user._id} className="bg-card p-4 rounded-lg shadow-md flex flex-col">
            <span className="font-semibold">{user.username}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <span className="text-xs text-muted-foreground">Role: {user.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
