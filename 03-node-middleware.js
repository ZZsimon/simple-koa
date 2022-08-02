/**
 * 原生node实现中间件模式（不考虑异步）
 * const Koa = require('koa')
 * const app = new Koa()
 * 
 * app.use(mid1)
 * app.use(mid2)
 * app.use(mid3)
 * 
 * app.listen(3000)
 * 
 */

const http = require('http')

class Koa {
    mids = []
    context = Object.create({})
    constructor() {

    }

    use(mid) {
        this.mids.push(mid)
    }

    listen(...args) {
        const server = http.createServer(this.nodeHttpCb.bind(this))
        server.listen(...args)
    }

    nodeHttpCb(req, res) {
        const isIconReq = req.url === "/favicon.ico"
        if (isIconReq) {
            res.end()
            return
        }

        this.mids.forEach(mid => {
            mid(this.context)
        })
        console.log(this.context, 'this.context')
        res.end(String(this.context.msg))
    }

}

const app = new Koa()
app.use((ctx) => {
    ctx.msg = 11
    console.log(1);
})
app.use((ctx) => {
    ctx.msg = 22
    console.log(2);
})

app.listen(3000, () => {
    console.log('server start...');
})

