
const Koa = require('./06-node-middleware-async')

const app = new Koa();
const PORT = 1009;

const catchError = async (ctx, next) => {
    console.log(1);
    try {
        await next()
    } catch (error) {
        console.log('test catch error');
        ctx.body = 'test catch error'
    }
    console.log(2);
}

app.use(catchError);

app.use(async (ctx, next) => {
    console.log(3);
    await next()
    console.log(4);
});

app.use(async (ctx, next) => {
    console.log(5);
    // 加上 await 后，就会等待后面的Promise中的异步任务执行完后，才继续往后走

    // 没有 await 的话，这个Promise异步任务在当前这个时间循环中，不会执行
    // 而catch error中间件只能捕获和它处于一个事件循环中的错误代码
    await testAsyncFun()

    // await new Promise((resolve, reject) => {
    //     setTimeout(async () => {
    //         reject('出现错误')
    //     }, 1000);
    // })
    // console.log(5);
    // await next()
    // console.log(6);
    // ctx.body = 'success'

});

async function testAsyncFun() {
    // async的方法会返回Promise实例
    // throw关键字 会改变Promise实例的状态
    throw new Error('errorrr')
}


// app.use(async (ctx, next) => {
//     console.log(5);

//     const res = await new Promise((resolve, reject) => {
//         setTimeout(async () => {
// 这个Promise已经和外面的Promise不处于 同一个事件循环
// 那么，catchError中间件函数也就无法被捕捉到它的reject上报的错误
//             new Promise((resolve, _reject) => {
//                 setTimeout(() => {
//                     _reject('出现错误222')
//                 }, 1000);
//             })
//             resolve('出现错误')
//         }, 1000);
//     })
//     console.log(res, 'res')
//     console.log(5);
//     await next()
//     console.log(6);
//     ctx.body = 'success'

// });


app.listen(PORT, () => {
    console.log(`server start on http://localhost:1009`);
});