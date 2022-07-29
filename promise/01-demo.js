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
        this.value = data
        this.resolveCbs.forEach(resolveCb => resolveCb(this.value))
    }

    reject(err) {
        this.err = err
        this.rejectCbs.forEach(fn => fn(this.err))
    }

    then(resolveFun, rejectFun) {
        this.resolveCbs.push(resolveFun)
        this.rejectCbs.push(rejectFun)
    }
}

const fun = (resolve, reject) => {
    setTimeout(() => {
        const data = '1'
        reject(data)
    }, 1000);
}

const p1 = new Promise(fun)

p1.then((data) => {
    console.log(data, 'data')
}, (err) => {
    console.log(err, 'err')
})