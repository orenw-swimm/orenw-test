import { useEffect, useState } from "react";
import ClientForm from "../components/ClientForm";
import StatusFilter from "../components/StatusFilter";
import ClientActionsPanel from "../components/ClientActionsPanel";
import { Client } from "../types/types";
import ClientsTable from "../components/ClientsTable";

const statuses = [
  "חדש",
  "בקשר",
  "פגישה",
  "הצעה",
  "המתנה",
  "נסגר",
  "לא רלוונטי",
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/clients")
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  function handleAdd(
    data: Omit<Client, "id" | "status" | "createdAt" | "updatedAt">
  ) {
    fetch("http://localhost:3000/clients/mock-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((created) => setClients((prev) => [...prev, created]));
  }

  function handleStatusChange(id: string, status: string) {
    fetch(`http://localhost:3000/clients/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updated) =>
        setClients((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        )
      );
  }

  function handleDelete(id: string) {
    if (!window.confirm("בטוח שברצונך למחוק?")) return;
    fetch(`http://localhost:3000/clients/${id}`, { method: "DELETE" }).then(
      () => setClients((prev) => prev.filter((c) => c.id !== id))
    );
  }

  const filtered =
    filter === "all" ? clients : clients.filter((c) => c.status === filter);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>מערכת CRM</h1>
      <ClientForm onAdd={handleAdd} />
      <StatusFilter value={filter} onChange={setFilter} options={statuses} />

      <ClientsTable
        clients={filtered}
        onSelect={setSelectedClientId}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {selectedClientId && <ClientActionsPanel clientId={selectedClientId} />}
    </div>
  );
}
