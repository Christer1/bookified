"use client";
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navItems = [
    {label: "Library", href: "/"},

    {label: "Add New", href: "/books/new"},
]

const NavBar = () => {
    const pathName = usePathname();
  return (
   <header className="w-full fixed z-50 bg-('--bg-primary')">
    <div className="wrapper navbar-height py-4 flex">
        <Link href="/" className="flex gap-0.5 items-center">
            <Image src="/assets/logo.png" alt="Bookified" width={42} height={26} />
            <span className="logo-text">Bookified</span>
        </Link>
    </div>

    <nav className="w-fit flex items-center gap-7.5">
        {navItems.map(({label, href}) => {
           const isActive = pathName === href;
           return (
            <Link className={`nav-link-base ${isActive ? 'nav-link-active' : 'text-black hover:opacity-70'}`} key={label} href={href}>
                {label}
            </Link>
           )
        })}

    </nav>
   </header>
  ) 
}

export default NavBar