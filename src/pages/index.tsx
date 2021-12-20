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
            <p className="">Recent posts</p>

            <ul className="m-auto w-4/5 grid grid-cols-2">
                {articles.map(article => {
                    console.log(article.frontmatter.thumbnail)
                    return (
                        <li className="flex flex-col justify-between bg-gray-3 shadow-md rounded-lg mx-7 my-12" key={article.frontmatter.title}>
                            <a href={article.frontmatter.slug}><h1>{article.frontmatter.title}</h1></a>
                            <div className="mt-4 text-center">
                            {
                                article.frontmatter.thumbnail &&
                                <GatsbyImage image={getImage(article.frontmatter.thumbnail)} alt="article thumbnail"/>
                            }
                            </div>
                            
                            <p className="font-light text-base text-gray-4 px-10">{article.description}</p>
                            <ul className="flex justify-end text-sm mt-5">
                                {article.frontmatter.keywords.map(category => {
                                    return (
                                        <li className="bg-gray-1 p-1 rounded-sm mr-2" key={category}>
                                            {category}
                                        </li>
                                    )
                                })}
                            </ul>
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
                        gatsbyImageData(width: 350)
                    }
                }
            }
            html
        }
    }
}
`