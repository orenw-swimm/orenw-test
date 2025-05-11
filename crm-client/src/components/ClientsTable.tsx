import { Client } from "../types/types";

interface Props {
  clients: Client[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const statuses = [
  "חדש",
  "בקשר",
  "פגישה",
  "הצעה",
  "המתנה",
  "נסגר",
  "לא רלוונטי",
];

export default function ClientsTable({
  clients,
  onSelect,
  onDelete,
  onStatusChange,
}: Props) {
  return (
    <table
      border={1}
      cellPadding={8}
      cellSpacing={0}
      style={{ width: "100%", marginTop: "1rem" }}
    >
      <thead>
        <tr>
          <th>שם</th>
          <th>טלפון</th>
          <th>אימייל</th>
          <th>מקור</th>
          <th>סטטוס</th>
          <th>נוצר</th>
          <th>פעולות</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.id}>
            <td>
              <button onClick={() => onSelect(client.id)}>
                🔍 {client.name}
              </button>
            </td>
            <td>{client.phone}</td>
            <td>{client.email}</td>
            <td>{client.source}</td>
            <td>
              <select
                value={client.status}
                onChange={(e) => onStatusChange(client.id, e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </td>
            <td>{new Date(client.createdAt).toLocaleDateString()}</td>
            <td>
              <button onClick={() => onDelete(client.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
