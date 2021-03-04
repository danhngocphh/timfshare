
const test = () => {

    const { SitemapStream, streamToPromise } = require('sitemap')
    const { Readable } = require('stream')

    // An array with your links
    const links = [
        { url: '/', changefreq: 'monthly', priority: 0.1 },
        { url: '/sitemap-search.xml', changefreq: 'daily', priority: 1 },
        { url: '/?top=link', changefreq: 'weekly', priority: 0.6 },
        { url: '/?top=key/', changefreq: 'weekly', priority: 0.6 }
    ]

    // Create a stream to write to
    const stream = new SitemapStream({ hostname: 'https://timfshare.com' })

    // Return a promise that resolves with your XML string
    return streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
        data.toString()
    )

    
}


// const test = () => {


//     const robotstxt = require('generate-robotstxt');
 
// robotstxt({
//   policy: [
//     {
//       userAgent: "Googlebot",
//       allow: "/",
//       disallow: "/search",
//       crawlDelay: 2,
//     },
//     {
//       userAgent: "OtherBot",
//       allow: ["/allow-for-all-bots", "/allow-only-for-other-bot"],
//       disallow: ["/admin", "/login"],
//       crawlDelay: 2,
//     },
//     {
//       userAgent: "*",
//       allow: "/",
//       disallow: "/search",
//       crawlDelay: 10,
//       cleanParam: "ref /articles/",
//     },
//   ],
//   sitemap: "http://timfshare.com/sitemap.xml",
//   host: "http://timfshare.com",
// })
//   .then((content) => {
//     console.log(content);
 
//     return content;
//   })
//   .catch((error) => {
//     throw error;
//   });


// }

let a = test().then((result) => (console.log(result)))

// console.log(a)
