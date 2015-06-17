/**
 *  co.realtime.ortc.apns.js - CommonJS wrapper to iOS co.realtime.ortc Titanium module, simplifying the APNS integration. 
 *
 * Note, that if you have placed the module file 'co.realtime.ortc.apns.js' in other directory than your caller code,
 * you will have to provide a relative path to the require call: 'var ORTC = require("../libs/co.realtime.ortc.apns");'
 *
 * For informations how to enable push notification with your Realtime account please follow the instructions at: 
 * http://messaging-public.realtime.co/documentation/starting-guide/mobilePushAPNS.html
 * 
 * Requirements: Titanium SDK >= 3.4
 */

var ortc = require('co.realtime.ortc');

var wrap = {clusterUrl:null, url:null, connectionMetadata:null, announcementSubchannel:null, _devId:null};

wrap.connect = function(appKey, authToken){
	if(wrap.clusterUrl)
		ortc.clusterUrl = wrap.clusterUrl;
	if(wrap.url)
		ortc.url = wrap.url;
	if(wrap.connectionMetadata)
		ortc.connectionMetadata = wrap.connectionMetadata;
	if(wrap.announcementSubchannel)
		ortc.announcementSubchannel = wrap.announcementSubchannel;
	if(authToken)
		ortc.connect(appKey, authToken);
	else
		ortc.connect(appKey);
};

wrap.subscribeWithNotifications = function(channelName, subscribeOnReconnect){
	if(wrap._devId){
		ortc.setDeviceId(wrap._devId);
		ortc.subscribeWithNotifications(channelName, subscribeOnReconnect);
	} else {
		var cbSuccess = function(e) {
		    	wrap._devId = e.deviceToken.toString();
		    	ortc.setDeviceId(wrap._devId);
		    	ortc.subscribeWithNotifications(channelName, subscribeOnReconnect);
		   };
		var cbError = function(e) {
		    	ortc.fireEvent('onException', {info:'APNS registration error: ' + e.message});
		   };
		var cbCallback = function(e) {
		    	//ortc.passNotification(e.data);
		    	ortc.ortc.fireEvent('onNotification',e.data);
		   };
		
		if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
		    function registerForPush() {
		        Ti.Network.registerForPushNotifications({
		            success: cbSuccess,
		            error: cbError,
		            callback: cbCallback
		        });
		        // Remove event listener once registered for push notifications
		        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
		    };
		 
			// Wait for user settings to be registered before registering for push notifications
		    Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);
		 
		    // Register notification types to use
		    Ti.App.iOS.registerUserNotificationSettings({
			    types: [
		            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
		            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
		            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
		        ]
		    });
		
		} else {
		    // For iOS 7 and earlier
		    Ti.Network.registerForPushNotifications({
		        // Specifies which notifications to receive
		        types: [
		            Ti.Network.NOTIFICATION_TYPE_BADGE,
		            Ti.Network.NOTIFICATION_TYPE_ALERT,
		            Ti.Network.NOTIFICATION_TYPE_SOUND
		        ],
		        success: cbSuccess,
		        error: cbError,
		        callback: cbCallback
		    });
		}

	}
};

wrap.addEventListener = ortc.addEventListener;
wrap.disconnect = ortc.disconnect;
wrap.subscribe = ortc.subscribe;
wrap.unsubscribe = ortc.unsubscribe;
wrap.send = ortc.send;
wrap.isSubscribed = ortc.isSubscribed;
wrap.isConnected = ortc.isConnected;
wrap.presence = ortc.presence;

wrap.getHeartbeatTime = ortc.getHeartbeatTime;
wrap.setHeartbeatTime = ortc.setHeartbeatTime;
wrap.getHeartbeatFails = ortc.getHeartbeatFails;
wrap.setHeartbeatFails = ortc.setHeartbeatFails;
wrap.isHeartbeatActive = ortc.isHeartbeatActive;
wrap.enableHeartbeat = ortc.enableHeartbeat;
wrap.disableHeartbeat = ortc.disableHeartbeat;

var cbSuccess = function(e) {
		    	wrap._devId = e.deviceToken.toString();
		    	ortc.setDeviceId(wrap._devId);

};
var cbError = function(e) {

};
var cbCallback = function(e) {
    	ortc.passNotification(e.data);
};

if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
    function registerForPush() {
        Ti.Network.registerForPushNotifications({
            success: cbSuccess,
            error: cbError,
            callback: cbCallback
        });
        // Remove event listener once registered for push notifications
        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
    };
 
	// Wait for user settings to be registered before registering for push notifications
    Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);
 
    // Register notification types to use
    Ti.App.iOS.registerUserNotificationSettings({
	    types: [
            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
        ]
    });

} else {
    // For iOS 7 and earlier
    Ti.Network.registerForPushNotifications({
        // Specifies which notifications to receive
        types: [
            Ti.Network.NOTIFICATION_TYPE_BADGE,
            Ti.Network.NOTIFICATION_TYPE_ALERT,
            Ti.Network.NOTIFICATION_TYPE_SOUND
        ],
        success: cbSuccess,
        error: cbError,
        callback: cbCallback
    });
}




module.exports = wrap;


