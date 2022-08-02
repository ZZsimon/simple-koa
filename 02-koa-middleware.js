

/**
 *  koa和中间件使用
 * 
 *  1.有统一 context
    2.操作先进后出
    3.有控制先进后出的机制 next
    4.有提前结束机制
 */

const Koa = require('koa')

const app = new Koa()

const mid1 = async (ctx, next) => {
    console.log(1);
    await next()
    console.log(6);
}

const mid2 = async (ctx, next) => {
    console.log(2);
    await next()
    console.log(5);
}

const mid3 = async (ctx, next) => {
    console.log(3);
    await next()
    console.log(4);
}

app.use(mid1)
app.use(mid2)
app.use(mid3)

app.listen(1010, () => {
    console.log(`服务启动成功，地址是 http://localhost:1010`);
})


