interface Props {
  value: string;
  onChange: (status: string) => void;
  options: string[];
}

export default function StatusFilter({ value, onChange, options }: Props) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>סנן לפי סטטוס: </label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="all">הכל</option>
        {options.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
