import { SubscriptionClient } from 'subscriptions-transport-ws';

const token = "BQYhGqHd1MptOvjXeIUPAQ1L24huNj1l"; // get your auth token from somewhere
const GRAPHQL_ENDPOINT = 'wss://streaming.bitquery.io/graphql';
const webSocketImpl = typeof window !== 'undefined' ? window.WebSocket : require('ws');

export const createSubscriptionClient = () => {
  const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
    reconnect: true,
    connectionParams: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    },
    webSocketImpl
  );

  return client;
};
