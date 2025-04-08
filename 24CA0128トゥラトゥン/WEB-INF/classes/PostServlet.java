import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.RequestDispatcher;
import java.util.ArrayList;
import java.util.List;
import model.Post;
@WebServlet("/postservlet")
public class PostServlet extends HttpServlet {
    private List<Post> posts;
    public void doPost(HttpServletRequest req, HttpServletResponse res)
    throws IOException, ServletException{
        String name = req.getParameter("name");
        String sex = req.getParameter("sex");
        String message = req.getParameter("message");
        String fontColor = req.getParameter("fontColor");
        String fontSize = req.getParameter("fontSize");
        String fontWeight = req.getParameter("fontWeight");
        ServletContext sc = this.getServletContext();
        if(name == null || name.isEmpty()){
            RequestDispatcher d = req.getRequestDispatcher("/post.html");
            d.forward(req, res);
            return;
        }
        if(message == null || message.isEmpty()){
            RequestDispatcher d = req.getRequestDispatcher("/post.html");
            d.forward(req, res);
            return;
        }
        Post post = new Post(name, sex, message, fontColor, fontSize, fontWeight);
        List<Post> posts = (List<Post>)sc.getAttribute("posts");
        if(posts == null){
            posts = new ArrayList<>();
        }
        posts.add(post);
        sc.setAttribute("posts", posts);

        RequestDispatcher d = req.getRequestDispatcher("/bbs.jsp");
        d.forward(req, res);
    }
}
