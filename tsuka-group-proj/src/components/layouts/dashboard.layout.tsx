import { HeaderMenuButton } from "@/components/ui/buttons/header-menu.button";
import { HeaderNotificationButton } from "@/components/ui/buttons/header-notification.button";
import { HeaderWalletButton } from "@/components/ui/buttons/header-wallet.button";
import Head from "next/head";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { HeaderLinkButton } from "../ui/buttons/header-link.button";

export const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const navLinks = [
    {
      title: "Homepage",
      path: "/",
    },
    {
      title: "My Orders",
      path: "/my-orders",
    },
    {
      title: "Settings",
      path: "/settings",
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
      <main className="bg-tsuka-700 min-h-screen">
        <nav>
          <div className="w-full px-2 sm:px-6 lg:px-8 border-b border-tsuka-500">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center sm:justify-start">
                <div className="flex flex-shrink-0 items-center px-4 md:px-2">
                  <p className="text-xl font-extrabold text-tsuka-100 ">Logo</p>
                  {/* <img
                    className="block h-8 w-auto lg:hidden"
                    src=""
                    alt="Logo"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src=""
                    alt="Logo"
                  /> */}
                </div>
                <div className="hidden sm:ml-6 sm:block">
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
              <div className="absolute inset-y-0 right-0 flex flex-row-reverse md:flex-row items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <HeaderMenuButton
                  callback={() => console.log("notification click")}
                />
                <HeaderNotificationButton
                  callback={() => console.log("notification click")}
                />
                <HeaderWalletButton
                  callback={() => console.log("wallet click")}
                  wallet={{ label: "Darkdakgo.eth" }}
                />
              </div>
            </div>
          </div>
          {/* Mobile menu, show/hide based on menu state. */}
          <div className="sm:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2">
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
        </nav>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </>
  );
};
