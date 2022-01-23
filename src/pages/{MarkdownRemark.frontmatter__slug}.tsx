import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import hljs from "highlight.js"
import "highlight.js/styles/stackoverflow-dark.css"
import Footer from "../components/footer"
import Header from "../components/header"
import { Article } from "../utilities/article"

export default function Home({ data }) {
    useEffect(() => {
        // this is a very dirty way of adding syntax highlighting, but there's no other way to use highlight.js in gatsby, since there's no plugin for that (gatsby's official syntax highlighting plugin uses prism.js, which has only a few themes that are - imo - VERY ugly)
        for (const codeBlock of document.querySelectorAll("pre > code")) {
            hljs.highlightBlock(codeBlock as HTMLElement)
        }
    })

    const article: Article = data.markdownRemark

    return (<>
        <Helmet>
            <title>Elf's blog - {article.frontmatter.title}</title>
            <meta name="description" content={article.frontmatter.description}/>
        </Helmet>
        <Header/>
        <div className="article m-auto mt-7 lg:mt-16 font-segoe text-base xl:text-lg w-5/6 lg:w-3/4 xl:w-1/2" dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}></div>
        <Footer/>
    </>)
}

export const pageQuery = graphql`
    query ($id: String!) {
        markdownRemark(id: { eq: $id }) {
            frontmatter {
                author
                description
                date
                category
                slug
                title
                ctf
                thumbnail {
                    childImageSharp {
                        gatsbyImageData(placeholder: BLURRED)
                    }
                }
            }
            html
        }
    }
`