import { graphql } from "gatsby";

export interface Article {
    frontmatter: {
        author: string,
        description: string,
        date: string,
        category: string,
        slug: string,
        title: string,
        thumbnail: any // the real type is many nested objects but we don't care because we're not using that in our code
    },
    html: string
}