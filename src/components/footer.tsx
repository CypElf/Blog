import React from "react"
import { StaticImage } from "gatsby-plugin-image"

export default function Footer() {
    return (<footer className="mt-14 bg-gray-2 flex justify-around items-center py-5">
        <small className="text-xl">© 2021 Elf</small>
        <div className="flex items-center flex-col lg:flex-row m-0 font-light text-lg">
            <div className="mb-2 lg:mb-0 lg:mr-4">
                <StaticImage src="../resources/images/github.svg" alt="github logo" width={30} height={30}/>
            </div>
            This blog is {'\u200B'}<a className="underline" href="https://github.com/CypElf/Blog">open source</a>
        </div>
        <a className="hidden sm:block" href="#top"><StaticImage src="../resources/images/top.png" alt="return to top arrow" width={40} height={40}/></a>
    </footer>)
}