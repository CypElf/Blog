export function getFormattedArticles(articles, categories, indentLevel) {
    return (
        <ul className={indentLevel === 2 ? css.indent2 : (indentLevel === 3 ? css.indent3 : css.indent4)}>
            {articles.filter(article => JSON.stringify(article.categories) === JSON.stringify(categories)).map(article => {
                return (<li key={article.matter.title}>
                    {article.matter.date} {">"} <a href={`/posts/${article.filename}`} className={css.red}>{article.matter.title}</a>
                </li>)
            })}
        </ul>
    )
}