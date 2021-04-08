let express = require("express");
let router = express.Router();
let template = require("../lib/template");
// 여기서 라우터를 써줌
router.get("/", (req, res) => {
  var title = "Welcome";
  var description = "Hello, Node.js";
  var list = template.list(req.list);
  var html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px">
        `,
    `<a href="/topic/create">create</a>`
  );
  /* res.writeHead(200);
       res.end(html);   이 부분을 send로 한번에 할 수 있다.*/

  res.send(html);
});

module.exports = router;
