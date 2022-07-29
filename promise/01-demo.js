class Promise {
    constructor(fn) {
        this.resolveCbs = []
        this.rejectCbs = []
        this.value = null
        this.err = null
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
        fn(this.resolve, this.reject)
    }

    resolve(data) {
        setTimeout(() => {
            this.value = data
            this.resolveCbs.forEach(resolveCb => resolveCb(this.value))
        }, 0);
    }

    reject(err) {
        this.err = err
        this.rejectCbs.forEach(fn => fn(this.err))
    }

    then(resolveFun, rejectFun) {
        this.resolveCbs.push(resolveFun)
        this.rejectCbs.push(rejectFun)
        // return了Promise实例后，就可以链式调用了
        return this
    }
}

const fun = (resolve, reject) => {
    // 必须要保证resolve是异步执行的
    // 必须保证注册函数已经注册在实例中了

    setTimeout(() => {
        const data = '1'
        resolve(data)
    }, 1000);
}

const p1 = new Promise(fun)

p1.then((data) => {
    console.log(data, 'data then1')
}, (err) => {
    console.log(err, 'err then1')
}).then((data) => {
    console.log(data, 'data then2')
}, (err) => {
    console.log(err, 'err then2')
})


/**
 * 存在的问题：
 *      没有状态的概念，状态可以随意更改。比如说1s后resolve，2s后reject
 *          const fun = (resolve, reject) => {
                setTimeout(() => {
                    const data = '1'
                    resolve(data)
                }, 1000);

                setTimeout(() => {
                    const err = 'something err'
                    reject(err)
                }, 2000);
            }
 */