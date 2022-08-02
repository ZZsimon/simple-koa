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
        const ret = thenCb(this.value);
        thenPResolve(ret);
    }

    // value是then回调函数返回的值
    resolve(value) {
        // 如果这个值是Promise
        if (value instanceof MPromise) {
            const then = value.then;
            // 下面这行代码实现的效果：
            // 将更改当前then创建的Promsie的resolve方法 注册到了 `当前then的回调函数返回的Promise` 的回调队列中
            // 那，想要 `当前then创建的Promsie` 状态改变，必须执行 `当前then的回调函数返回的Promise`的回调队列中的函数
            // 想要执行 `当前then的回调函数返回的Promise`的回调队列中的函数，必须更改 `当前then的回调函数返回的Promise`的状态
            // 总结：只有then的回调函数返回的Primise执行完毕了，才会更改then的Promise状态，从而继续往后面走
            then.call(value, this.resolve.bind(this));
            return;
        }

        this.state = MPromise.RESOLVED;
        this.value = value
        this.callbacks.forEach(obj => this.handle(obj));
    }
}

const p = new MPromise((resolve, reject) => {
    setTimeout(() => {
        const data = '1'
        // 此时，传入resolve的值是 “1”
        // 直接开始执行 this.handle(obj)
        // 开始执行cb，返回了p11

        // 再次执行resolve方法，此时，传入resolve的值是 “p11”
        // 此时的resolve方法属于p1，也就是第一个then方法创建的Promise
        // 此时的this表示p1

        // 执行 then.call(value, this.resolve.bind(this));
        //      value：表示 p11
        //      也就是调用then方法，then中的this表示p11，其实就是给p11注册回调函数
        //      this.resolve表示p1的resolve方法
        //      也就是说，给p11注册的回调函数是当前then的resolve方法
        //      那么，如果p11状态不更改，p1一直都不会更改状态
        //      当p11更改了状态后，就会调用resolve('then1')
        //      然后再次调用 之前通过p11的then注册的回调函数，就是刚刚注册的 `当前then的resolve方法`
        //      一旦调用 `当前then的resolve方法`，就会更改p1的状态，然后就会调用第二个then方法
        resolve(data)
    }, 1000);
})

p.then((res) => {
    console.log(res, 'res1')
    const p11 = new MPromise((resolve) => {
        setTimeout(() => {
            resolve('then1')
        }, 1000);
    });
    return p11
}).then((res) => {
    console.log(res, 'res2')
    const p13 = new MPromise((resolve) => {
        setTimeout(() => {
            resolve('then2')
        }, 1000);
    });
    return p13
}).then((res) => {
    console.log(res, 'res3')
    return 'then3';
})
