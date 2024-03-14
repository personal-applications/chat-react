import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Prop = {
  to: string;
};

export default function Redirect({ to }: Prop) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace: true });
  }, [navigate, to]);

  return undefined;
}
