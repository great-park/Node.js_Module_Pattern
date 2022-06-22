devkor - api project : review system
"# toy-project-Review-System"

[프로젝트 설명](https://reinvented-stove-1ff.notion.site/node-js-express-e09ad3dd70bb4c9f925fd6911083b507)

# 기초적인 express 개발

다음과 같이 간단하게 express framework을 사용하여 서버 app을 만들 수 있다.

```javascript
const express = require("express");

const app = express();

const members = require("./members"); // db 대체용 파일

app.use(express.json());

app.get("/api/members/:id", (req, res) => {
  const { id } = req.params;
  const member = members.find((m) => m.id === Number(id));
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: "There is no such member" });
  }
});

app.post("/api/members", (req, res) => {
  const newMember = req.body;
  members.push(newMember);
  res.send(newMember);
});

app.listen(3001, () => {
  console.log("Server is listening...");
});
```

index.js에 라우팅과 모듈들이 섞여 있으니 가독성도 떨어지고 유지 보수가 힘들다.

규모가 커진다면, 이러한 방식보다는 **모듈을 이용**하여 프로젝트 파일을 구성함으로써 개선해야 한다.

간단한 프로젝트로 **리뷰 시스템을** express 프레임워크를 사용하여 만들어 볼 것이다. 또한 모듈을 이용하여 프로젝트 구조를 구성함으로써 마치 MVC 패턴의 프레임워크처럼 만들어 볼 것이다. view는 생략

### 1\. 프로젝트 구조

![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ca33f496-2396-4d8a-802c-ad132395a994/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220507T171229Z&X-Amz-Expires=86400&X-Amz-Signature=f6ced4282ec5f1acf2f2d1ae68512899cc9c256ad73635033ab763951e41014b&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

### resource : routes ↔ controllers ↔ dao

routes = request의 url에 따라 라우팅 처리 담당

controllers = 중간 다리 역할, 라우팅에 따른 비즈니스 로직을 처리

dao = data access object, db에 접근하는 실질적인 코드

### config : express, database 기본 설정, 기타 미들웨어 및 Key 값 관리,

해당 프로젝트의 기본적인 설정을 담당한다.

### 2\. index.js

서버 어플리케이션의 최초 진입점인 index.js의 구성은 다음과 같다.

```javascript
const express = require("./config/express");

const server = express();
const port = 3003;
server.listen(port, () => {
  console.log(`🔥Server Is Running At Port ${port}🔥`);
});
```

config/express 에서 require로 가져온 뒤, server에 담고 여기에 listen 메소드를 붙여 서버를 실행 중이다. api 개발에 필요한 기본적인 express의 설정들은 config 내에서 이뤄졌기 때문에 가독성이 훨씬 좋아졌다.

서버를 실행시키면, 우리의 서버는 3003번 포트를 통해 리스닝 중이며, 아무런 오류가 없다면 설정해둔 콜백이 실행되면서 “Server Is Running At Port 3003”이 콘솔에 찍힐 것이다.

### 3\. config

1. express

![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/acc2fa30-792b-4fbf-9309-3568272713c5/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220507T171301Z&X-Amz-Expires=86400&X-Amz-Signature=691c398af5638095770bb4fc2f77cc03369700c98f370942a122c608dcd10de0&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

우선, npm을 통해 받은 express를 불러온 후, app이라는 객체에 담았다.

이후 app에 대해서 설정을 진행한다.

(기본 설정에 대한 설명은 주석에 달아 놓았다. 특히 cors(), json(), compression()은 거의 필수적으로 설정해 두어야 한다.)

이러한 app을 “require("../resource/routes/shopRoute")(app); “와 같이 해당하는 경로로 보내줘서 사용할 수 있도록 구성하였다.

그러면, 해당 경로의 routes에서 express 기반으로 생성된 app 객체를 받아와서 라우팅 처리를 진행하는 것이다.

2. database

![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2c4e5b5d-3f9f-4038-a9e7-5047130e20ae/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220507T171316Z&X-Amz-Expires=86400&X-Amz-Signature=822bd2c09e9a7faf19f7a1b4574e26e83d2c2434b2d6416d6e296ff5f0a36c0d&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

준비한 데이터베이스를 연결하고 pool을 생성한다.

노출되면 안되는 값들은 secret 파일에서 관리하고, 이 파일을 .gitignore에 포함시켜서 관리한다.

### 4\. routes

1. shopRoute.js

```javascript
module.exports = function (app) {
  const shop = require("../controllers/shopController");
  const jwtMiddleware = require("../../config/jwtMiddleware");

  // 1. 가게 전체 조회
  app.get("/shops", shop.getAllShop);

  // 2. 특정 가게 조회
  app.get("/shops/:shopId", shop.getShop);

  // 3. 가게 등록
  app.post("/shops", jwtMiddleware, shop.postShop);

  // 4. 가게의 키워드 등록
  app.post("/shops/:shopId/keywords", jwtMiddleware, shop.postKeyword);

  // 5. 키워드로 가게 검색
  app.get("/shops/keyword/:keywordContent", shop.getShopWithKeyword);
};
```

2. authorRoute.js

```javascript
module.exports = function (app) {
  const author = require("../controllers/authorController");
  // 1. 회원가입
  app.post("/authors", author.postAuthor);

  // 2. 로그인 - > jwt 발급
  app.post("/authors/signIn", author.signIn);
};
```

3. reviewRoute.js

```javascript
module.exports = function (app) {
  const review = require("../controllers/reviewController");
  const jwtMiddleware = require("../../config/jwtMiddleware");

  // 1. 리뷰 등록
  app.post("/reviews/:shopId/:authorId", jwtMiddleware, review.postReview);
};
```

routes에서는 request의 경로에 따라서 그에 해당하는 controller로 전달한다.

이때, 사용자의 검증이 필요한 경우 위와 같이 토큰을 사용하면 된다.

로그인이 성공하여 사용자가 인증된 경우 jwt를 넘겨준 뒤, 인증된 사용자만 호출할 수 있는 API로 요청을 보낼 때, header에 이를 담아서 보냄으로써 검증을 진행한다.

![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8a52194e-63cd-4026-b7c8-e2dee663a875/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220507T171437Z&X-Amz-Expires=86400&X-Amz-Signature=a3c2bbd696e0410036a204c11530a040ac1caf1802a2b9ad5800b5882ae051f6&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

검증은 위와 같이 검증 미들웨어를 장착하여 controller 콜백으로 넘어가기 전 유효한 jwt가 들어왔는지 확인한다.

### 5\. controllers

1. shopController.js

```javascript
const shopDao = require("../dao/shopDao");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");
const { pool } = require("../../config/database");

// 1. 전체 가게 조회
exports.getAllShop = async function (req, res) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getAllShopResult = await shopDao.getAllShop(connection);
  connection.release();

  return res.send(response(baseResponse.SUCCESS, getAllShopResult));
};

// 2. 특정 가게 조회
exports.getShop = async function (req, res) {
  //path : shopId
  const shopId = req.params.shopId;

  const connection = await pool.getConnection(async (conn) => conn);
  const getAllShopResult = await shopDao.getShop(connection, shopId);
  connection.release();

  return res.send(response(baseResponse.SUCCESS, getAllShopResult));
};

// 3. 가게 등록
exports.postShop = async function (req, res) {
  /**
   * Body: shopType, location, shopLongitude, shopLatitude, shopDescription
   */
  const { shopType, location, shopLongitude, shopLatitude, shopDescription } =
    req.body;

  // 필수 값 : 빈 값 체크
  if (!shopType) return res.send(response(baseResponse.SHOP_TYPE_EMPTY));
  if (!location) return res.send(response(baseResponse.LOCATION_EMPTY));
  if (!shopLongitude) return res.send(response(baseResponse.LONGITUDE_EMPTY));
  if (!shopLatitude) return res.send(response(baseResponse.LATITUDE_EMPTY));
  if (!shopDescription)
    return res.send(response(baseResponse.DESCRIPTION_EMPTY));

  //request의 body 값들에 대해서 철저한 검증 진행해야됨. 여기선 빈 값 체크만 수행
  const postShopParams = [
    shopType,
    location,
    shopLongitude,
    shopLatitude,
    shopDescription,
  ];

  const connection = await pool.getConnection(async (conn) => conn);
  const postShopResponse = await shopDao.postShop(connection, postShopParams);
  connection.release();

  return res.send(response(baseResponse.SUCCESS));
};

// 4. 키워드 등록
exports.postKeyword = async function (req, res) {
  //Body: keywordContent , Path: shopId
  const { keywordContent } = req.body;
  const shopId = req.params.shopId;

  //request의 body 값들에 대해서 철저한 검증 진행해야됨. 여기선 빈 값 체크만 수행
  if (!keywordContent)
    return res.send(response(baseResponse.KEYWORD_CONTENT_EMPTY));

  const postKeywordParams = [shopId, keywordContent];

  const connection = await pool.getConnection(async (conn) => conn);
  const postKeywordResponse = await shopDao.postKeyword(
    connection,
    postKeywordParams
  );
  connection.release();
  return res.send(response(baseResponse.SUCCESS));
};

// 5. 키워드로 검색
exports.getShopWithKeyword = async function (req, res) {
  // query : keywordContent
  const keywordContent = req.params.keywordContent;
  if (!keywordContent) {
    return res.send(response(baseResponse.KEYWORD_CONTENT_EMPTY));
  }

  const connection = await pool.getConnection(async (conn) => conn);
  const getShopWithKeyword = await shopDao.getShopWithKeyword(
    connection,
    keywordContent
  );
  connection.release();

  return res.send(response(baseResponse.SUCCESS, getShopWithKeyword));
};
```

2. authorController.js

```javascript
const authorDao = require("../dao/authorDao");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");
const { pool } = require("../../config/database");
const secret_config = require("../../config/secret");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
// 1. 회원가입
exports.postAuthor = async function (req, res) {
  /**
   * Body: loginId, password, authorName, phoneNumber
   */
  const { loginId, password, authorName, phoneNumber } = req.body;

  // 필수 값 : 빈 값 체크
  if (!loginId) return res.send(response(baseResponse.LOGIN_ID_EMPTY));
  if (!password) return res.send(response(baseResponse.PASSWORD_EMPTY));
  if (!authorName) return res.send(response(baseResponse.AUTHOR_NAME_EMPTY));
  if (!phoneNumber) return res.send(response(baseResponse.PHONE_NUMBER_EMPTY));

  // 비밀번호 암호화
  const hashedPassword = await crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");

  //request의 body 값들에 대해서 철저한 검증 진행해야됨. 여기선 빈 값 체크만 수행
  const postAuthorParams = [loginId, hashedPassword, authorName, phoneNumber];

  const connection = await pool.getConnection(async (conn) => conn);
  const postAuthor = await authorDao.postAuthor(connection, postAuthorParams);
  connection.release();

  return res.send(response(baseResponse.SUCCESS));
};

// 2. 로그인
exports.signIn = async function (req, res) {
  const { loginId, password } = req.body;

  // 빈 값 체크
  if (!loginId) return res.send(response(baseResponse.LOGIN_ID_EMPTY));
  if (!password) return res.send(response(baseResponse.PASSWORD_EMPTY));

  // 1. 비밀번호 확인
  const connection = await pool.getConnection(async (conn) => conn);

  const hashedPassword = await crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
  const passwordParams = [loginId, hashedPassword];
  const passwordRows = await authorDao.passwordCheck(
    connection,
    passwordParams
  );

  if (passwordRows[0].password !== hashedPassword) {
    return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
  }

  // 2. authorId 가져오기
  const authorInfoRows = await authorDao.getId(connection, loginId);
  connection.release();

  //토큰 생성
  let token = await jwt.sign(
    {
      authorId: authorInfoRows[0].authorId,
    },
    secret_config.jwtsecret,
    {
      expiresIn: "365d",
      subject: "User",
    }
  );

  const result = response(baseResponse.SUCCESS, {
    jwt: token,
    authodId: authorInfoRows[0].authorId,
  });

  return res.send(result);
};
```

3. reviewController.js

```javascript
const reviewDao = require("../dao/reviewDao");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");
const { pool } = require("../../config/database");

// 1. 리뷰 등록
exports.postReview = async function (req, res) {
  // Body: reviewContent , Path : shopId, authorId
  const { reviewContent } = req.body;
  const shopId = req.params.shopId;
  const authorId = req.params.authorId;

  //request의 body 값들에 대해서 철저한 검증 진행해야됨. 여기선 빈 값 체크만 수행
  if (!reviewContent)
    return res.send(response(baseResponse.REVIEW_CONTENT_EMPTY));

  const connection = await pool.getConnection(async (conn) => conn);
  const postReview = await reviewDao.postReview(
    connection,
    authorId,
    reviewContent
  );

  const reviewId = postReview.insertId;
  const Review = await reviewDao.Review(connection, shopId, reviewId);
  connection.release();

  return res.send(response(baseResponse.SUCCESS));
};
```

컨트롤러는 다양한 역할을 수행한다. 핵심은 route와 dao의 중간 다리 역할이다.

우선, request의 값들이 API 명세서에 명시된 형태로 올바르게 들어왔는지를 확인해야 한다.

정규식 등을 사용하여 body, path, query로 전달되는 값들에 대해서 철저하게 검증해야 하며, 여기서는 편의를 위해 단순히 빈 값으로 들어온 경우만 error response로 처리하였다.

이후 config/database의 설정에 따라 준비한 데이터베이스에 접근하고, dao에 실질적인 데이터베이스 접근에 대한 요청을 보낸다.

dao에서 처리한 결과를 전달 받으면 다시 route로 최종 response를 전달하며 controller의 역할을 마친다.

만약 프로젝트가 거대해지면, controller가 거대해지는 문제가 생긴다. 이는 MVC 패턴의 전형적인 한계이다.

이를 해결하기 위해서 또 다른 모듈을 나누어 역할을 나눌 수 있다. 이렇게 할 시 또 다른 장점으로는 코드의 중복성을 줄일 수 있다는 점이다.

예를 들어 서로 다른 컨트롤러에서 똑같은 로직의 검증 과정이 필요하다고 하자. 이전에는 같은 코드를 각각 작성해야 했기에 중복이 발생하지만, 또 다른 모듈에서 이를 작성하고 서로 다른 컨트롤러에서 이를 불러와서 가져다 쓴다면 중복을 줄이고 가독성이 훨씬 증가된다. 단순히 메소드명만 보고도 어떤 과정을 처리하는지 한 눈에 보이기 때문이다.

### 6\. dao

1. shopDao.js

```javascript
module.exports = {
  getAllShop,
  getShop,
  postShop,
  postKeyword,
  getShopWithKeyword,
};

// 1. 가게 전체 조회
async function getAllShop(connection) {
  const Query1 = `
    select * from Shop
                `;
  const row1 = await connection.query(Query1);
  const result = {
    shopInfo: row1[0],
  };
  return result;
}

// 2. 특정 가게 조회
async function getShop(connection, shopId) {
  const Query1 = `
      select * from Shop where shopId = ?
                  `;
  const Query2 = `
    select S.shopId ,A.authorId,authorName,reviewContent from Review
        inner join ReviewOfShop ROS on Review.reviewId = ROS.reviewId
        inner join Shop S on ROS.shopId = S.shopId
        inner join Author A on Review.authorId = A.authorId
        where ROS.shopId = ?;
                `;
  const row1 = await connection.query(Query1, shopId);
  const row2 = await connection.query(Query2, shopId);
  const result = {
    shopInfo: row1[0],
    review: row2[0],
  };
  return result;
}

// 3. 가게 등록
async function postShop(connection, postShopParams) {
  const Query = `
  INSERT INTO Shop(shopType,location,shopLongitude,shopLatitude,shopDescription) values(?,?,?,?,?);
                    `;
  const [Rows] = await connection.query(Query, postShopParams);
  return Rows;
}

// 4. 키워드 등록
async function postKeyword(connection, postKeywordParams) {
  const Query = `
    INSERT INTO Keyword(shopId, keywordContent) values(?,?);
                      `;
  const [Rows] = await connection.query(Query, postKeywordParams);
  return Rows;
}

// 5. 키워드로 가게 조회
async function getShopWithKeyword(connection, keywordContent) {
  const Query = `
    select distinct S.shopId, shopType, location, shopDescription, keywordContent from Shop S
    inner join Keyword K on S.shopId = K.shopId
    where INSTR(keywordContent, ?) > 0;
                    `;
  const [Rows] = await connection.query(Query, keywordContent);
  return Rows;
}
```

2. authorDao.js

```javascript
module.exports = {
  postAuthor,
  passwordCheck,
  getId,
};

// 1. 회원 가입
async function postAuthor(connection, postShopParams) {
  const Query = `
  INSERT INTO Author(loginId, password, authorName, phoneNumber) VALUES (?,?,?,?);
                      `;
  const [Rows] = await connection.query(Query, postShopParams);
  return Rows;
}

// 2. 비밀번호 확인
async function passwordCheck(connection, passwordParams) {
  const Query = `
    select authorId, password from Author where loginId = ? and password = ?;
                        `;
  const [Rows] = await connection.query(Query, passwordParams);
  return Rows;
}

// 3. id 가져오기
async function getId(connection, loginId) {
  const Query = `
      select authorId from Author where loginId = ?;
                          `;
  const [Rows] = await connection.query(Query, loginId);
  return Rows;
}
```

3. reviewDao.js

```javascript
module.exports = {
  postReview,
  Review,
};

// 1. 리뷰 등록
async function postReview(connection, authodId, reviewContent) {
  const Query1 = `
  Insert into Review(authorId, reviewContent) VALUES (?,?);
                  `;
  const [Rows] = await connection.query(Query1, [authodId, reviewContent]);
  return Rows;
}
async function Review(connection, shopId, reviewId) {
  const Query1 = `
  INSERT INTO ReviewOfShop(shopId, reviewId) VALUES (?,?);
                    `;
  const [Rows] = await connection.query(Query1, [shopId, reviewId]);
  return Rows;
}
```

dao는 오직 데이터베이스에 접근하여 실질적인 데이터 처리를 담당한다.

controller에서 생성한 connection을 가져와서 데이터베이스에 접근하고 쿼리를 실행한다.

우리는 앞서 json관련 설정을 맞췄기 때문에 request의 body를 json으로 전달 받아도 문제없이 처리할 수 있으며, 마찬가지로 응답을 전달할 때도 json형식으로 잘 전달함을 확인할 수 있다.

### 7\. 결론

만약 서두에 작성한 코드와 같이 한 파일에 이 모든 코드를 담았다면 코드의 효율성이 극히 떨어질 것이다. 모듈을 이용하여 역할 별로 코드를 관리하는 것이 훨씬 효율적이다.

여기서는 route, controller, dao 별로 모듈을 나눴지만, 개발하는 서비스의 자원별로 묶을 수도 있고 다양한 패턴이 있다. 상황에 따라 적절한 패턴을 선택하도록 하자

### 8\. ERD

[https://aquerytool.com/aquerymain/index/?rurl=e4c1a74a-38a4-42a5-9999-1d6eb41f8be1&](https://aquerytool.com/aquerymain/index/?rurl=e4c1a74a-38a4-42a5-9999-1d6eb41f8be1&)  
Password : nio485

![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c3542b7d-bc3b-46c7-acee-6c587938aebb/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220507T171609Z&X-Amz-Expires=86400&X-Amz-Signature=d5681717ea6d7ed035d8f0cdda9a626ad3a48ecad36660f0cc39d4961799f1e9&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

### 9\. Reference

[https://askforyou.tistory.com/19](https://askforyou.tistory.com/19)

[https://codingcoding.tistory.com/1308](https://codingcoding.tistory.com/1308)
