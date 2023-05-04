import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store";

import { WagmiConfig, configureChains, createClient } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

import { useRouter } from "next/router";

const chains = [arbitrum, mainnet, polygon];
const projectId = process.env.YOUR_PROJECT_ID as string;

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLandingPage = router.pathname === "/index" || router.pathname === "/";
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <Provider store={store}>
          {isLandingPage ? (
            <Component {...pageProps} />
          ) : (
            <DashboardLayout>
              <Component {...pageProps} />
            </DashboardLayout>
          )}
        </Provider>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
