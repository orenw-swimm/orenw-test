import { useEffect, useState } from "react";

export type Action = {
  id: string;
  description: string;
  createdBy: string;
  createdAt: string;
};

interface Props {
  clientId: string;
}

export default function ClientActionsPanel({ clientId }: Props) {
  const [actions, setActions] = useState<Action[]>([]);
  const [newAction, setNewAction] = useState({
    description: "",
    createdBy: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/actions/by-client/${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActions(data);
        } else {
          console.error("פעולות לא הוחזרו כמערך:", data);
          setActions([]);
        }
      })
      .catch((err) => {
        console.error("שגיאה בטעינת פעולות:", err);
        setActions([]);
      });
  }, [clientId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    fetch("http://localhost:3000/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: { id: clientId },
        description: newAction.description,
        createdBy: newAction.createdBy,
      }),
    })
      .then((res) => res.json())
      .then((saved) => {
        setActions((prev) => [saved, ...prev]);
        setNewAction({ description: "", createdBy: "" });
      });
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>📋 פעולות עבור לקוח</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="תיאור פעולה"
          value={newAction.description}
          onChange={(e) =>
            setNewAction({ ...newAction, description: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="בוצע על ידי"
          value={newAction.createdBy}
          onChange={(e) =>
            setNewAction({ ...newAction, createdBy: e.target.value })
          }
          required
        />
        <button type="submit">➕ הוסף פעולה</button>
      </form>

      <ul style={{ marginTop: "1rem" }}>
        {actions.map((a) => (
          <li key={a.id}>
            <b>{a.createdBy}</b>: {a.description}{" "}
            <i>({new Date(a.createdAt).toLocaleString()})</i>
          </li>
        ))}
      </ul>
    </div>
  );
}
