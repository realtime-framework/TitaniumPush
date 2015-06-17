var ortc = require('co.realtime.ortc');
ortc.clusterUrl = 'http://ortc-developers.realtime.co/server/2.1';
ortc.connectionMetadata = 'Titanium Example';

ortc.addEventListener('onException', function(e) { 
	alert('Exception: '+e.info);
});

ortc.addEventListener('onConnected', function(e) {
	alert('Connected to ORTC server');
	ortc.subscribe('yellow', true);
});

ortc.addEventListener('onDisconnected', function(e) {
	alert('Disconnected');
});

ortc.addEventListener('onSubscribed', function(e) { 
	alert('Subscribed to: '+e.channel);
	alert('Sending a message to: '+e.channel);
	ortc.send(e.channel, 'Message from iPhone');
});

ortc.addEventListener('onUnsubscribed', function(e) { 
	alert('Unsubscribed from: '+e.channel);
	ortc.disconnect();
});

ortc.addEventListener('onMessage', function(e) {
	alert('Message received: '+e.message+' at channel: '+e.channel);
	ortc.unsubscribe(e.channel);
});

ortc.connect('yourAppKey');