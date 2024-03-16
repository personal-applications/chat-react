import React from "react";
import Redirect from "../components/Redirect";
import { JWT_KEY, getFromLocalStorage } from "./localStorage";

export type RouteGuardCondition = "loggedIn" | "loggedOut";

export default function createRouteGuard(
  C: () => React.JSX.Element,
  condition: RouteGuardCondition,
): React.JSX.Element {
  const jwt = getFromLocalStorage(JWT_KEY);
  if (!jwt && condition === "loggedIn") {
    return <Redirect to="/login" />;
  }
  if (jwt && condition === "loggedOut") {
    return <Redirect to="/home" />;
  }
  return <C />;
}
