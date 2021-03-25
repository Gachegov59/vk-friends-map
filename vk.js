/* eslint-disable */
VK.init({
    apiId: 7782703
    // apiId: 7802630
})

export function auth() {
    return new Promise((res, rej) => {
        VK.Auth.login(data => {
            if (data.session) {
                res();
            } else {
                rej(new Error('не удалось авторизоватсья'))
            }
        }, 2)
    })
}
export function vkAPI(method, params) {
    params.v = '5.76';

    return new Promise((res, rej) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                rej(data.error);
            } else {
                res(data.response)
            }
        })
    })
}

