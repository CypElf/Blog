import Link from "next/link"
import Image from "next/image"
import css from "../styles/header.module.css"

export default function Header() {
    return (<header id="top">
        <nav className={css.header}>
            <div className={css.logo}>
                <Image src="/logo.png" alt="cypelf logo" width={45} height={45}/>
            </div>
            <div className={css.title}>
                <Link href="/">
                    Elf&apos;s infosec blog
                </Link>
            </div>
            <div className={css.right}>
                <Link href="/articles">Articles</Link>
            </div>
        </nav>
    </header>)
}