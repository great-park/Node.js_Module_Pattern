const express = require("./config/express");

const server = express();
const port = 3000;
server.listen(port, () => {
  console.log(`🔥Server Is Running At Port ${port}🔥`);
});
//listen vs server : 어짜피 listen 모듈 내에서 http로 감싸기 때문에 똑같다!
