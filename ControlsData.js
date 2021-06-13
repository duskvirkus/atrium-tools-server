
class ControlsData {
  constructor(io) {
    this.io = io;
    this.mode = 'atrium'
    this.hexColors = [];
    for (let i = 0; i < 3; ++i) {
      this.hexColors.push('#0000ff');
    }
  }

  setMode(mode) {
    const validModes = ['atrium', 'clothes', 'custom'];
    let found = false;
    for (let i = 0; i < validModes.length; ++i) {
      if (validModes[i] === mode) {
        found = true;
        break;
      }
    }
    if (found) {
      this.mode = mode;
      this.sendMode();
    }
  }

  setColor(index, color) {
    if (index >= 0 && index < this.hexColors.length) {
      // TODO check if valid hex color
      this.hexColors[index] = color;
      this.sendColors();
    }
  }

  sendAll() {
    this.sendMode();
    this.sendColors();
  }

  sendMode() {
    this.io.to('controls').emit('sControls', {
      type: 'mode',
      label: this.mode,
    });
  }

  sendColors() {
    this.io.to('controls').emit('sControls', {
      type: 'colors',
      hexColors: this.hexColors,
    });
  }
};

module.exports = {ControlsData};
