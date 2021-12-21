import React from "react"
import { graphql } from "gatsby"
import Footer from "../components/footer"
import Header from "../components/header"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default function Home({ data }) {
    let articles = data.allMarkdownRemark.nodes
    articles.sort((a, b) => {
        // -1 to the month because it is zero indexed
        const dateA = a.frontmatter.date.split("/").reverse().join("/")
        const dateB = b.frontmatter.date.split("/").reverse().join("/")
        if (dateA < dateB) return 1
        else if (dateA > dateB) return -1
        return 0
    })
    articles = articles.slice(0, 10)

    console.log(articles)

    return (<>
        <Header/>
            <p className="text-4xl w-4/5 mx-auto mt-10 pl-7">Latest posts</p>

            <ul className="flex flex-col items-center lg:items-stretch m-auto xl:w-4/5 lg:grid lg:grid-cols-2">
                {articles.map(article => {
                    console.log(article.frontmatter.thumbnail)
                    return (
                        <li className="flex" key={article.frontmatter.title}>
                            <a className="mx-7 my-12 p-4 max-w-xl flex-1 flex flex-col justify-between bg-gray-3 shadow-xl rounded-lg hover:text-green-1" href={article.frontmatter.slug}>
                                <h1 className="text-2xl text-center mt-3">{article.frontmatter.title}</h1>
                                <div className="mt-4 text-center">
                                {
                                    article.frontmatter.thumbnail &&
                                    <GatsbyImage image={getImage(article.frontmatter.thumbnail)} alt="article thumbnail"/>
                                }
                                </div>
                                
                                <p className="font-segoe text-gray-4 mt-5 sm:px-10">{article.frontmatter.description}</p>
                                <ul className="flex justify-end text-sm mt-5">
                                    {article.frontmatter.keywords.map(category => {
                                        return (
                                            <li className="text-white-1 bg-gray-1 p-1 rounded-sm" key={category}>
                                                {category}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </a>
                        </li>
                    )
                })}
            </ul>
        <Footer/>
    </>)
}

export const pageQuery = graphql`
query Articles {
    allMarkdownRemark {
        nodes {
            frontmatter {
                author
                description
                date
                keywords
                slug
                title
                thumbnail {
                    childImageSharp {
                        gatsbyImageData(width: 600)
                    }
                }
            }
            html
        }
    }
}
`