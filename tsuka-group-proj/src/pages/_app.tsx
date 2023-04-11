import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <DashboardLayout>
        <Component {...pageProps} />
      </DashboardLayout>
    </Provider>
  );
}
