function size(num) {
  if (num < 10) return '52';
  else if (num < 100) return '48';
  else if (num < 1000) return '42';
  else if (num < 10000) return '34';
  else return '30';
}

function borderBottom(num) {
  if (num < 3)
    return '6px solid rgba(84, 77, 77, 0.591);'
  else
    return '6px solid rgba(165, 165, 0, 0.591);'
}

function zIndex(cell, dir) {
  if (cell.canMerge) {
    if (dir === 'up' && cell.num >= 3) return 1;
    else return 3;
  }
  else return 2;
}

function color(num) {
  if (num < 3) return '#ffffff';
  else return '#06101A';
}

function nextSize(num) {
  if (num < 10) return '44';
  else if (num < 100) return '36';
  else if (num < 1000) return '24';
  else if (num < 10000) return '16';
  else return '12';
}

function bgCellColor(num, darkMode, trigger) {
  if (trigger) {
    switch (num) {
      case 1: return '#92ABB3';
      case 2: return '#856F6F';
      // default: return '#FACA45';
    }
  }

  if (num === 1) return '#14c4E4';
  if (num === 2) return '#ff4f6f';
  if (!darkMode) return '#FAFAFA';
  else return '#aAaAaA';
}

function height(num) {
  if (num < 24) return 99;
  else return 92;
}
function bgCardColor(num, trigger) {
  if (trigger) {
    switch (num) {
      case 1: return '#527B73';
      case 2: return '#353F4F';
      // default: return '#FACA45';
    }
  }
  switch (num) {
    case 1: return '#34a4d4';
    case 2: return '#b84136';
    default: return '#FACA45';
  }
}

export { size, borderBottom, zIndex, color, nextSize, bgCellColor, height, bgCardColor }