// then方法返回一个新的Promise
// 首先来验证一下then方法返回值是否是一个promise

const _p = new Promise((resolve) => {
    setTimeout(() => {
        resolve(1)
    }, 1000);
})
const _pthen = _p.then()

console.log(_p, '_p')
console.log(_pthen, '_pthen') // _pthen是一个promise


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
        // resolveFun = typeof resolveFun === 'function' ? resolveFun : value => value;
        // rejectFun = typeof rejectFun === 'function' ? rejectFun : reason => { throw reason }

        const thenP = new MPromise((resolve, reject) => {
            this.resolveCbs.push(resolveFun)
            this.rejectCbs.push(rejectFun)
        })

        return thenP
    }
}

const fun = (resolve, reject) => {
    // 必须要保证resolve是异步执行的
    // 必须保证注册函数已经注册在实例中了

    setTimeout(() => {
        const data = '1'
        resolve(data)
    }, 1000);

    // 加入了状态机制后，就无法将状态反复更改了，也就说下面的reject执行了什么都不会做
    setTimeout(() => {
        const err = 'has error'
        reject(err)
    }, 2000);
}

// const p1 = new MPromise(fun)

// p1.then((data) => {
//     console.log(data, '[data then1]')
// }, (err) => {
//     console.log(err, '[err then1]')
// })


