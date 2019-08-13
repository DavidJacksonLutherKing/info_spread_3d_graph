//生成nickName
var nickName = getRandomName(4);

//去重算法
while (userCache.hasBindNickName(nickName)) {
    nickName = (new Random().nextInt(10)) + nickName; //昵称去重
    continue; //回调继续
}
console.log(nickName);