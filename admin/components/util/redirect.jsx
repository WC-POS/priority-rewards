import { useRouter } from "next/router";
import { useEffect } from "react";

const Redirect = (props) => {
  const router = useRouter();
  useEffect(() => {
    router.push(props.to);
  }, []);
  return <></>;
};

export default Redirect;
