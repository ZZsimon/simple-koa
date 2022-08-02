/**
 *  保证中间件按照 洋葱模型 执行
 * 
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

fn(context).then(() => {
    console.log('end：context = ', context);
});


/**
 * 处理中间件，保证它们的执行顺序符合“洋葱模型”
 * @param {中间件函数数组} middleware 
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
                // 返回了一个Promise
                // fn直接执行
                return Promise.resolve(
                    fn(
                        ctx, () => dispatch(i + 1)
                    )
                );
            } catch (err) {
                return Promise.reject(err);
            }
        }
    };
}

module.exports = compose

