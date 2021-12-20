import React from "react"
import { graphql } from "gatsby"
import Footer from "../components/footer"
import Header from "../components/header"

export default function Home({ data }) {
    console.log(data)
    return (<>
        <Header/>
            <h1>{data.markdownRemark.frontmatter.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}></p>
        <Footer/>
    </>)
}

export const pageQuery = graphql`
query Article($id: String!) {
    markdownRemark(id: { eq: $id }) {
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
  
`