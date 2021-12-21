import { Container, Stack } from "@chakra-ui/react";
import { useAPIStore, useAccountStore, useFranchiseStore } from "../store";
import { useEffect, useState } from "react";

import Navbar from "../components/navbar";
import Redirect from "../components/util/redirect";

const Layout = ({ children }) => {
  const account = useAccountStore((state) => state.account);
  const [errorRedirect, setErrorRedirect] = useState(false);
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
      if (token) {
        if (expiry > new Date() / 1000) {
          try {
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
          } catch (err) {
            console.log(err);
            setAccountVerified(false);
            setErrorRedirect(true);
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
        minH="100vh"
        spacing={4}
        alignItems="start"
        justifyContent="start"
      >
        <Navbar />
        <Stack
          w="full"
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          p={{ base: 0, md: 4 }}
        >
          <Container centerContent as="main" maxW="container.xl">
            <Stack
              direction="column"
              w="full"
              h="full"
              spacing={4}
              pb={8}
              alignItems="start"
              justifyContent="center"
            >
              {children}
            </Stack>
          </Container>
        </Stack>
      </Stack>
    );
  } else if (errorRedirect) {
    return <Redirect to="/404" />;
  } else {
    return <Redirect to="/auth/signin" />;
  }
};

export default Layout;
