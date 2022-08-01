// then方法返回一个新的Promise
// 首先来验证一下then方法返回值是否是一个promise

// const _p = new Promise((resolve) => {
//     setTimeout(() => {
//         resolve(1)
//     }, 1000);
// })
// const _pthen = _p.then()

// console.log(_pthen instanceof Promise, '_pthen is an instance of Promise') // _pthen是一个promise


// 改造then方法
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
        console.log('then');
        const thenP = new MPromise((resolve, reject) => {
            this.resolveCbs.push((value) => {
                const x = resolveFun(value)
                resolve(x)
            })
            this.rejectCbs.push((value) => {
                const x = rejectFun(value)
                reject(x)
            })
        })
        return thenP
    }
}

// const p1 = new MPromise((resolve, reject) => {
//     setTimeout(() => {
//         const data = '1'
//         resolve(data)
//     }, 1000);
// })

const p = new Promise((resolve) => {
    resolve(22)
})

const p11 = p.then(() => {
    console.log(1);
})
console.log(p11, 'p11')

p11.then(() => {
    console.log(2);
})

// p1.then((res) => {
//     console.log(res);
//     return 'then1'
// }).then((res) => {
//     console.log(res);
//     return 'then2';
// }).then((res) => {
//     console.log(res);
//     return 'then3';
// })

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

    注意⚠️：
       执行不是执行
            (res) => {
                console.log(res);
                return 'then1';
            }
        而是经过包装的注册函数
            (value) => {
                const x = resolveFun(value)
                resolve(x)
            }

    先执行resolveFun，打印 1 ，返回了 "then1"，x相当于 "then1"，
    然后，执行了p2的resolve方法

 * 3.执行了p2的resolve方法后，处理p2的回调函数，也就是then2的回调

    先执行resolveFun，打印 'then1' ，返回了 "then2"，x相当于 "then2"，
    然后，执行了p3的resolve方法

 * 4.执行了p3的resolve方法后，处理p3的回调函数，也就是then3的回调

    先执行resolveFun，打印 'then2' ，返回了 "then3"，x相当于 "then3"，
    然后，执行了p4的resolve方法，p4没有回调函数，结束！！！

 */







/**
 * 但是还有问题，如果then1回调函数返回值是异步的话，就会拿不到异步值
 
        p1.then((res) => {
            console.log(res);
            setTimeout(() => {
                return 'then1'
            }, 1000);

        })

 * 看04-demo.js
 */

