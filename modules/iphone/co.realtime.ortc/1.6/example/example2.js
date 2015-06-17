Titanium.UI.setBackgroundColor('#000');

var ortc = require('co.realtime.ortc');

ortc.addEventListener('onException', function(e) {	
	addRowToEvents('Exception: '+e.info);
});

ortc.addEventListener('onConnected', function(e) {
	addRowToEvents('Connected');
	btConnect.title = 'Disconnect';
});

ortc.addEventListener('onDisconnected', function(e) {
	addRowToEvents('Disconnected');
	btConnect.title ='Connect';
});

ortc.addEventListener('onSubscribed', function(e) { 
	addRowToEvents('Subscribed to channel: '+e.channel);
});

ortc.addEventListener('onUnsubscribed', function(e) { 
	addRowToEvents('Unsubscribed from: '+e.channel);
});

ortc.addEventListener('onMessage', function(e) {
	addRowToEvents('(Channel: '+e.channel+') Message received: '+e.message);
});

ortc.addEventListener('onPresence', function(e) {
	if (e.error != ""){
		addRowToEvents('(Channel: '+e.channel+') Presence error: ' + e.error);
	} else {
		addRowToEvents('(Channel: '+e.channel+') Presence: '+e.result);
	}
});

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

// create base UI tab and root window
var win1 = Titanium.UI.createWindow({  
    title:'Ortc Sample',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    window:win1
});



var btConnect = Titanium.UI.createButton({
	title:'Connect',
	top: 10,
	left: 10,
	width: 135,
	height: 28
});
btConnect.addEventListener('click', function(e) {
	if(btConnect.title == 'Connect') {
		ortc.connectionMetadata = tfConMetadata.value;
		if(cbCluster.value) {
			ortc.clusterUrl = tfUrl.value;
			ortc.url = null;
		} else {
			ortc.clusterUrl = null;
			ortc.url = tfUrl.value;
		}
		if(tfAuthToken.value != '') {
			ortc.connect(tfAppKey.value, tfAuthToken.value);
		} else {
			ortc.connect(tfAppKey.value);
		}
	} else {
		ortc.disconnect();
	}
});
win1.add(btConnect);

var lCluster= Ti.UI.createLabel({
	text: 'Is cluster?',
	top: 15,
	left: 155,
	font: {fontSize:14}
});
win1.add(lCluster);

var cbCluster = Ti.UI.createSwitch({
	value: true,
	top: 10,
	left: 226
});
win1.add(cbCluster);


var lUrl= Ti.UI.createLabel({
	text: 'Url:',
	top: 47,
	left: 10,
	font: {fontSize:14}
});
win1.add(lUrl);

var tfUrl= Titanium.UI.createTextField({
	value: 'http://ortc-developers.realtime.co/server/2.1',
	backgroundColor:'#ffffdd',
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	top: 45,
	left:45,
	width: 260,
	height:23,
	font: {fontSize:12}
});
win1.add(tfUrl);


var lAppKey = Ti.UI.createLabel({
	text: 'Application Key:',
	top: 74,
	left: 10,
	font: {fontSize:14}
});
win1.add(lAppKey);

var tfAppKey = Titanium.UI.createTextField({
	value: 'yourAppKey',
	backgroundColor:'#ffffdd',
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	top: 72,
	left:155,
	width: 150,
	height:23,
	font: {fontSize:14}
});
win1.add(tfAppKey);


var lAuthToken = Ti.UI.createLabel({
	text: 'Authentication Token:',
	top: 101,
	left: 10,
	font: {fontSize:14}
});
win1.add(lAuthToken);

var tfAuthToken= Titanium.UI.createTextField({
	hintText: '123412341234',
	backgroundColor:'#ffffdd',
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	top: 99,
	left:155,
	width: 150,
	height:23,
	font: {fontSize:14}
});
win1.add(tfAuthToken);


var lConnMetadata= Ti.UI.createLabel({
	text: 'Connection Metadata:',
	top: 128,
	left: 10,
	font: {fontSize:14}
});
win1.add(lConnMetadata);

var tfConMetadata= Titanium.UI.createTextField({
	hintText: 'Titanium example',
	backgroundColor:'#ffffdd',
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	top: 126,
	left:155,
	width: 150,
	height:23,
	font: {fontSize:14}
});
win1.add(tfConMetadata);


var lChannel= Ti.UI.createLabel({
	text: 'Channel:',
	top: 167,
	left: 10,
	font: {fontSize:14}
});
win1.add(lChannel);

var tfChannel= Titanium.UI.createTextField({
	value: 'yellow',
	backgroundColor:'#ffffdd',
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	top: 165,
	left:155,
	width: 150,
	height:23,
	font: {fontSize:14}
});
win1.add(tfChannel);

var btSubscribe = Titanium.UI.createButton({
	title:'Subscribe',
	top: 195,
	left: 10,
	width: 135,
	height: 28
});
btSubscribe.addEventListener('click', function(e) {
	ortc.subscribe(tfChannel.value, true);
});
win1.add(btSubscribe);

var btUnsubscribe = Titanium.UI.createButton({
	title:'Unsubscribe',
	top: 195,
	left: 170,
	width: 135,
	height: 28
});
btUnsubscribe.addEventListener('click', function(e) {
	ortc.unsubscribe(tfChannel.value);
});
win1.add(btUnsubscribe);

var btPresence = Titanium.UI.createButton({
	title:'Presence',
	top: 230,
	left: 10,
	width: 135,
	height: 28
});
btPresence.addEventListener('click', function(e) {
	ortc.presence(tfChannel.value);
});
win1.add(btPresence);


var lMessage = Ti.UI.createLabel({
	text: 'Message:',
	top: 265,
	left: 10,
	font: {fontSize:14}
});
win1.add(lMessage);

var btSend = Titanium.UI.createButton({
	title:'Send',
	top: 230,
	left: 170,
	width: 135,
	height: 48
});
btSend.addEventListener('click', function(e) {
	ortc.send(tfChannel.value, taMessage.value);
});
win1.add(btSend);

var taMessage= Titanium.UI.createTextArea({
	value: 'Titanium message...',
	backgroundColor:'#ffffdd',
	borderRadius: 5,
	borderWidth: 1,
	borderColor: '#bbb',
	top: 285,
	left:10,
	width: 295,
	height:70,
	font: {fontSize:14}
});
win1.add(taMessage);


// create controls tab and root window
var win2 = Titanium.UI.createWindow({  
    title:'Event log',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    window:win2
});

var tableview = Ti.UI.createTableView({
  data: []
});
win2.add(tableview);


//  add tabs
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  

// open tab group
tabGroup.open();


function addRowToEvents(text){
	var row = Ti.UI.createTableViewRow();
	var now = new Date();
	var h = now.getHours();
	var m = now.getMinutes();
	var s = now.getSeconds();
	if(h<10) h = '0' + h;
	if(m<10) m = '0' + m;
	if(s<10) s = '0' + s;
	var time = h+':'+m+':'+s;
	var lTime = Ti.UI.createLabel({
		text: time,
		font: {fontSize:11},
		top: 3,
		left: 5,
		color: '#aaa'
	});
	var lText = Ti.UI.createLabel({
		text: text,
		font: {fontSize:13},
		top: 18,
		left:5
	});
	row.add(lTime);
	row.add(lText);
	tableview.appendRow(row);
}