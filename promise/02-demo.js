// 引入状态的概念，一旦执行了resolve或者reject，就更改状态
class Promise {
    static PENDING = 'pending';
    static RESOLVED = 'resolved';
    static REJECTED = 'rejected';

    constructor(fn) {
        this.status = Promise.PENDING
        this.resolveCbs = []
        this.rejectCbs = []
        this.value = null
        this.err = null
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
        fn(this.resolve, this.reject)
    }

    resolve(data) {
        if (this.status === Promise.PENDING) {
            this.status = Promise.RESOLVED
            this.value = data
            this.resolveCbs.forEach(resolveCb => resolveCb(this.value))
        }

    }

    reject(err) {
        if (this.status === Promise.PENDING) {
            this.status = Promise.REJECTED
            this.err = err
            this.rejectCbs.forEach(fn => fn(this.err))
        }

    }

    then(resolveFun, rejectFun) {
        // resolveFun = typeof resolveFun === 'function' ? resolveFun : value => value;
        // rejectFun = typeof rejectFun === 'function' ? rejectFun : reason => { throw reason }

        // 先默认执行then的时候，异步任务肯定没完成
        this.resolveCbs.push(resolveFun)
        this.rejectCbs.push(rejectFun)

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

    // 加入了状态机制后，就无法将状态反复更改了，也就说下面的reject执行了什么都不会做
    setTimeout(() => {
        const err = 'has error'
        reject(err)
    }, 2000);
}

const p1 = new Promise(fun)

p1.then((data) => {
    console.log(data, '[data then1]')
}, (err) => {
    console.log(err, '[err then1]')
})

/**
 * 存在的问题：
 *      链式调用虽然可以使用，但是会出现问题，
 *      比如说想要第1个then返回的数据传递给第2个then函数
 *      打印的res，并不是then1、then2、then3
 * 
 *      执行性异步任务后，Promise实例中的this.value变成了1
 *      之后调用通过then注册的函数，都会使用this.value，也就是都是1
 *      并不会使用通过then注册的函数返回的值
 *         
        p1.then((res) => {
                console.log(res);
                return 'then1';
            })
            .then((res) => {
                console.log(res);
                return 'then2';
            })
            .then((res) => {
                console.log(res);
                return 'then3';
            })
 */


