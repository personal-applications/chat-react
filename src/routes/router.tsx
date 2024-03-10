import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import LogInPage from "./LogInPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LogInPage />,
  },
]);

export default router;
