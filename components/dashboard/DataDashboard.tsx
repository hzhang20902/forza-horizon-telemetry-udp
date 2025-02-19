import type { TelemetryData } from "@/lib/data/websocket"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataDashboardProps {
  data: TelemetryData | null
}

export function DataDashboard({ data }: DataDashboardProps) {
  if (!data) {
    return <div className="text-center text-2xl">Waiting for telemetry data...</div>
  }

  const formatValue = (value: number | undefined, decimals = 1, unit = ""): string => {
    return value !== undefined ? `${value.toFixed(decimals)}${unit}` : "N/A"
  }

  const dataRows = [
    { name: "Speed", values: [formatValue(data.speed?.mph, 1, " mph"), formatValue(data.speed?.kph, 1, " km/h")] },
    { name: "RPM", values: [formatValue(data.rpm, 0)] },
    { name: "Gear", values: [data.gear?.toString() ?? "N/A"] },
    { name: "Steering Angle", values: [formatValue(data.steeringAngle, 1, "°")] },
    { name: "Throttle", values: [formatValue(data.throttle && data.throttle * 100, 0, "%")] },
    { name: "Brake", values: [formatValue(data.brake && data.brake * 100, 0, "%")] },
    { name: "Clutch", values: [formatValue(data.clutch && data.clutch * 100, 0, "%")] },
    { name: "Fuel", values: [`${formatValue(data.fuel?.amount, 1)} / ${formatValue(data.fuel?.capacity, 1)} L`] },
    {
      name: "Position",
      values: [
        `X: ${formatValue(data.position?.x, 2)}`,
        `Y: ${formatValue(data.position?.y, 2)}`,
        `Z: ${formatValue(data.position?.z, 2)}`,
      ],
    },
    {
      name: "Acceleration",
      values: [
        `X: ${formatValue(data.acceleration?.x, 2, " m/s²")}`,
        `Y: ${formatValue(data.acceleration?.y, 2, " m/s²")}`,
        `Z: ${formatValue(data.acceleration?.z, 2, " m/s²")}`,
      ],
    },
    {
      name: "Velocity",
      values: [
        `X: ${formatValue(data.velocity?.x, 2, " m/s")}`,
        `Y: ${formatValue(data.velocity?.y, 2, " m/s")}`,
        `Z: ${formatValue(data.velocity?.z, 2, " m/s")}`,
      ],
    },
    {
      name: "Angular Velocity",
      values: [
        `X: ${formatValue(data.angularVelocity?.x, 2, " rad/s")}`,
        `Y: ${formatValue(data.angularVelocity?.y, 2, " rad/s")}`,
        `Z: ${formatValue(data.angularVelocity?.z, 2, " rad/s")}`,
      ],
    },
    {
      name: "Tire Temperature",
      values: [
        `FL: ${formatValue(data.tireTemperature?.fl, 1, "°C")}`,
        `FR: ${formatValue(data.tireTemperature?.fr, 1, "°C")}`,
        `RL: ${formatValue(data.tireTemperature?.rl, 1, "°C")}`,
        `RR: ${formatValue(data.tireTemperature?.rr, 1, "°C")}`,
      ],
    },
    {
      name: "Tire Pressure",
      values: [
        `FL: ${formatValue(data.tirePressure?.fl, 1, " psi")}`,
        `FR: ${formatValue(data.tirePressure?.fr, 1, " psi")}`,
        `RL: ${formatValue(data.tirePressure?.rl, 1, " psi")}`,
        `RR: ${formatValue(data.tirePressure?.rr, 1, " psi")}`,
      ],
    },
    {
      name: "Suspension Travel",
      values: [
        `FL: ${formatValue(data.suspensionTravel?.fl, 2, " m")}`,
        `FR: ${formatValue(data.suspensionTravel?.fr, 2, " m")}`,
        `RL: ${formatValue(data.suspensionTravel?.rl, 2, " m")}`,
        `RR: ${formatValue(data.suspensionTravel?.rr, 2, " m")}`,
      ],
    },
    { name: "Engine Temperature", values: [formatValue(data.engineTemperature, 1, "°C")] },
    { name: "Oil Temperature", values: [formatValue(data.oilTemperature, 1, "°C")] },
    { name: "Oil Pressure", values: [formatValue(data.oilPressure, 1, " psi")] },
    { name: "Boost", values: [formatValue(data.boost, 2, " psi")] },
    { name: "Power", values: [formatValue(data.power, 0, " hp")] },
    { name: "Torque", values: [formatValue(data.torque, 0, " Nm")] },
    {
      name: "Lap Time",
      values: [
        `Current: ${formatTime(data.lapTime?.current)}`,
        `Last: ${formatTime(data.lapTime?.last)}`,
        `Best: ${formatTime(data.lapTime?.best)}`,
      ],
    },
    { name: "Race Position", values: [data.racePosition?.toString() ?? "N/A"] },
    { name: "Lap Number", values: [data.lapNumber?.toString() ?? "N/A"] },
    { name: "Distance Traveled", values: [formatValue(data.distanceTraveled, 2, " km")] },
  ]

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Data Point</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.values.join(" | ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function formatTime(seconds: number | undefined): string {
  if (seconds === undefined) return "N/A"
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toFixed(3).padStart(6, "0")}`
}

