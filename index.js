var http = require('http');
const https = require('https');

const host = 'localhost';
const port = 3000;

http.createServer(async (req, res) => {
    let result;
    res.writeHead(200, { 'Content-Type': "application/json" });
    if (req.url === '/getTimeStories') {
        result = await get();
        console.log(result)
        res.write(JSON.stringify(result));
        res.end();
    } else {
        res.write('Hello!');
        res.end();
    }
}).listen(port, () => {
    console.log(`Server is running on https://${host}:${port}`);
});

function get() {
    let data = [];
    return new Promise((resolve, reject) => {
        let req = https.get('https://time.com', (res) => {
            res.on('data', async d => {
                data.push(d.toString());
            })
            res.once('end', async () => {
                const headline = await data.join("")
                    .match(/(?<=class="latest-stories__item-headline">)(.*?)(?=<\/h3>)/g)
                let headLine = await headline.map((item) => {
                    str = item.toString()
                    item = str.replace(/(<([^>]+)>)/ig, '');
                    return item;
                })
                const href = await data.join("").match(/class="latest-stories__item">+\s*<a\s+href=(["'])(.*?)\1/g).map((item) => {
                    return item.split('"')[3]
                })
                result = headLine.map((name, index) => {
                    return {
                        'title': name,
                        'link': 'https://time.com' + href[index]
                    }
                })
                resolve(result);
            })

        });
        req.end();
    });
}