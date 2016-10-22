const ConspectioBroadcaster = require('./conspectioBroadcaster.js');

const broadcasterRTCEndpoint = (stream) => {
  conspectio.socket.on('initiateConnection', (viewerId) => {
    console.log('viewer ', viewerId, ' wants to connect');
    var newPC = new ConspectioBroadcaster(viewerId, stream);
    console.log('broadcaster newPC', newPC);
    conspectio.connections[viewerId] = newPC;
    newPC.init();
    newPC.createOfferWrapper();
  });

  conspectio.socket.on('signal', (fromId, message) => {
    var currentPC = conspectio.connections[fromId];
    if(currentPC) {
      if(message.type === 'answer') {
        currentPC.receiveAnswer(message.answer);
      } else if (message.type === 'candidate') {
        currentPC.addCandidate(message.candidate);
      }
    }
  });

  // event listener for viewer has left - clean up conspectio.connections{}
  conspectio.socket.on('viewerLeft', (viewerId) => {
    console.log('viewer ', viewerId, ' has left');
    delete conspectio.connections[viewerId];
  });
};

module.exports = broadcasterRTCEndpoint;