import React from "react"
import { graphql } from "gatsby"
import Footer from "../components/footer"
import Header from "../components/header"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Helmet } from "react-helmet"
import { Article } from "../utilities/article"

export default function Home({ data }) {
    let articles: Article[] = data.allMarkdownRemark.nodes
    articles.sort((a, b) => {
        // -1 to the month because it is zero indexed
        const dateA = a.frontmatter.date.split("/").reverse().join("/")
        const dateB = b.frontmatter.date.split("/").reverse().join("/")
        if (dateA < dateB) return 1
        else if (dateA > dateB) return -1
        return 0
    })
    articles = articles.slice(0, 10)

    return (<>
        <Helmet>
            <title>Elf's blog - latest posts</title>
            <meta name="description" content="CTF, articles and write ups"/>
        </Helmet>
        <Header/>
            <p className="text-4xl w-4/5 mx-auto lg:mt-10 mt-5 mb-3 pl-7">Latest posts</p>
            <ul className="flex flex-col items-center lg:items-stretch m-auto xl:w-4/5 lg:grid lg:grid-cols-2">
                {articles.map(article => {
                    return (
                        <li className="flex" key={article.frontmatter.title}>
                            <a className="mx-4 lg:mx-7 my-5 lg:my-12 p-4 max-w-xl flex-1 flex flex-col justify-between bg-gray-3 shadow-xl rounded-lg hover:text-green-1" href={article.frontmatter.slug}>
                                <h1 className="text-2xl text-center mt-3">{article.frontmatter.title}</h1>
                                <div className="mt-4 text-center">
                                {
                                    article.frontmatter.thumbnail &&
                                    <GatsbyImage image={getImage(article.frontmatter.thumbnail)} alt="article thumbnail"/>
                                }
                                </div>
                                
                                <p className="font-segoe text-lg text-center text-gray-4 mt-5 sm:px-10">{article.frontmatter.description}</p>

                                <div className="text-sm text-white-1 bg-gray-1 p-1 rounded-sm ml-auto mt-5 w-fit">
                                    {article.frontmatter.category.toLowerCase()}
                                </div>
                            </a>
                        </li>
                    )
                })}
            </ul>
        <Footer/>
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