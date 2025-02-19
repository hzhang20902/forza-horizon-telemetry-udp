import type { TelemetryData } from "@/lib/data/websocket"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface CarDashboardProps {
  data: TelemetryData | null
}

const RADIAN = Math.PI / 180
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const CustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${name}: ${value?.toFixed(0) ?? "N/A"}`}
    </text>
  )
}

export function CarDashboard({ data }: CarDashboardProps) {
  if (!data) {
    return <div className="text-center text-2xl">Waiting for telemetry data...</div>
  }

  const speedData = [
    { name: "Speed", value: data.speed?.mph ?? 0 },
    { name: "", value: 200 - (data.speed?.mph ?? 0) },
  ]

  const rpmData = [
    { name: "RPM", value: data.rpm ?? 0 },
    { name: "", value: 8000 - (data.rpm ?? 0) },
  ]

  return (
    <div className="flex flex-col items-center bg-gray-900 p-8 rounded-lg">
      <div className="flex justify-between w-full mb-8">
        <div className="w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={speedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {speedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rpmData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {rpmData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex justify-between w-full">
        <div className="text-white text-center">
          <p className="text-2xl font-bold">Gear</p>
          <p className="text-4xl">{data.gear ?? "N/A"}</p>
        </div>
        <div className="text-white text-center">
          <p className="text-2xl font-bold">Fuel</p>
          <p className="text-4xl">
            {data.fuel?.amount !== undefined ? `${(data.fuel.amount * 100).toFixed(0)}%` : "N/A"}
          </p>
        </div>
      </div>
    </div>
  )
}

