import Head from "next/head"
import Footer from "../../components/footer"
import Header from "../../components/header"
import { getArticles, getArticle } from "../../lib/getArticles"
import css from "../../styles/article.module.css"
import "highlight.js/styles/stackoverflow-dark.css"

export default function Article({ article }) {
    return (<>
        <Head>
            <title>{article.title} - Elf&apos;s blog</title>
            <meta name="description" content={article.description}/>
        </Head>
        <Header/>
        <div className={css.content}>
            <ul className={css.categories}>
                {article.categories.map(category => {
                    return (
                        <li key={category}>
                            {category}
                        </li>
                    )
                })}
            </ul>
            <div dangerouslySetInnerHTML={{ __html: article.htmlContent }}/>
            <small>Author : <span className="red">{article.author}</span></small>
        </div>
        <Footer/>
    </>)
}

export async function getStaticPaths() {
    return {
        paths: getArticles().map(article => {
            return {
                params: {
                    name: article.filename
                }
            }
        }),
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const article = getArticle(params.name)

    return {
        props: {
            article
        }
    }
}