import { useEffect, useState } from "react";
import axios from "../lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [keyName, setKeyName] = useState("");

  const fetchApiKeys = async () => {
    try {
      const { data } = await axios.get("/api-keys");
      setApiKeys(data.apiKeys);
    } catch (err) {
      toast.error("Failed to fetch API keys");
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleCreate = async () => {
    if (!keyName.trim()) return toast.error("Name is required");

    try {
      await axios.post("/api-keys", { name: keyName });
      toast.success("API key created!");
      setKeyName("");
      fetchApiKeys();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api-keys/${id}`);
      toast.success("API key deleted!");
      fetchApiKeys();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 space-y-8">
      <h1 className="text-3xl font-bold">Your API Keys</h1>

      <div className="flex space-x-2 w-full max-w-md">
        <Input
          placeholder="API Key Name"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
        />
        <Button onClick={handleCreate}>Create</Button>
      </div>

      <div className="w-full max-w-md space-y-4">
        {apiKeys.length === 0 ? (
          <p className="text-muted-foreground text-center">No API keys found.</p>
        ) : (
          apiKeys.map((key) => (
            <div key={key._id} className="flex justify-between items-center p-4 bg-card rounded-lg shadow-md">
              <div className="flex flex-col">
                <span className="font-semibold">{key.name}</span>
                <span className="text-sm text-muted-foreground">{key.key}</span>
              </div>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(key._id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
