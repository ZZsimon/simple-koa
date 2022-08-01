
// 支持then中写异步代码
class MPromise {
    static PENDING = 'pending';
    static RESOLVED = 'resolved';
    static REJECTED = 'rejected';

    constructor(fn) {
        this.status = MPromise.PENDING
        this.resolveCbs = []
        this.rejectCbs = []
        this.value = null
        this.err = null
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
        fn(this.resolve, this.reject)
    }

    resolve(data) {
        if (this.status === MPromise.PENDING) {
            this.status = MPromise.RESOLVED
            this.value = data
            this.resolveCbs.forEach(resolveCb => resolveCb(this.value))
        }
    }

    reject(err) {
        if (this.status === MPromise.PENDING) {
            this.status = MPromise.REJECTED
            this.err = err
            this.rejectCbs.forEach(fn => fn(this.err))
        }
    }

    then(resolveFun, rejectFun) {
        const thenP = new MPromise((resolve, reject) => {
            this.resolveCbs.push((value) => {
                const x = resolveFun(value)
                // 其实也很简单，当 x 是一个 Promise 对象的时候，我们需要进行等待，
                // 直到返回的 Promise 状态变化的时候，再去执行之后的 then 函数，
                resolvePromise(thenP, x, resolve, reject);
            })
            this.rejectCbs.push((value) => {
                const x = rejectFun(value)
                resolvePromise(thenP, x, resolve, reject);
            })
        })
        return thenP
    }
}

/**
 * 
 * @param {then方法返回的Promise实例} thenP 
 * @param {then方法有两个参数，resolve或者reject，x就是他们的返回值} x 
 * @param {thenP的resolve方法} resolve 
 * @param {thenP的resolve方法} reject 
 * 
 * 当 x 是 Promise 的时，并且他的状态是 Pending 状态，
 * 如果 x 执行成功，那么就去递归调用 resolvePromise 这个函数，
 * 将 x 执行结果作为 resolvePromise 第二个参数传入；
 * 
 * 如果执行失败，则直接调用 promise2 的 reject 方法。
 * 
 */
function resolvePromise(thenP, x, resolve, reject) {
    if (x instanceof MPromise) {
        const then = x.then;
        if (x.status == MPromise.PENDING) {
            then.call(x, y => {
                resolvePromise(promise2, y, resolve, reject);
            }, err => {
                reject(err);
            })
        } else {
            x.then(resolve, reject);
        }
    } else {
        resolve(x);
    }
}



const fun = (resolve, reject) => {
    setTimeout(() => {
        const data = '1'
        resolve(data)
    }, 1000);
}

const p1 = new MPromise(fun)

p1.then((res) => {
    console.log(res);
    const p11 = new Promise((resolve) => {
        setTimeout(() => {
            resolve('then1')
        }, 1000);
    });
    return p11
}).then((res) => {
    console.log(res);
    const p13 = new Promise((resolve) => {
        setTimeout(() => {
            resolve('then2')
        }, 1000);
    });
    return p13
}).then((res) => {
    console.log(res);
    return 'then3';
})


/**
 * 1.开始：
 *      创建p1，`异步任务1` 挂起，
 *      执行then1函数，创建p2，返回p2
 *      执行then2函数，创建p3，返回p3
 *      执行then3函数，创建p4，返回p4
 *
 *      p1、p2、p3、p4都处于pendding
 *
 *
 * 2.p1异步执行完后，处理p1的回调函数，也就是then1的回调
       (value) => {
            const x = resolveFun(value)
            resolvePromise(p2, x, resolve, reject);
        }

    先执行resolveFun，创建了 p11 ，返回p11，p11处于 pendding
    然后，执行了resolvePromise方法，
        resolvePromise(p2, p11, resolve, reject);
    
    p11处于pendding，于是，执行：
        then.call(x, y => {
            resolvePromise(thenP, y, resolve, reject);
        })
        立即执行p11的then方法，创建了p12，返回p12，p12处于pendding
        但是注册的函数推到了p11的回调队列中。

    1s后，p11的resolve方法执行了，开始处理p11的回调函数，也就是
        y => {
            resolvePromise(thenP, y, resolve, reject);
        }
    y是 resolve方法带过来的值 “then1”
    再次执行resolvePromise方法，此时，x参数的实参是 “then1”，
    因此立即执行 resolve函数，修改了
    

 * 3.执行了p2的resolve方法后，处理p2的回调函数，也就是then2的回调

    先执行resolveFun，打印 'then1' ，返回了 "then2"，x相当于 "then2"，
    然后，执行了p3的resolve方法

 * 4.执行了p3的resolve方法后，处理p3的回调函数，也就是then3的回调

    先执行resolveFun，打印 'then2' ，返回了 "then3"，x相当于 "then3"，
    然后，执行了p4的resolve方法，p4没有回调函数，结束！！！

 */

