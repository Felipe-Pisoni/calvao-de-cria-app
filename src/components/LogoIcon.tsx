import { Link } from "react-router-dom";
import Logo from "../assets/Logo.svg";

export const LogoIcon = () => (
  <Link to="/">
    <img src={Logo} alt="Logo" className="cursor-pointer" />
  </Link>
);
