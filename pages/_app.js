import Head from "next/head"
import "../styles/globals.css"

function app({ Component, pageProps }) {
	return (<>
		<Head>
			<link rel="icon" href="/logo.png"/>
		</Head>
		<Component {...pageProps} />
	</>)
}

export default app