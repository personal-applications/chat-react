import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RegisterPage />,
  },
]);

export default router;
