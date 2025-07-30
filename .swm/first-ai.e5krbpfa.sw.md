---
title: First AI
---
# Introduction

This document explains the main design decisions behind the client management page implementation. We will cover:

1. How client data is fetched and stored in the component state.
2. How new clients are added using an AI-powered mock lead endpoint.
3. How client status updates and deletions are handled.
4. How filtering and selection of clients is implemented in the UI.

# fetching and storing client data

<SwmSnippet path="/crm-client/src/pages/ClientsPage.tsx" line="18">

---

The component initializes with an empty client list and a filter state. On mount, it fetches the full client list from the backend and stores it in state. This ensures the UI reflects the current server data when loaded.

```
export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/clients")
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);
```

---

</SwmSnippet>

# adding new clients with AI integration

New clients are added by sending a GET request to a special <SwmToken path="/crm-client/src/pages/ClientsPage.tsx" pos="32:12:14" line-data="    fetch(&quot;http://localhost:3000/clients/mock-lead&quot;, {">`mock-lead`</SwmToken> endpoint with the client data in the request body. This endpoint presumably uses AI to generate or enrich lead data before returning the created client object. The returned client is appended to the existing client list in state.

<SwmSnippet path="/crm-client/src/pages/ClientsPage.tsx" line="29">

---

Using GET with a body is unusual and may be a backend constraint or a quick prototype choice. The key point is that the AI-powered endpoint is integrated transparently in the add flow.

```
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
```

---

</SwmSnippet>

# updating client status and deletion

Status changes are sent as PATCH requests with the new status in the body. The updated client returned from the server replaces the old client in state, keeping the UI in sync.

Deletion asks for user confirmation before sending a DELETE request. On success, the client is removed from state.

<SwmSnippet path="/crm-client/src/pages/ClientsPage.tsx" line="41">

---

This approach keeps client state consistent with server state after mutations.

```
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
```

---

</SwmSnippet>

# filtering and UI composition

Filtering is done client-side by comparing each client's status to the selected filter. The filtered list is passed to the <SwmToken path="/crm-client/src/pages/ClientsPage.tsx" pos="6:2:2" line-data="import ClientsTable from &quot;../components/ClientsTable&quot;;">`ClientsTable`</SwmToken> component.

The page composes several components: a form for adding clients, a status filter dropdown, the clients table, and an actions panel that appears when a client is selected.

<SwmSnippet path="/crm-client/src/pages/ClientsPage.tsx" line="62">

---

This modular structure separates concerns and keeps the page code focused on data flow and state management.

```
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
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBb3JlbnctdGVzdCUzQSUzQW9yZW53LXN3aW1t" repo-name="orenw-test"><sup>Powered by [Swimm](https://staging.swimm.cloud/)</sup></SwmMeta>
