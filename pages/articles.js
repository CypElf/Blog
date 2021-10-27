import Head from "next/head"
import Link from "next/link"
import Footer from "../components/footer"
import Header from "../components/header"
import css from "../styles/articles.module.css"
import { getArticles } from "../lib/getArticles"

export default function Articles({ articles }) {
    const hierarchy = new Map() // represents the categories hierarchy, e.g. which category is nested in which category

    for (const categories of new Set(articles.map(article => article.categories))) {
        if (categories.length === 3) {
            if (!hierarchy.has(categories[0])) {
                hierarchy.set(categories[0], new Map([[categories[1], [categories[2]]]]))
            }
            else if (!hierarchy.get(categories[0]).has(categories[1])) {
                hierarchy.get(categories[0]).set(categories[1], [categories[2]])
            }
            else {
                if (!hierarchy.get(categories[0]).get(categories[1]).includes(categories[2])) hierarchy.get(categories[0]).get(categories[1]).push(categories[2])
            }
        }
        else if (categories.length === 2) {
            if (!hierarchy.has(categories[0])) {
                hierarchy.set(categories[0], [categories[1]])
            }
            else {
                if (!hierarchy.get(categories[0]).includes(categories[1])) hierarchy.get(categories[0]).push(categories[1])
            }
        }
        else {
            if (!hierarchy.has(categories[0])) {
                hierarchy.set(categories[0], undefined)
            }
        }
    }

    const html = [...hierarchy.keys()].map(key => {
        return (
            <div key={key}>
                <h1 className={css.indent1}>{key}</h1>
                {hierarchy.get(key) instanceof Map ? [...hierarchy.get(key).keys()].map(key2 => {
                    return (
                        <div key={key2}>
                            <h2 className={css.indent2}>{key2}</h2>
                            {hierarchy.get(key).get(key2).map(deepest => {
                                // 3 categories of depth
                                return (
                                    <div key={deepest}>
                                        <h3 className={css.indent3}>{deepest}</h3>
                                        {getFormattedArticles(articles, [key, key2, deepest], 4)}
                                    </div>
                                )
                            })}
                        </div>
                    )
                }) : (hierarchy.get(key) instanceof Array ? // 2 categories of depth
                    hierarchy.get(key).map(key2 => {
                        return (
                            <div key={key2}>
                                <h2 className={css.indent2}>{key2}</h2>
                                {getFormattedArticles(articles, [key, key2], 3)}
                            </div>
                        )
                    })
                    : // 1 category of depth
                    getFormattedArticles(articles, [key], 2))}
            </div>
        )
    })

    return (<>
        <Head>
            <title>Articles - Elf's blog</title>
            <meta name="description" content="All the articles, sorted by category and date."/>
        </Head>
        <Header/>
        <div className={css.content}>
            {html}
        </div>
        <Footer/>
    </>)
}

export async function getStaticProps() {
    return {
        props: {
            articles: getArticles()
        }
    }
}

function getFormattedArticles(articles, categories, indentLevel) {
    return (
        <ul className={indentLevel === 2 ? css.indent2 : (indentLevel === 3 ? css.indent3 : css.indent4)}>
            {articles.filter(article => JSON.stringify(article.categories) === JSON.stringify(categories)).map(article => {
                return (<li key={article.title}>
                    {article.date} {">"} <span className="red"><Link href={`/articles/${article.filename}`}>{article.title}</Link></span>
                </li>)
            })}
        </ul>
    )
}