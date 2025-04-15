const MAX_LEN = 7;

export function generate(){
    let ans = "";
    const subset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i=0; i<MAX_LEN; i++){
        ans += subset[Math.floor(Math.random() * subset.length)];
    }
    return ans;
}