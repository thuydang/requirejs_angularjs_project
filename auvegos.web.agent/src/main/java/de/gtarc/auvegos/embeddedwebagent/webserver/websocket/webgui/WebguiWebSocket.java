package de.gtarc.auvegos.embeddedwebagent.webserver.websocket.webgui;

import java.util.Arrays;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import de.dailab.auvegos.agents.facts.NetworkInfo;
import de.gtarc.auvegos.embeddedwebagent.webserver.datasource.IDataRequester;
import de.gtarc.auvegos.embeddedwebagent.webserver.datasource.IDataRetriever;
import de.gtarc.auvegos.embeddedwebagent.webserver.datasource.MonitorAgentDataRetriever;
import de.gtarc.auvegos.embeddedwebagent.webserver.utils.NetworkInfoDataAdapter;

/**
 * WebSocket for Web GUI using Annotations.
 */
@WebSocket(maxTextMessageSize = 64 * 1024)
public class WebguiWebSocket implements IDataRequester {
	
	private MonitorAgentDataRetriever dataRetriever;
	// Session b/w 2 endpoints: this server and the connecting client.
	//private Session wsClient;
	private static final Set<Session> wsClients = new CopyOnWriteArraySet<Session>();

	
	/** Use {@link MonitorAgentDataRetriever} as IDataRetriever */
	public WebguiWebSocket(IDataRetriever dataSource) {
    	this.dataRetriever = (MonitorAgentDataRetriever) dataSource;
	}

	@OnWebSocketClose
    public void onClose(Session session, int statusCode, String reason) {
        //server.log("Disconnected: " + this.id + "(" + this.address + ")" + " (statusCode=" + statusCode + ", reason=" + reason + ")");
        //server.removeClient(this);

        System.out.println("Websocket - Disconnected: (statusCode=" + statusCode + ", reason=" + reason + ")");
		wsClients.remove(session);
		if (wsClients.isEmpty()) removeDataRetriever();
    }

    @OnWebSocketError
    public void onError(Session session, Throwable t) {
        //server.log(this.id + "(" + this.address + ") error: " + t.getMessage());
		wsClients.remove(session);
		if (wsClients.isEmpty()) removeDataRetriever();
		System.out.printf("Websocket - ERROR %s", Arrays.toString(t.getStackTrace()));
    }

    private void removeDataRetriever() {
		// TODO this.dataRetriever.destroy();
    }

    @OnWebSocketConnect
    public void onConnect(Session session) {
    	/*
        this.session = session;
        this.address = this.session.getRemoteAddress().getAddress().toString().substring(1);
        this.id = this.address; //Until user is registered their id is their IP
        server.log("New connection: " + this.address);
        server.addClient(this);
        try {
            session.getRemote().sendString("Hello client with address " + this.address + "!");
        } catch (IOException e) {
            server.log("Error in onConnect for " + this.id + "(" + this.address + "): " + e.getMessage());
        }
        */
    	if (wsClients.isEmpty()) {
    		dataRetriever.requestData(this);
    	}
    	System.out.printf("Websocket - New connection: [%s]%n", 
    			session.getRemoteAddress().getAddress().toString());

    	WebguiWebSocket.wsClients.add(session);

    }
	
	@OnWebSocketMessage
	public void onText(Session session, String message) {
		//wsClient = session;

		// new registration of data requester (this). This is destroyed (null) when new websocket is opened????
		dataRetriever.requestData(this);
		System.out.printf("Websocket - Received network info request: [%s]%n", message);
	}

	/** Implementing {@link IDataRequester} method */
	@Override
	public void processData(Object data) {
		// Call all opening client sockets
		System.out.printf("*** Websocket - received backend data [%s]%n", "");

		NetworkInfo networkInfo = (NetworkInfo) data;
				
		for (Session client : wsClients) {
			if (!client.isOpen()) {
				continue;
			}

			if (networkInfo == null) {
				client.getRemote().sendString("{'INFO': 'No Data'}", null);

			} else {

				System.out.printf("*** Websocket - Sending network info to websocket client [%s]%n", 
						client.getRemoteAddress().toString());
				client.getRemote().sendString(new NetworkInfoDataAdapter(networkInfo).getJSONString(), null);
			}
		}
	}
}
