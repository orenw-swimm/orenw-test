import { useState } from "react";
import { Client } from "../types/types";

interface Props {
  onAdd: (
    data: Omit<Client, "id" | "status" | "createdAt" | "updatedAt">
  ) => void;
}
export default function ClientForm({ onAdd }: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "ידני", // ← ברירת מחדל
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(form);
    setForm({ name: "", phone: "", email: "", source: "ידני" });
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <input
        placeholder="שם"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        placeholder="טלפון"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />
      <input
        placeholder="אימייל"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <select
        value={form.source}
        onChange={(e) => setForm({ ...form, source: e.target.value })}
      >
        <option value="ידני">ידני</option>
        <option value="טלגרם">טלגרם</option>
        <option value="פייסבוק">פייסבוק</option>
      </select>
      <button type="submit">➕ הוסף לקוח</button>
    </form>
  );
}
