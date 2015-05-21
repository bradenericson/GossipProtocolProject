# GossipProtocolProject
A NodeJS implementation of UDP communication. 


The Gossip Protocol Project was a Peer to Peer communication application developed for our Computer Networking Final Project (CISC 370). Our class broke up into teams and developed different implementations of the same model. We were given a standard Java model to follow, but we were allowed to create a NodeJS implementation of the project. Because the application uses the Gossip Protocol, teams were able to create the clients with their language of choice. Most teams safely used Java, but our team adventured out and used NodeJS. Another team used Python, while another team attempted to use Golang. 

To challenge ourselves even farther, we took advantage of JavaScript's prototyping capabilities to write the application object-oriented. 

Our application took advantage of NodeJS' event driven system by creating 4 separate processes to handle the logic of the application. We broke our application down into 4 processes:

[A highlevel view of our architecture](resources/JSP2PUML.png?raw=true "A highlevel view of our architecture")

* UI: The UI class is used to handle all interaction with the end user. A user can type in terminal commands to query the peer community for resources, request resources from the peer community, index and tag their own descriptions, and start and stop the client application.
* Transceiver: The Transceiver class receives and sends all packets to the outside peer community. The transceiver takes the packets, and adds them to a queue until Main is ready to take it for processing. When a packet needs to get sent out to the peer community, the transceiver takes it from the queue, processes it, and sends it out to the IP addresses defined in the AddressBook Class. 
* Main: The Main class handles all processing of packets and commands. Packets that come in from the Transceiver are handled by Main. Main will convert the packet to a UDPMessage Object, and use that to determine what should happen to the request.
 * If the message is a response to a find request we made, the content gets sent to the UI class so it can be displayed to the client user.
 * If the UDPMessage is a response to a request we made, we forward the UDP properties to the ResourceManager Class so we can build the file.
 * If the message is a request for a resource, we send it to our ResourceManager to see if we can fulfill it. 
 * If the ResourceManager could not fulfill the request, it gets sent back to Main which forwards it back to Transceiver to send back to the peer community.

* ResourceManager: The ResourceManager class handles all requests that could be searching for one of our resources, or for building a resource we requested from another peer member. If a find request comes into the ResourceManager and we can fulfill the request, we send a packet for each match we have in our database. When the ResourceManager first starts up, it indexes every new file that exists in the resources folder. We use MongoDB to hold a description, name, and list of tags for each file in our resources folder. We do this so we don't have to go into the filesystem for every request, and it allows us to easily attach tags and a description for each resource (a description is necessary for the protocol to work). 

#Going above and beyond
---

The first steps to the project was getting it to successfully work with peers built with different languages. After meeting the basic requirements, we went above and beyond with a couple unique features to our implementation:

* We used MongoDB to easily reference files on our filesystem without having to go to the filesystem for every request. This also allowed us to add tags and descriptions to our files without having to create additional helper files in the resources folder.
* We created an automated indexing function that automatically indexes new files found in the resource folder into our Mongo database.
* Instead of having Find Requests look for exact matches, we break up the query sentence by words, and search our database for matches based on the different words used and the tags we've assigned to each resource. That way, if an individual searched for "A really fluffy cat", and we only had a "fluffy cat", they would still be able to find our resource. In the class implementation, it had to be an exact match of the description; not very user friendly.
* Created a really cool README and a really cool diagram showing how the different processes work with each other.
* Implemented a TCP communication between the separate processes.
* We documented our code (believe it or not, this was not a requirement).
* We automatically added new files we received from our peer community to the resources folder; that way we could start sharing the files as well.
* we wrote it all in JavaScript.



Gossip Protocol - Participate Phase:
---
1. Query Request
    UDP Message Contents:
        -Request ID
        -Random ID
        -TimeToLive (TTL)
        -Request Text (Message)

2. Response to Query Request
    UDP Message Contents:
        -Response ID
        -Request ID (should be the same Request ID from step 1)
        -TimeToLive (TTL)
        -Random ID + number of matching resources (concatenated together)

3. Request for Response Match
    UDP Message Contents:
        -Request ID
        -Response ID (should be the same as Response ID from step 2)
        -TimeToLive (TTL)
        -Random ID + resource ID of the resource that you are requesting

4. Response to Request for Resource ID
    UDP Message Contents:
        -Response ID
        -Request ID (should be the same Request ID from step 3)
        -TimeToLive (TTL)
        -Resource ID
            -MIME-type
            -byte size
            -Description of Resource

5. Request For Specific Resource
    UDP Message Contents:
        -Request ID
        -Resource ID (Resource ID from step 4)
        -TimeToLive (TTL)
        -Random ID
        -Part Number of Resource

6. Response Request for Part i of Resource
    UDP Message Contents:
        -Response ID
        -Request ID (Request ID from step 5)
        -TimeToLive (TTL)
        -Resource ID
        -Part Number of Resource
        -data.length
        -data


Gossip Protocol - Join Phase:

1. Join Request
    UDP Message Contents:
        -Request ID
        -Zero ID
        -TTL

2. Joiner is the person in charge
    - multicast UDP message out to everyone with their IP
    - Everyone responds with their IP

---



