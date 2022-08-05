/**
 * Promise错误捕获demo
 */
async function fn() {
    try {
        await Promise.reject('error reason')
    } catch (error) {
        console.log(error, '【error11】')
    }
}
fn()

/**
 * 当Promise状态更改为reject，但是没有reject处理函数的时候，
 * 就会触发【UnhandledPromiseRejection】事件
 * await关键字相当于 对当前处于reject状态的Promise处理
 *
 */


//ref:https://segmentfault.com/a/1190000007535316