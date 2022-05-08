module.exports = function (app) {
  const author = require("../controllers/authorController");
  // 1. 회원가입
  app.post("/authors", author.postAuthor);

  // 2. 로그인 - > jwt 발급
  app.post("/authors/signIn", author.signIn);
};
