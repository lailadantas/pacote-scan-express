
declare module 'quagga' {
  interface QuaggaConfig {
    inputStream: {
      name: string;
      type: string;
      target: HTMLElement | string;
      constraints: {
        width: { min: number; ideal: number; max: number };
        height: { min: number; ideal: number; max: number };
        facingMode: string;
        aspectRatio: { min: number; max: number };
      };
    };
    locator: {
      patchSize: string;
      halfSample: boolean;
    };
    numOfWorkers: number;
    frequency: number;
    decoder: {
      readers: string[] | readonly string[];
    };
    locate: boolean;
  }

  interface QuaggaResult {
    codeResult: {
      code: string;
    };
  }

  interface Quagga {
    init(config: QuaggaConfig, callback: (err: any) => void): void;
    start(): void;
    stop(): void;
    onDetected(callback: (result: QuaggaResult) => void): void;
  }

  const Quagga: Quagga;
  export default Quagga;
}
