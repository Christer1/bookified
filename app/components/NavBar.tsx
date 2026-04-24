"use client";
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, Show, UserButton, useUser } from "@clerk/nextjs";


const navItems = [
    {label: "Library", href: "/"},

    {label: "Add New", href: "/books/new"},
]

const NavBar = () => {
    const pathName = usePathname();
    const { user } = useUser();
  return (
   <header className="w-full fixed top-0 left-0 z-50 bg-[#FDF9F3] shadow-sm">
    <div className="wrapper navbar-height py-4 flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex gap-2 items-center">
            <Image src="/assets/logo.png" alt="Bookified" width={42} height={26} />
            <span className="logo-text text-xl font-bold">Bookified</span>
        </Link>

        <nav className="flex items-center gap-8">
            <div className="flex items-center gap-6">
                {navItems.map(({label, href}) => {
                   const isActive = pathName === href;
                   return (
                    <Link className={`nav-link-base ${isActive ? 'nav-link-active font-semibold' : 'text-gray-700 hover:text-black hover:opacity-70'}`} key={label} href={href}>
                        {label}
                    </Link>
                   )
                })}
            </div>
            
            <div className='flex gap-4 items-center'>
                <Show when="signed-out">
                    <div className="flex gap-4 items-center">
                        <SignInButton />
                        <SignUpButton />
                    </div>
                </Show>
                <Show when="signed-in">
                        <UserButton />
                    <div className='flex items-center gap-3 nav-user-link'>
                        {user?.firstName && (
                            <Link className='nav-user-name font-medium text-sm' href={`/subscriptions`}>{user.firstName}</Link>
                        )}
                    </div>
                </Show>
            </div>
        </nav>
    </div>
   </header>
  ) 
}

export default NavBar