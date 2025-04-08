import jakarta.servlet.http.HttpServlet;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletContext;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/deleteservlet")
public class DeleteServlet extends HttpServlet {
    public void doGet(HttpServletRequest req, HttpServletResponse res)throws 
    IOException, ServletException{
        ServletContext sc = this.getServletContext();
        sc.removeAttribute("posts");
        RequestDispatcher d = req.getRequestDispatcher("/update.html");
        d.forward(req, res);
    }
}
