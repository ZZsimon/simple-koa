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

// 每一个Promise的then方法都会注册函数
// 这个注册的函数里包含了当前then返回的Promise的resolve方法
// 所以一旦当前then注册的函数执行，就会修改当前then返回的Promise状态
// 一旦修改了状态，就会开始执行下一个then方法，因为下一个then方法是当前then返回的Promise调用的

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