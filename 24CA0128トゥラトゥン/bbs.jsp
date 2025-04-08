<%@page contentType="text/html ; charset=UTF-8" %>
<%request.setCharacterEncoding("UTF-8"); %>
<%@page import="model.Post" %>
<%@page import="java.util.List" %>
<%@page import="java.util.ArrayList" %>
<!DOCTYPE html>
<html lang = "ja">
    <head>
        <meta charset = "UTF-8">
        <title>bbs jsp</title>
        <link rel="stylesheet" href = "mycss.css">
    </head>
    <body>
        <h1>掲 示 板</h1>
        <h2>- BBS -</h2>
        <%
        ArrayList<Post> posts = (ArrayList<Post>) application.getAttribute("posts");
            if(posts == null || posts.isEmpty()){
                %>
                <div class = "no-posts">
                    <p style="color: red;">現在、投稿はされていません。</p>
                </div>
                <%
            }else{
                int x = 1;
                for(Post post : posts){
                    %>
                    <div class = "post">
                        <p>投稿番号 : <%= x %></p>
                        <p style="font-size: <%= post.getFontSize() %>; color: <%= post.getFontColor() %>; font-weight: <%= post.getFontWeight() %>;">
                                名前 : <%= post.getName() %>
                        </p>
                         <p style="font-size: <%= post.getFontSize() %>; color: <%= post.getFontColor() %>; font-weight: <%= post.getFontWeight() %>;">
                                性別 : <%= post.getSex() %>
                        </p>
                        <p style="font-size: <%= post.getFontSize() %>; color: <%= post.getFontColor() %>; font-weight: <%= post.getFontWeight() %>;">
                                メッセージ : <%= post.getMessage() %>
                         </p>
                    </div>
                    <%
                    x++;
                }
            }
            %>
            <br>
            <a href = "index.html">メニューに戻る</a>
            <footer>
                <p>Copyright &copy; トゥラトゥン(24CA0128), All Rights Reserved.<span>&reg;</span></p>
            </footer>
    </body>
</html>