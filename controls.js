module.exports = function (controlsData, socket) {
  return (async function (msg) {
    console.log(msg);

    switch(msg.type) {
      case 'register':
        socket.join('controls');
        console.log(`socket ${socket.id} joined 'controls'`)
        controlsData.sendAll();
        break;
      case 'mode':
        controlsData.setMode(msg.label);
        break;
      case 'picker':
        controlsData.setColor(msg.index, msg.hexColor);
        break;
    }
  });
};