import React, { useEffect } from "react";
import { HeaderMenuButton } from "@/components/ui/buttons/header-menu.button";
import { HeaderNotificationButton } from "@/components/ui/buttons/header-notification.button";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";
import { HeaderLinkButton } from "../ui/buttons/header-link.button";
import { Notifications } from "@/components/ui/tokens/notifications.token";
import { INotification } from "@/global";

import { Web3Button } from "@web3modal/react";

export const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [showNotify, setShowNotify] = useState<boolean>(false);

  const [network, setNetwork] = useState("");

  const handleChainChanged = (chainId: any) => {
    setNetwork(chainId);
  };

  const switchToEthereum = async () => {
    try {
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError?.code === 4902) {
        try {
          await window.ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [{ chainId: "0x1" }],
            rpcUrls: ["http://localhost:3000/"],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  };

  // useEffects
  useEffect(() => {
    if (network && network !== "0x1") {
      switchToEthereum();
    }
  }, [network]);

  useEffect(() => {
    if (window.ethereum !== undefined) {
      window.ethereum?.on("chainChanged", handleChainChanged);
    }
  }, []);

  const router = useRouter();

  const navLinks = [
    {
      title: "Homepage",
      path: "/homepage",
    },
    {
      title: "My Orders",
      path: "/my-orders",
    },
    {
      title: "Settings",
      path: "/#",
    },
  ];

  let notifications: INotification[] = [
    {
      buy: true,
      amount: 1.8493004,
      asset: "ETH",
      executedAt: 45.23,
    },
    {
      buy: false,
      amount: 5.5393054,
      asset: "ETH",
      executedAt: 605.04,
    },
    {
      buy: true,
      amount: 2.8453044,
      asset: "ETH",
      executedAt: 403.244,
    },
    {
      buy: true,
      amount: 1.8493004,
      asset: "ETH",
      executedAt: 45.23,
    },
    {
      buy: true,
      amount: 2.8453044,
      asset: "ETH",
      executedAt: 403.244,
    },
  ];

  return (
    <>
      <Head>
        <title>Tsuka Group</title>
        <meta name="description" content="Tsuka Group Project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <nav>
          <div className="w-full px-2 md:px-6 lg:px-8 border-b border-tsuka-500">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center md:justify-start">
                <div className="flex flex-shrink-0 items-center pl-2 xs:px-4 md:px-2">
                  <p className="text-xl font-extrabold text-tsuka-100 ">
                    <Image
                      className="hidden sm:block"
                      src="/logos/logo.png"
                      alt="logo"
                      width={111}
                      height={40}
                    />
                    <Image
                      className="sm:hidden"
                      src="/logos/logo_icon.png"
                      alt="logo"
                      width={40}
                      height={40}
                    />
                  </p>
                </div>
                <div className="hidden md:ml-6 md:block">
                  <div className="flex px-10 space-x-4">
                    {navLinks?.map(({ path, title }) => (
                      <HeaderLinkButton
                        key={path}
                        path={path}
                        title={title}
                        active={path === router.pathname}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex flex-row-reverse md:flex-row items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
                <HeaderMenuButton
                  menuCollapsed={menuCollapsed}
                  callback={() => setMenuCollapsed(!menuCollapsed)}
                />
                <HeaderNotificationButton
                  callback={() => console.log("NotificationButton click")}
                  showNotify={showNotify}
                  setShowNotify={setShowNotify}
                />
                <Web3Button />
              </div>
            </div>
          </div>
          {/* Mobile menu, show/hide based on menu state. */}
          {!menuCollapsed && (
            <div className="md:hidden" id="mobile-menu">
              <div className="absolute z-20 w-full bg-tsuka-500 space-y-1 px-4 pb-3 pt-2 shadow-lg shadow-tsuka-700">
                {navLinks?.map(({ path, title }, idx) => (
                  <div
                    className={`flex justify-center${
                      idx > 0 ? " border-t border-t-tsuka-400" : ""
                    }`}
                    key={idx}
                  >
                    <HeaderLinkButton
                      key={path}
                      path={path}
                      title={title}
                      active={path === router.pathname}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {showNotify && (
            <Notifications
              notifications={notifications}
              closeNotification={() => setShowNotify(false)}
            />
          )}
        </nav>
        <div className="">{children}</div>
      </main>
    </>
  );
};
