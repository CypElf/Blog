import Head from "next/head"
import Image from "next/image"
import Footer from "../components/footer"
import Header from "../components/header"
import css from "../styles/home.module.css"
import { getArticles } from "../lib/getArticles"

export default function Home({ articles }) {
    articles.sort((a, b) => {
        // -1 to the month because it is zero indexed
        const dateA = new Date(a.date.split("/")[2], a.date.split("/")[1] - 1, a.date.split("/")[0])
        const dateB = new Date(b.date.split("/")[2], b.date.split("/")[1] - 1, b.date.split("/")[0])
        if (dateA < dateB) return 1
        else if (dateA > dateB) return -1
        return 0
    })
    articles = articles.slice(0, 10)

    return (<>
        <Head>
            <title>Home - Elf's blog</title>
            <meta name="description" content="Elf's IT security blog"/>
        </Head>
        <Header/>
        <div className={css.content}>
            <p className={css.welcome}>
                <span className={css.bigger}>Welcome!</span><br/>
                <span className={css.description}>This is a blog about IT security in general. Here, you will be able to find write ups, general articles about security and more.</span>
            </p>

            <ul className={css.latest}>
                {articles.map(article => {
                    return (
                        <li key={article.title}>
                            <a href={`/articles/${article.filename}`}><h2>{article.title}</h2></a>
                            <div className={css.thumbnail}>
                            {
                                article.thumbnail &&
                                <Image src={article.thumbnail} alt="article thumbnail" width={350} height={250}/>
                            }
                            </div>
                            
                            <p>{article.description}</p>
                            <ul className={css.categories}>
                                {article.keywords.map(category => {
                                    return (
                                        <li key={category}>
                                            {category}
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    )
                })}
            </ul>
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