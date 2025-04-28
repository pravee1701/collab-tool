import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApiKeys, createApiKey, deleteApiKey } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";



export default function ApiKeys() {
  const dispatch = useDispatch();
  const { apiKeys, isLoading } = useSelector((state) => state.auth);

  const [label, setLabel] = useState("");

  useEffect(() => {
    if (apiKeys.length === 0 && !isLoading) {
      dispatch(getApiKeys());
    }
  }, [dispatch, apiKeys.length, isLoading]); 

  const handleCreateKey = async () => {
    if (!label.trim()) {
      toast.error("Label is required");
      return;
    }
    try {
      await dispatch(createApiKey({ name: label })).unwrap();
      toast.success("API Key created");
      dispatch(getApiKeys());
      setLabel("");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this API Key?")) {
      try {
        await dispatch(deleteApiKey(id)).unwrap();
        toast.success("API Key deleted");
        dispatch(getApiKeys())
      } catch (error) {
        toast.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">API Keys</h1>

      {/* Loading indicator inside, not whole component */}
      {isLoading && (
        <div className="flex justify-center items-center h-40">hello Loading...</div>
      )}

      {/* Create New API Key */}
      <Card className="max-w-xl mb-8">
        <CardContent className="p-6 space-y-4">
          <Input
            placeholder="Enter a label for your new API Key"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Button onClick={handleCreateKey}>Create API Key</Button>
        </CardContent>
      </Card>

      {/* List API Keys */}
      <div className="grid gap-4">
        {!isLoading && (
          Array.isArray(apiKeys) && apiKeys.length === 0 ? (
            <div className="text-gray-500">No API Keys found.</div>
          ) : (
            Array.isArray(apiKeys) &&
            apiKeys.map((key) => (
              <Card key={key.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{key.name}</p>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(key.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )
        )}
      </div>
    </div>
  );
}
