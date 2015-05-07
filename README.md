# GossipProtocolProject
A NodeJS implementation of UDP communication. 

Gossip Protocol - Participate Phase:

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

for creating a new JavaScript Class:

module.exports = function() {
    var service = {};
    var privateVariable = "This is a private variable";
    service.sayHelloInEnglish = function() {
        return "HELLO";
    };

    service.sayHelloInSpanish = function() {
        return "Hola";
    };

    service.instanceVariable = "This is an instance variable";

    return service;
};


