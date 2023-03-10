export function rpcEndpoint(endPoints: string) {
  let rpcEndpoint = endPoints;
  if (rpcEndpoint.includes("|")) {
    const endpoints = rpcEndpoint.split("|");
    rpcEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  }

  return rpcEndpoint;
}

export const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getStorage = (key: string) => {
  const data = localStorage.getItem(key);

  return data ? JSON.parse(data) : undefined;
};
