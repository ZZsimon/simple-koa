const http = require('http')

const server = http.createServer((req, res) => {
    res.end('node http')
})
server.listen(3000)