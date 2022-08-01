const p = new Promise((resolve) => {
    resolve(22)
})

const p1 = p.then(() => {
    console.log(1);
})
console.log(p1, 'p1')

const p2 = p1.then(() => {
    console.log(2);
})
console.log(p2, 'p2')