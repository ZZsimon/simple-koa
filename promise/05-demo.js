//完整的实现
class MPromise {
    static PENDING = 'pending';
    static RESOLVED = 'resolved';
    static REJECTED = 'rejected';

    callbacks = [];
    state = MPromise.PENDING;
    value = null;

    constructor(fn) {
        fn(this.resolve.bind(this));
    }

    then(callback) {
        console.log('then');
        // 如果不返回Promise，直接this.callbacks.push(callback)就可以了
        const p = new MPromise(resolve => {
            this.handle({
                thenCb: callback,
                thenPResolve: resolve,
            });
        });
        return p
    }

    handle(obj) {
        const {
            thenCb,
            thenPResolve
        } = obj
        if (this.state === MPromise.PENDING) {
            this.callbacks.push(obj);
            return;
        }
        var ret = thenCb(this.value);
        thenPResolve(ret);
    }

    resolve(value) {
        this.state = MPromise.RESOLVED;
        this.value = value
        this.callbacks.forEach(obj => this.handle(obj));
    }
}

const p = new MPromise((resolve, reject) => {
    setTimeout(() => {
        const data = '1'
        resolve(data)
    }, 1000);
})

/**
 * then方法的作用：
 * 返回了一个新的Promise，以让下一个的thenCb执行依赖于上一个的thenP
 * 同时将 thenPResolve 和thenCb推入上一个Promise的队列中
 * 
 * 这样子，上一个Promise执行完后，开始执行 thenPResolve 和thenCb
 * 一旦执行 thenPResolve ，就会开始执行下一个then，这样子then回调函数就按照这种顺序执行
 * 
 * 下一个then的作用也一样：
 * 返回了一个新的Promise，以让下一个的thenCb执行依赖于上一个的thenP
 * 同时将 thenPResolve 和thenCb推入上一个Promise的队列中
 * 
 */

p.then((res) => {
    console.log(res);
    return 'then1'
}).then((res) => {
    console.log(res);
    return 'then2';
}).then((res) => {
    console.log(res);
    return 'then3';
})