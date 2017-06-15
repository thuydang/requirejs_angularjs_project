package de.gtarc.auvegos.embeddedwebagent.webapp.servlet;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import de.gtarc.auvegos.embeddedwebagent.beans.EmbeddedWebBean;

public class HelloServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5399497203797732184L;

	private EmbeddedWebBean bean;

	public HelloServlet(EmbeddedWebBean bean) {
		
		try {
			this.bean = bean;
		} catch (Exception e) { 
			System.out.println("Bean INSTANCE may not be instantiated before being passed to Servlet constructor");
			e.printStackTrace();
		}
	}
	
	protected void service(HttpServletRequest req, HttpServletResponse resp) 
			throws ServletException, IOException {
		Writer w = resp.getWriter();
		w.write(doIndividualRequest(req));
		w.flush();
	}
	public String doIndividualRequest(HttpServletRequest request) {
		//return bean.callTCPPong();
		bean.startWebNetworkSubscription();
		return bean.callTCPPong();
	}
}
