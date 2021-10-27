import Link from "next/link"
import Image from "next/image"
import css from "../styles/header.module.css"

export default function Header() {
    return (<header id="top">
        <nav className={css.header}>
            <div className={css.logo}>
                <Image src="/logo.gif" alt="elf logo" width={50} height={50}/>
            </div>
            <div className={css.title}>
                <Link href="/">
                    Elf's infosec blog
                </Link>
            </div>
            <div className={css.right}>
                <Link href="/articles">Articles</Link>
            </div>
        </nav>
    </header>)
}