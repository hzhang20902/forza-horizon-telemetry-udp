"use client"

import { useState, useEffect } from "react"
import { useTelemetryData, type TelemetryData } from "@/lib/data/websocket"
import { useDemoData } from "@/lib/data/demoData"
import { DataDashboard } from "@/components/dashboard/DataDashboard"
import { CarDashboard } from "@/components/dashboard/CarDashboard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Dashboard() {
  const [view, setView] = useState<"data" | "car">("data")
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [liveTelemetryData, wsState] = useTelemetryData()
  const demoTelemetryData = useDemoData()

  const telemetryData: TelemetryData | null = isDemoMode ? demoTelemetryData : liveTelemetryData

  useEffect(() => {
    if (wsState.error && !isDemoMode) {
      console.error("WebSocket error:", wsState.error)
    }
  }, [wsState.error, isDemoMode])

  const renderConnectionStatus = () => {
    if (isDemoMode) return null

    if (wsState.error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to connect to telemetry server. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <div className={`px-3 py-1 rounded-full ${wsState.isConnected ? "bg-green-500" : "bg-yellow-500"} text-white`}>
        {wsState.isConnected ? "Connected" : "Connecting..."}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Forza Horizon 5 Telemetry</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="demo-mode" checked={isDemoMode} onCheckedChange={setIsDemoMode} />
                <Label htmlFor="demo-mode">Demo Mode</Label>
              </div>
              <Button onClick={() => setView(view === "data" ? "car" : "data")}>
                Switch to {view === "data" ? "Car" : "Data"} View
              </Button>
            </div>
          </div>
          {renderConnectionStatus()}
        </div>
        {telemetryData ? (
          view === "data" ? (
            <DataDashboard data={telemetryData} />
          ) : (
            <CarDashboard data={telemetryData} />
          )
        ) : (
          <div className="text-center text-2xl">
            {isDemoMode ? "Loading demo data..." : "Waiting for telemetry data..."}
          </div>
        )}
      </div>
    </div>
  )
}

