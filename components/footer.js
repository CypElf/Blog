import Image from "next/image"
import css from "../styles/footer.module.css"

export default function Footer() {
    return (<footer className={css.footer}>
        <small>© 2021 Elf</small>
        <p>
            <div className={css.github}>
                <Image src="/github.svg" alt="github logo" width={30} height={30}/>
            </div>
            This blog is {'\u200B'}<a href="https://github.com/CypElf/Blog">open source</a>
        </p>
        <a href="#top"><Image className={css.top} src="/top.png" alt="return to top arrow" width={40} height={40}/></a>
    </footer>)
}