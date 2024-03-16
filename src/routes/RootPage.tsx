import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  JWT_KEY,
  deleteFromLocalStorage,
  getFromLocalStorage,
} from "../helpers/localStorage";
import { getData } from "../services/fetcher";

export default function RootPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = getFromLocalStorage(JWT_KEY);
    if (jwt) {
      getData("/api/users/me")
        .then((data) => {
          console.log("data", data);
        })
        .catch(() => {
          deleteFromLocalStorage(JWT_KEY);
          navigate("/login");
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <>
      <Outlet />
    </>
  );
}
