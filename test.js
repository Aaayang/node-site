/* function test() {
    return new Promise((resolve,reject) => {
        resolve(222);
    });
}

test().then(data => {
    return Promise.reject();
}); */


/* let num = 2;
// 注意这两种写法对输出 num 的影响
// ++ num;
// num + 1;

console.log(num); */

// node 和浏览器中的 toLocaleString 转换出来的结果表示方式是不一样的
console.log(new Date().toLocaleString());