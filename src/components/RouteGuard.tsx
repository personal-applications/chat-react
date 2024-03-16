import { ReactNode, useEffect } from "react";
import { JWT_KEY, getFromLocalStorage } from "../helpers/localStorage";
import { useNavigate } from "react-router-dom";

export type RouteGuardCondition = "loggedIn" | "loggedOut";

export type Prop = {
  children: ReactNode;
  condition: RouteGuardCondition;
};

export default function RouteGuard({ children, condition }: Prop) {
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = getFromLocalStorage(JWT_KEY);
    if (!jwt && condition === "loggedIn") {
      navigate("/login");
    } else if (jwt && condition === "loggedOut") {
      navigate("/home");
    }
  }, [condition, navigate]);

  return <>{children}</>;
}
