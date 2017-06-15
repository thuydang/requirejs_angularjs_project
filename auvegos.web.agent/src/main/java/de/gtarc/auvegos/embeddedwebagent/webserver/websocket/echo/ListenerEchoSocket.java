package de.gtarc.auvegos.embeddedwebagent.webserver.websocket.echo;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketListener;
 
/**
 * Not used. Example EchoSocket using Listener.
 * @author dang
 */
public class ListenerEchoSocket implements WebSocketListener {
 
    private Session outbound;
 
    @Override
    public void onWebSocketBinary(byte[] payload, int offset, int len) {
    }
 
    @Override
    public void onWebSocketClose(int statusCode, String reason) {
        this.outbound = null;
    }
 
    @Override
    public void onWebSocketConnect(Session session) {
        this.outbound = session;
    }
 
    @Override
    public void onWebSocketError(Throwable cause) {
        cause.printStackTrace(System.err);
    }
 
    @Override
    public void onWebSocketText(String message) {
        if ((outbound != null) && (outbound.isOpen())) {
            System.out.printf("Echoing back message [%s]%n", message);
            outbound.getRemote().sendString(message, null);
        }
    }
}