import { Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Navbar from "../components/navbar";
import Redirect from "../components/util/redirect";
import { useAccountStore, useAPIStore, useFranchiseStore } from "../store";

const Layout = ({ children }) => {
  const account = useAccountStore((state) => state.account);
  const setAccount = useAccountStore((state) => state.setAccount);
  const setFranchise = useFranchiseStore((state) => state.setFranchise);
  const setSlug = useAPIStore((state) => state.setSlug);
  const setToken = useAPIStore((state) => state.setToken);
  const [accountVerified, setAccountVerified] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(async () => {
    const isAccountStored = Boolean(Object.keys(account).length);
    if (isAccountStored) {
      setAccountVerified(Boolean(Object.keys(account).length));
    } else {
      const slug = window.location.host.split(".")[0];
      let expiry;
      let token;
      const sessionToken = sessionStorage.getItem(`${slug}-token`);
      if (sessionToken) {
        token = sessionToken;
        expiry = sessionStorage.getItem(`${slug}-token-expiry`);
      } else {
        const localToken = localStorage.getItem(`${slug}-token`);
        if (localToken) {
          token = localToken;
          expiry = localStorage.getItem(`${slug}-token-expiry`);
        }
      }
      console.log(token);
      if (token) {
        if (expiry > new Date() / 1000) {
          const res = await fetch(`https://${slug}.api.lvh.me/admin/auth/`, {
            headers: { authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            let data = await res.json();
            setAccount(data.account);
            setFranchise(data.franchise);
            setSlug(slug);
            setToken({
              key: token,
              expiresAt: data.token.expiresAt,
            });
            setAccountVerified(true);
          }
        } else {
          sessionStorage.removeItem(`${slug}-token`);
          sessionStorage.removeItem(`${slug}-token-expiry`);
          localStorage.removeItem(`${slug}-token`);
          localStorage.removeItem(`${slug}-token-expiry`);
        }
      }
    }
    setIsInitialLoad(false);
  }, []);

  if (typeof window === "undefined" || isInitialLoad) {
    return <></>;
  } else if (accountVerified) {
    return (
      <Stack
        direction="column"
        w="100vw"
        h="100vh"
        spacing={8}
        bg="gray.100"
        alignItems="start"
        justifyContent="start"
      >
        <Navbar />
        <Stack
          direction="column"
          w="full"
          h="100vh"
          p={4}
          spacing={4}
          bg="gray.100"
          alignItems="start"
          justifyContent="start"
          as="main"
        >
          {children}
        </Stack>
      </Stack>
    );
  } else {
    return <Redirect to="/auth/signin" />;
  }
};

export default Layout;
