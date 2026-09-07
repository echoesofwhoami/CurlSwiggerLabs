export const APPROX_POST_HTML = `<!DOCTYPE html>
<html>
<head>
  <link href=/resources/css/labsBlog.css rel=stylesheet>
  <title>Exploiting DOM clobbering to enable XSS</title>
</head>
<body>
  <script src="/resources/labheader/js/labHeader.js"></script>
  <div id="academyLabHeader">
    <h2>Exploiting DOM clobbering to enable XSS</h2>
  </div>
  <div class="blog-post">
    <h1>Benefits of Travelling</h1>
    <p>Dan Wefixit | 08 August 2026</p>
    <p>Travelling is such an emotive word. It can excite some, scare others...</p>
    <h1>Comments</h1>
    <span id="user-comments">
      <script src="/resources/js/domPurify-2.0.15.js"></script>
      <script src="/resources/js/loadCommentsWithDomClobbering.js"></script>
      <script>loadComments('/post/comment')</script>
    </span>
    <form action="/post/comment" method="POST">
      <textarea name="comment"></textarea>
      <button type="submit">Post Comment</button>
    </form>
  </div>
</body>
</html>
`;
