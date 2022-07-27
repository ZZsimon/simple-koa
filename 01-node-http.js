/**
 * node http模块创建http服务器
 */

const http = require('http')

const PORT = 1009

const server = http.createServer((req, res) => {
    res.end('hello simple koa')
})

server.listen(PORT, () => {
    console.log(`服务启动成功，地址是 http://localhost:${PORT}`);
})