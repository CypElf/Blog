import fs from "fs"
import glob from "glob"
import matter from "gray-matter"
import showdown from "showdown"
import showdownHighlight from "showdown-highlight"

export function getArticles() {
    const files = glob.sync("./articles/**/**/**/*").filter(entry => fs.statSync(entry).isFile()).map(file => {
        const matterResult = matter(fs.readFileSync(file, "utf-8"))

        showdown.setFlavor("github")

        const converter = new showdown.Converter({
            extensions: [
                showdownHighlight({
                    pre: true
                })
            ]
        })
        const htmlContent = converter.makeHtml(matterResult.content)

        return {
            path: file,
            filename: file.split("/")[file.split("/").length - 1].split(".").slice(0, -1).join("."),
            ...matterResult.data,
            htmlContent
        }
    })

    return files
}

export function getArticle(filename) {
    return getArticles().filter(article => article.filename === filename)[0]
}