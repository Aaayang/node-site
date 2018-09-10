function test() {
    return new Promise((resolve,reject) => {
        resolve(222);
    });
}

test().then(data => {
    return Promise.reject();
});