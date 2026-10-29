import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function StudentChart({ data }) {

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Student Growth
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <AreaChart data={data}>

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="total"
            stroke="#2563eb"
            fill="#93c5fd"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}