import React from "react"
import { Helmet } from "react-helmet"
import Header from "../components/header"
import Footer from "../components/footer"

export default function Articles() {
    return (<>
        <Helmet>
            <title>Elf's blog - who am I</title>
            <meta name="description" content="Who am I and other informations about me"/>
        </Helmet>
        <Header/>
            <p className="text-center mt-5 text-lg">WIP</p>
        <Footer/>
    </>)
}