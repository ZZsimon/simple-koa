/**
 * 原生node实现中间件模式（不考虑异步）
 * 
 * 本质上就是新建一个class
 *  1.内部有数组可以保存一个一个中间件
 *  2.有一个context变量来保存全局数据
 * 收到请求的时候就一个一个触发中间件
 */

const http = require('http')

class Koa {
    constructor() {
        this.middleware = []
        this.context = Object.create({})
    }
    listen(...args) {
        /**
         *  http.createServer的第一个参数是一个回调函数
         *  每当有请求进来的时候，就会运行这个回调函数
         */
        const server = http.createServer(this.callback.bind(this))
        server.listen(...args)
    }

    use(middleware) {
        this.middleware.push(middleware)
    }

    callback(req, res) {

        const isIconReq = req.url === "/favicon.ico"
        if (isIconReq) {
            res.end()
            return
        }
        this.middleware.forEach((_middleware, idx) => {
            _middleware(this.context);

            if (idx + 1 >= this.middleware.length) {
                res.write(`
                <p>${this.context.title1}</p>
                <p>${this.context.title2}</p>
                <p>${this.context.title3}</p>
                `);
                res.end()
            }
        });
    }
}

const app = new Koa()

app.use((ctx) => {
    ctx.title1 = 'title1'
    console.log(1);
})
app.use((ctx) => {
    ctx.title2 = 'title2'
    console.log(2);
})
app.use((ctx) => {
    ctx.title3 = 'title3'
    console.log(3);
})

app.listen(1009, () => {
    console.log(`服务启动成功，地址是 http://localhost:1009`);
})
