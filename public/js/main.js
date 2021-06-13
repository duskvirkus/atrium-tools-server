const socket = io();
let colorPicker;
let mainContainer;

let modeContainer;
let modes = [];

let pickerContainer;
let pickers = [];

let pickersVisible = false;

function setup() {
  noCanvas();

  socket.on('sControls', (msg) => {
    switch (msg.type) {
      case 'mode':
        updateMode(msg.label);
        break;
      case 'colors':
        updateColors(msg.hexColors);
        break;
    }
  });

  mainContainer = createDiv();
  mainContainer.id('main-container');

  modeContainer = createDiv();
  modeContainer.id('mode-container');
  modeContainer.parent(mainContainer);

  modeNames = ['atrium', 'clothes', 'custom'];
  for (let i = 0; i < modeNames.length; ++i) {
    const button = createButton(modeNames[i]);
    button.mousePressed(modeEventFactory(button));
    button.parent(modeContainer);
    modes.push(button);
  }

  pickerContainer = createDiv();
  pickerContainer.id('picker-container');
  pickerContainer.parent(mainContainer);

  for (let i = 0; i < 3; ++i) {
    pickers.push(getColorPicker('', i));
  }

  socket.emit('control', {
    type: 'register',
  });
}

function updateMode(mode) {
  for (let i = 0; i < modes.length; ++i) {
    modes[i].removeClass('active-mode');
    if (modes[i].elt.innerText === mode) {
      modes[i].addClass('active-mode');
    }

    if (mode === 'custom') {
      pickerContainer.removeClass('hidden');
      pickersVisible = false;
    } else {
      pickerContainer.addClass('hidden');
      pickersVisible = true;
    }
  }
  
}

function getColorPicker(startColor, index) {
  const picker = createColorPicker(startColor);
  picker.input(pickerEventFactory(index, picker));
  picker.parent(pickerContainer);
  return picker;
}

function updateColors(colors) {
  if (pickers.length > 0 && colors.length === pickers.length) {
    for (let i = 0; i < pickers.length; ++i) {
      pickers[i].remove();
      pickers[i] = getColorPicker(colors[i], i);
    }
  }
}

function modeEventFactory(button) {
  let func = function() {
    socket.emit('control', {
      type: 'mode',
      label: this.elt.innerText,
    });
  }
  func.bind(button);
  return func;
}

function pickerEventFactory(index, picker) {
  let func = function() {
    const c = this.value();
    socket.emit('control', {
      type: 'picker',
      index: index,
      hexColor: c,
    });
  };
  func.bind(picker);
  return func;
}
