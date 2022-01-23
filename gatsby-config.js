module.exports = {
    siteMetadata: {
        siteUrl: "https://cypelf.fr",
        title: "Blog"
    },
    plugins: [
        "gatsby-plugin-postcss",
        "gatsby-plugin-image",
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",
        {
            resolve: "gatsby-transformer-remark",
            options: {
                plugins: [
                    {
                        resolve: "gatsby-remark-images",
                        options: {
                            maxWidth: 800
                        }
                    }                    
                ]
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "resources",
                path: "./src/resources/"
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "pages",
                path: "./src/pages/",
            },
        },
    ]
}