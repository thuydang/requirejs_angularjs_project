package de.gtarc.auvegos.embeddedwebagent.webserver.websocket.echo;

import javax.servlet.annotation.WebServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;
 
/**
 * Not used. Example of websocket servlet.
 * @author dang
 *
 */
@SuppressWarnings("serial")
@WebServlet(name = "MyEcho WebSocket Servlet", urlPatterns = { "/echo" })
public class MyEchoServlet extends WebSocketServlet {
 
    @Override
    public void configure(WebSocketServletFactory factory) {
        factory.getPolicy().setIdleTimeout(10000);
        factory.register(AnnotatedEchoSocket.class);
    }
}