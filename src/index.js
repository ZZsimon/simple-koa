
const Koa = require('./06-node-middleware-async')

const app = new Koa();
const PORT = 1009;

app.use(async ctx => {
    ctx.body = '<p>this is a body</p>';
});

app.listen(PORT, () => {
    console.log(`server start on http://localhost:1009`);
});