import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import Header from "../components/header"
import Footer from "../components/footer"
import { Article } from "../utilities/article"

export default function Articles({ data }) {
    const articles: Article[] = data.allMarkdownRemark.nodes
    const categories = [...new Set(articles.map(article => article.frontmatter.category))]
    
    return (<>
        <Helmet>
            <title>Elf's blog - all the articles</title>
            <meta name="description" content="List of all the published articles available"/>
        </Helmet>
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <Header/>
                <h1 className="text-2xl text-center mt-5 md:text-3xl md:pl-20 md:m-auto md:mt-10">All the articles</h1>
                <ul className="w-10/12 m-auto md:mt-14 font-segoe md:w-1/3 md:m-auto">
                    {categories.map(category => {
                        return (<li key={category}>
                            <h2 className="text-xl md:text-2xl my-6 md:my-11">{category}</h2>
                            <ul className="list-disc list-inside">
                                {articles.filter(article => article.frontmatter.category === category).map(article => {
                                    return (
                                        <li className="md:text-lg my-3" key={article.frontmatter.slug}>{article.frontmatter.date} {">"} <a className="text-green-1 hover:underline" href={article.frontmatter.slug}>{article.frontmatter.title}</a></li>
                                    )
                                })}
                            </ul>
                        </li>)
                    })}
                </ul>
            </div>
            
            {/* temporary, because there are not enough articles listed to make the footer stay at the bottom */}
            <Footer className="flex-shrink-0"/>
        </div>
    </>)
}

export const pageQuery = graphql`
    query {
        allMarkdownRemark {
            nodes {
                frontmatter {
                    author
                    description
                    date
                    category
                    slug
                    title
                    thumbnail {
                        childImageSharp {
                            gatsbyImageData(placeholder: BLURRED)
                        }
                    }
                }
                html
            }
        }
    }
`