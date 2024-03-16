import { createBrowserRouter } from "react-router-dom";
import RouteGuard from "../components/RouteGuard";
import ForgotPasswordPage from "./ForgotPasswordPage";
import HomePage from "./HomePage";
import LogInPage from "./LogInPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";
import RootPage from "./RootPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    children: [
      {
        path: "/login",
        element: (
          <RouteGuard condition="loggedOut">
            <LogInPage />
          </RouteGuard>
        ),
      },
      {
        path: "/register",
        element: (
          <RouteGuard condition="loggedOut">
            <RegisterPage />
          </RouteGuard>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <RouteGuard condition="loggedOut">
            <ForgotPasswordPage />
          </RouteGuard>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <RouteGuard condition="loggedOut">
            <ResetPasswordPage />
          </RouteGuard>
        ),
      },
      {
        path: "/home",
        element: (
          <RouteGuard condition="loggedIn">
            <HomePage />
          </RouteGuard>
        ),
      },
    ],
  },
]);

export default router;
