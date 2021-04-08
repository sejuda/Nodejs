const express = require("express");
const app = express(); // express는 함수다
const fs = require("fs");
let template = require("./lib/template.js"); // 라우츠인덱스로 넘어가서 필요없어짐
const qs = require("querystring");
const sanitizeHtml = require("sanitize-html"); // 라우츠 토픽으로넘어가서 필요없어짐
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false })); // 바디파서 사용 사용자가 요청할 때마다 bodyParser.urlencoded~ 가 실행됨
const compression = require("compression");
app.use(compression()); // 바디파서 후 컴프레션 실행됨.
const path = require("path"); // 라우츠인덱스로 넘어가서 필요없어짐
// route, routing (갈림길에서 방향을 잡는 path 마다 경로를)
let topicRouter = require("./routes/topic");

let indexRouter = require("./routes/index");

app.use(express.static("public"));
// 미들웨어를 만들어보자
app.use(function (req, res, next) {
  fs.readdir("./data", function (error, filelist) {
    req.list = filelist;
    next(); /* 이 변수에 그 다음에 호출 되어야 할 미들웨어가 담겨있음 */
  });
});
//<홈페이지 부분>

app.use("/topic", topicRouter);
// /topic으로 시작하는 라우터들에게 topicRouter라는 미들웨어를 적용하겠다.
app.use("/", indexRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(3000, () => console.log("Example app listening on port 3000!"));
// 리슨이 실행될때 3000포트에 리슨이 가고 코드가 실행된다 (서버단에서 콘솔확인)
