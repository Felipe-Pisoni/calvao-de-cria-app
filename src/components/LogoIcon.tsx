"use client"
import Link from "next/link";
// import Logo from "";

export const LogoIcon = () => (
  <Link href="/">
    <img src={'/assets/Logo.svg'} alt="Logo" className="cursor-pointer" />
  </Link>
);
