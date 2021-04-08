let express = require("express");
let router = express.Router();
// 라우터라는 객체를 리턴해주기로 약속되어있음.
let path = require("path");
let fs = require("fs");
let sanitizeHtml = require("sanitize-html");
let template = require("../lib/template.js");

router.get("/create", (req, res) => {
  fs.readdir("./data", function (error, filelist) {
    var title = "WEB - create";
    var list = template.list(req.list);
    var html = template.HTML(
      title,
      list,
      `
                <form action="/topic/create_process" method="post">
                  <p><input type="text" name="title" placeholder="title"></p>
                  <p>
                    <textarea name="description" placeholder="description"></textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
              `,
      ""
    );
    res.send(html);
  });
});
router.post("/create_process", (req, res) => {
  // let body = "";
  // req
  //   .on("data", (data) => {
  //     body = body + data;
  //   })
  //   .on("end", () => {
  //     /* 더이상 데이터가 없을떄 end 그러나 바디 파서로 훨씬 간단히 할 수 있다. */
  //     let post = qs.parse(body);
  //     let title = post.title;
  //     let description = post.description;
  //     fs.writeFile(`data/${title}`, description, "utf8", (err) => {
  //       res.writeHead(302, { Location: `/?id=${title}` });
  //       res.end();
  //     });
  //   });

  // ! bodyParser 장착! body 로 접근가능하게 만들어줌
  let post = req.body;
  let title = post.title;
  let description = post.description;
  fs.writeFile(`data/${title}`, description, "utf8", (err) => {
    // res.writeHead(302, { Location: `/?id=${title}` });
    // res.end();
    res.redirect(`/topic/${title}`);
  });
});
router.get("/update/:pageId", (req, res) => {
  var filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
    var title = req.params.pageId;
    var list = template.list(req.list);
    var html = template.HTML(
      title,
      list,
      `
                  <form action="/topic/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                      <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                      <input type="submit">
                    </p>
                  </form>
                  `,
      `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
    );
    res.send(html);
  });
});

router.post("/update_process", (req, res) => {
  var post = req.body;

  var id = post.id;
  var title = post.title;
  var description = post.description;

  fs.writeFile(`data/${title}`, description, "utf8", function (err) {
    // res.writeHead(302, { Location: `/?id=${title}` });
    // res.end();
    res.redirect(`/topic/${title}`); /* `/?id=${title}` 이경로도됨 */
  });
});

router.post("/delete_process", (req, res) => {
  var post = req.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    // res.writeHead(302, { Location: `/` });
    // res.end();  <-- 이게 원래 리다이렉트 코드
    res.redirect("/"); /*  < -- '/' 경로로 리다이렉트 */
  });
});

// get 은 첫번째 인자 경로, 두번쨰 콜백
//여기로 들어왔을 때 처리하는 라우트 // 진입하는부분 //pageId 값을 지정해주는부분
router.get("/:pageId", (req, res, next) => {
  fs.readdir("./data", function (err, filelist) {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
      if (err) {
        next(err);
      } else {
        var title = req.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags: ["h1"],
        });
        var list = template.list(filelist);
        var html = template.HTML(
          sanitizedTitle,
          list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` <a href="/topic/create">create</a>
                        <a href="/topic/update/${sanitizedTitle}">update</a>
                        <form action="/topic/delete_process" method="post">
                          <input type="hidden" name="id" value="${sanitizedTitle}">
                          <input type="submit" value="delete">
                        </form>`
        );
        res.send(html);
      }
    });
  });
});

module.exports = router;
