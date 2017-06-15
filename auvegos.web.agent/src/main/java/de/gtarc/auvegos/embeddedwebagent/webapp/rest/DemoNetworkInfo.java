package de.gtarc.auvegos.embeddedwebagent.webapp.rest;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Arrays;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.eclipse.core.runtime.FileLocator;
import org.eclipse.core.runtime.Platform;
import org.osgi.framework.Bundle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.dailab.acs.core.resources.ResourceManager;
import de.dailab.acs.model.layer.Network;
import de.gtarc.auvegos.embeddedwebagent.webserver.utils.NetworkDataHolder;

@Path("/DemoNetworkInfo")
public class DemoNetworkInfo {
	private NetworkDataHolder networkDataHolder;
	private Logger LOGGER = LoggerFactory.getLogger(this.getClass()); 

	public DemoNetworkInfo() {
		Network networkData = null;

		Bundle bundle = Platform.getBundle("auvegos.web.agent");
		URL fileURL = bundle.getEntry("src/main/resources/AuVeGoS-Experiment.network");
		File file = null;
		try {
		    file = new File(FileLocator.resolve(fileURL).toURI());
		} catch (URISyntaxException e1) {
			LOGGER.info(Arrays.toString(e1.getStackTrace()));
		} catch (IOException e1) {
			LOGGER.info(Arrays.toString(e1.getStackTrace()));
		    // e1.printStackTrace(); // Not good, this just prints to console then swallows the exception. 
		}

		//networkData = new ResourceManager().loadObject(new File("/home/user/file"), Network.class);
		networkData = new ResourceManager().loadObject(file, Network.class);
		
		this.networkDataHolder = new NetworkDataHolder(networkData);

	}
	
	@GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getNetworkInfoFromResource() {
		return networkDataHolder.getJSONString();
    }
}
