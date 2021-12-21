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
                <ul className="w-2/3 m-auto mt-14 font-segoe">
                    {categories.map(category => {
                        return (<li key={category}>
                            <h2 className="text-3xl my-11">{category}</h2>
                            <ul className="list-disc list-inside">
                                {articles.filter(article => article.frontmatter.category === category).map(article => {
                                    return (
                                        <li className="text-lg my-3" key={article.frontmatter.slug}><a className="hover:underline hover:text-green-1" href={article.frontmatter.slug}>{article.frontmatter.title}</a></li>
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