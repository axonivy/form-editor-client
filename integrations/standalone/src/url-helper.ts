export namespace URLParams {
  export function parameter(key: string): string | undefined {
    const param = new URLSearchParams(window.location.search).get(key);
    return param !== null ? decodeURIComponent(param) : undefined;
  }

  export function app(): string {
    return parameter('app') ?? '';
  }

  export function pmv(): string {
    return parameter('pmv') ?? '';
  }

  export function file(): string {
    return parameter('file') ?? '';
  }

  export function webSocketBase(): string {
    return `${isSecureConnection() ? 'wss' : 'ws'}://${server()}`;
  }

  const isSecureConnection = () => {
    const secureParam = parameter('secure');
    if (secureParam === 'true') {
      return true;
    }
    if (secureParam === 'false') {
      return false;
    }
    return window.location.protocol === 'https:';
  };

  const server = () => {
    return parameter('server') ?? basePath();
  };

  const basePath = () => {
    return 'localhost:8081';
  };
}
