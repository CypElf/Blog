import React, { useState } from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

export default function Header() {
    const [menuBurgerDeployed, setMenuBurgerDeployed] = useState(false)

    return (<header id="top">
        <nav className="flex justify-start items-center bg-gray-2 p-3 shadow-md">
            <StaticImage src="../resources/images/logo_static_rounded.png" alt="logo" width={50} height={50} className="mr-4"/>
            <div className="md:mr-auto text-2xl md:text-3xl">
                <Link to="/">
                    Elf's blog
                </Link>
            </div>
            <div className="md:hidden text-3xl ml-auto" onClick={() => setMenuBurgerDeployed(!menuBurgerDeployed)}>☰</div>
            <div className={`${!menuBurgerDeployed ? "hidden" : ""}  w-44 h-full flex flex-col items-center px-4 p-3 bg-gray-2 z-10 fixed md:static top-0 left-0 md:flex md:flex-row md:items-center md:w-auto`} id="menu">
                <div className="md:hidden self-end text-3xl mb-5" onClick={() => setMenuBurgerDeployed(false)}>&times;</div>
                <ul className="md:flex md:justify-between mb-3 md:m-0">
                    <li className="md:block text-2xl font-light mr-6 mb-3 md:mb-0"><Link to="/articles">Articles</Link></li>
                    <li className="md:block text-2xl font-light mr-3 md:m-0"><Link to="/whoami">Whoami</Link></li>
                </ul>
            </div>
        </nav>
    </header>)
}