const dgram = require("dgram")
const WebSocket = require("ws")

const UDP_PORT = 8000 // Match this with the "Data Out IP Port" in Forza Horizon 5
const WS_PORT = 8080 // This should match the port in your websocket.ts file

const udpServer = dgram.createSocket("udp4")
const wss = new WebSocket.Server({ port: WS_PORT })

udpServer.on("message", (msg) => {
  // Parse the UDP message from Forza Horizon 5
  const data = parseForzeHorizon5Data(msg)

  // Broadcast the parsed data to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
})

udpServer.bind(UDP_PORT)

console.log(`UDP server listening on port ${UDP_PORT}`)
console.log(`WebSocket server listening on port ${WS_PORT}`)

function parseForzeHorizon5Data(buffer) {
  // This is a simplified parser. You'll need to adjust this based on the actual data format from Forza Horizon 5
  return {
    speed: buffer.readFloatLE(256),
    rpm: buffer.readFloatLE(16),
    gear: buffer.readUInt8(319),
    steeringAngle: buffer.readFloatLE(320),
    throttle: buffer.readFloatLE(320),
    brake: buffer.readFloatLE(320),
    fuel: buffer.readFloatLE(252),
  }
}

