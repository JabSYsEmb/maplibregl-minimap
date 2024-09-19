export function getRandomUUID() {
    if (window.crypto.getRandomValues && typeof window.crypto.getRandomValues === 'function') {
        const random_arr = new Uint16Array(2);
        return parseInt(window.crypto.getRandomValues(random_arr).join(""));
    }

    const randomArray = new Array(3);
    for (let x = 0; x < 3; ++x) {
        randomArray.push(Math.floor(Date.now() * Math.random()).toString(36))
    }

    return parseInt(randomArray.join(''));
}
