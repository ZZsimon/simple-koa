/**
 *  模拟koa中间件实现
 * 
 *  app.use相当于push一个一个中间件函数到一个数组中，也就是下面的middleware
 *  ctx相当于全局变量，也就是下面的context
 * 
 *  然后当收到客户端请求后，koa内部会默认执行第一个中间件函数，也就是会执行下面的fn函数
 * 
 *  那么，如何保证中间件函数们按照“洋葱模型”顺序执行呢？答案就在 compose 函数中
 *  本质上其实就是和 03-promise 中的思想一致，只不过使用了新的async await语法
 */
let middleware = [];
let context = {
    data: []
};

middleware.push(async (ctx, next) => {
    ctx.data.push(1);
    await next();
    ctx.data.push(6);
});

middleware.push(async (ctx, next) => {
    ctx.data.push(2);
    await next();
    ctx.data.push(5);
});

middleware.push(async (ctx, next) => {
    ctx.data.push(3);
    await next();
    ctx.data.push(4);
});

const fn = compose(middleware);
/**
 * fn 相当于  function (ctx, next) { ... }
 * 又相当于 dispatch(0)
 * 又相当于  Promise.resolve();
 * 也就是说 fn是一个Promise实例
 */

fn(context)
    .then(() => {
        console.log('end：context = ', context);
    });


/**
 * 处理中间件，保证它们的执行顺序符合“洋葱模型”
 * @param {中间件数组} middleware 
 * @returns 
 */
function compose(middleware) {

    if (!Array.isArray(middleware)) {
        throw new TypeError('Middleware stack must be an array!');
    }

    return function (ctx, next) {
        let index = -1;

        return dispatch(0);

        function dispatch(i) {
            if (i < index) {
                return Promise.reject(new Error('next() called multiple times'));
            }
            index = i;

            let fn = middleware[i];

            if (i === middleware.length) {
                fn = next;
            }

            if (!fn) {
                return Promise.resolve();
            }

            try {
                return Promise.resolve(fn(ctx, () => {
                    return dispatch(i + 1);
                }));
            } catch (err) {
                return Promise.reject(err);
            }
        }
    };
}
