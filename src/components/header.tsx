import React, { useState } from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { Helmet } from "react-helmet"
import icon from "../resources/images/logo_static_rounded.png" // typescript complains but there's literally NO OTHER WAY and it works anyway

export default function Header() {
    const [menuBurgerDeployed, setMenuBurgerDeployed] = useState(false)

    return (<>
        <Helmet>
            <link rel="icon" href={icon}/>
        </Helmet>
        <header id="top">
            <nav className="flex justify-start items-center bg-gray-2 p-3 shadow-md">
                <StaticImage src="../resources/images/logo_static_rounded.png" alt="logo" width={50} height={50} className="mr-4"/>
                <div className="hover:text-green-1 md:mr-auto text-2xl md:text-3xl">
                    <Link to="/">
                        Elf's blog
                    </Link>
                </div>
                <div className="md:hidden text-3xl ml-auto" onClick={() => setMenuBurgerDeployed(!menuBurgerDeployed)}>☰</div>
                <div className={`${!menuBurgerDeployed ? "hidden" : ""} w-44 h-full flex flex-col items-center px-4 p-3 bg-gray-3 shadow-2xl z-10 fixed md:static top-0 right-0 md:flex md:flex-row md:items-center md:w-auto md:bg-gray-2 md:shadow-none`} id="menu">
                    <div className="md:hidden self-end text-3xl mb-5" onClick={() => setMenuBurgerDeployed(false)}>&times;</div>
                    <ul className="md:flex md:justify-between mb-3 md:m-0">
                        <li className="hover:text-green-1 md:block text-2xl font-light mr-6 md:mr-12 mb-5 md:mb-0"><Link to="/articles">Articles</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    </>)
}