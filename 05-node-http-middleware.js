const http = require('http')
const Emitter = require('events')

class Koa extends Emitter {
    constructor() {
        super()
        this.middleware = []
        this.context = Object.create({})
    }
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }

    use(middleware) {
        this.middleware.push(middleware)
    }

    callback() {
        const handleRequest = (req, res) => {
            let context = this.createContext(req, res);
            this.middleware.forEach((_middleware, idx) => {
                _middleware(context);

                if (idx + 1 >= this.middleware.length) {
                    res.end('hl');
                }
            });
        };

        return handleRequest
    }

    createContext(req, res) {
        const context = Object.create(this.context);
        context.req = req;
        context.res = res;
        return context;
    }
}

const app = new Koa()

app.use(() => {
    console.log(1);
})
app.use(() => {
    console.log(2);
})
app.use(() => {
    console.log(3);
})

app.listen(1009, () => {
    console.log(`服务启动成功，地址是 http://localhost:1009`);
})
