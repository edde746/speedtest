declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface SpeedTestResult {
    type: string;
    timestamp: string;
    ping: Ping;
    download: DataTransfer;
    upload: DataTransfer;
    packetLoss: number;
    isp: string;
    interface: NetworkInterface;
    server: Server;
    result: TestResult;
  }

  interface Ping {
    jitter: number;
    latency: number;
    low: number;
    high: number;
  }

  interface DataTransfer {
    bandwidth: number;
    bytes: number;
    elapsed: number;
    latency: Latency;
  }

  interface Latency {
    iqm: number;
    low: number;
    high: number;
    jitter: number;
  }

  interface NetworkInterface {
    internalIp: string;
    name: string;
    macAddr: string;
    isVpn: boolean;
    externalIp: string;
  }

  interface Server {
    id: number;
    host: string;
    port: number;
    name: string;
    location: string;
    country: string;
    ip: string;
  }

  interface TestResult {
    id: string;
    url: string;
    persisted: boolean;
  }
}

export {};
