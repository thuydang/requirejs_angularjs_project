package de.gtarc.auvegos.embeddedwebagent.webserver.websocket.echo;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
 
/**
 * Example EchoSocket using Annotations.
 */
@WebSocket(maxTextMessageSize = 64 * 1024)
public class AnnotatedEchoSocket {
 
    @OnWebSocketMessage
    public void onText(Session session, String message) {
        if (session.isOpen()) {
            System.out.printf("Echoing back message [%s]%n", message);
            session.getRemote().sendString(message, null);
        }
    }
}