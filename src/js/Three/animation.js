
function moveBackAnimate(dom, shadow, cell) {//拖拽距离不够回退的动画
  let x = cell.x; let y = cell.y;
  let moveX = cell.moveX; let moveY = cell.moveY;
  dom.animate(
    [
      { top: `calc(50% + ${y * 112 - 223 + moveY}px)`, left: `calc(50% + ${x * 82 - 158 + moveX}px)` },
      { top: `calc(50% + ${y * 112 - 223}px)`, left: `calc(50% + ${x * 82 - 158}px)` }
    ],
    {
      duration: 150,
    }
  ); shadow.animate(
    [
      { top: `calc(50% + ${y * 112 - 220 + moveY}px)`, left: `calc(50% + ${x * 82 - 158 + moveX}px)` },
      { top: `calc(50% + ${y * 112 - 220}px)`, left: `calc(50% + ${x * 82 - 158}px)` }
    ],
    {
      duration: 150,
    }
  );
  setTimeout(() => { //归位,使得animation.js中复位时回到正确的位置
    cell.moveX = 0;
    cell.moveY = 0;
  }, 5);
}

function moveToAnimate(dom, shadow, cell, dir, moveDuration) {//moveDuration = this.mergeDelayTime

  let x = cell.x; let y = cell.y;
  let moveX = cell.moveX; let moveY = cell.moveY;
  let toX = 0, toY = 0;
  switch (dir) {
    case 'up': toY = -112; break;
    case 'down': toY = 112; break;
    case 'left': toX = -82; break;
    case 'right': toX = 82; break;
  }
  dom.animate(
    [
      { top: `calc(50% + ${y * 112 - 223 + moveY}px)`, left: `calc(50% + ${x * 82 - 158 + moveX}px)` },
      { top: `calc(50% + ${y * 112 - 223 + toY}px)`, left: `calc(50% + ${x * 82 - 158 + toX}px)` },
    ],
    {
      duration: moveDuration,
      // fill: 'forwards',
    }
  );
  shadow.animate(
    [
      { top: `calc(50% + ${y * 112 - 220 + moveY}px)`, left: `calc(50% + ${x * 82 - 158 + moveX}px)` },
      { top: `calc(50% + ${y * 112 - 220 + toY}px)`, left: `calc(50% + ${x * 82 - 158 + toX}px)` },
    ],
    {
      duration: moveDuration,
      // fill: 'forwards',
    }
  );
  setTimeout(() => {
    switch (dir) {
      case 'up': cell.y--; break;
      case 'down': cell.y++; break;
      case 'left': cell.x--; break;
      case 'right': cell.x++; break;
    }
    cell.moveX = 0; cell.moveY = 0;
  }, 5)
}


function mergeFromAnimate(dom, shadow, durationTime) { //合并动画
  dom.animate(
    [
      { transform: ' rotateY(0deg) ' },
      { transform: ' rotateY(45deg) ' },
      { transform: ' rotateY(90deg) ' },
    ],
    {
      duration: durationTime,
    }
  );
  shadow.animate(
    [
      { transform: ' rotateY(0deg) ' },
      { transform: ' rotateY(45deg) ' },
      { transform: ' rotateY(90deg) ' },
    ],
    {
      duration: durationTime,
    }
  );
}

function mergeToAnimate(dom, shadow, durationTime) { //合并动画
  dom.animate(
    [
      { transform: ' rotateY(90deg)' },
      { transform: ' rotateY(45deg)' },
      { transform: ' rotateY(0deg)' },
    ],
    {
      duration: durationTime,
    }
  );
  shadow.animate(
    [
      { transform: ' rotateY(90deg)' },
      { transform: ' rotateY(45deg)' },
      { transform: ' rotateY(0deg)' },
    ],
    {
      duration: durationTime,
    }
  );
}
function mergeMaxToAnimate(dom, shadow, duraMaxTime, shadowDuraTime) { //合并动画
  dom.animate(
    [
      { transform: ' rotateY(90deg) translateY(0px)' },
      { transform: ' rotateY(75deg) translateY(-5px)' },
      { transform: ' rotateY(60deg) translateY(-10px)' },
      { transform: ' rotateY(45deg) translateY(-15px)' },
      { transform: ' rotateY(30deg) translateY(-20px)' },
      { transform: ' rotateY(15deg) translateY(-20px)' },
      { transform: ' rotateY(15deg) translateY(-20px)' },
      { transform: ' rotateY(0deg) translateY(-20px)' },
      { transform: ' rotateY(0deg) translateY(0px)' },
      { transform: ' rotateY(0deg) translateY(0px)' },
      { transform: ' rotateY(0deg) translateY(-15px)' },
      { transform: ' rotateY(0deg) translateY(-15px)' },
      { transform: ' rotateY(0deg) translateY(-15px)' },
      { transform: ' rotateY(0deg) translateY(-15px)' },
      { transform: ' rotateY(0deg) translateY(0px)' },
    ],
    {
      duration: duraMaxTime,
    }
  );
  shadow.animate(
    [
      { transform: ' rotateY(90deg)' },
      { transform: ' rotateY(45deg)' },
      { transform: ' rotateY(0deg)' },
    ],
    {
      duration: shadowDuraTime,
    }
  );
}

function friendAnimate(dom, friendDuraTime) { //合并动画
  dom.animate(
    [
      { transform: ' translateY(-5px)' },
      { transform: ' translateY(-10px)' },
      { transform: ' translateY(-15px)' },
      { transform: ' translateY(-15px)' },
      { transform: ' translateY(-15px)' },
      { transform: ' translateY(-15px)' },
      { transform: ' translateY(0px)' },
      { transform: ' translateY(0px)' },
      { transform: ' translateY(-15px)' },
      { transform: ' translateY(-15px)' },
      { transform: ' translateY(-15px)' },
      { transform: ' translateY(-15px)' },
      { transform: ' translateY(0px)' },
    ],
    {
      duration: friendDuraTime,
    }
  );
  // shadow.animate(
  //   [
  //     { transform: ' rotateY(90deg)' },
  //     { transform: ' rotateY(45deg)' },
  //     { transform: ' rotateY(0deg)' },
  //   ],
  //   {
  //     duration: 150,
  //   }
  // );
}

// import gsap from 'gsap';
function moveStillAnimate(dom, shadow, cell, dir) {//移动指令可执行,但是无法移动的scale等动画
  let scaleX = 0; let scaleY = 0;
  switch (dir) {
    case 'up': case 'down': scaleX = 1 - Math.abs(cell.moveY) / 3240 * 30;
      scaleY = 1 + Math.abs(cell.moveY) / 3240 * 30; break;
    case 'left': case 'right': scaleX = 1 + Math.abs(cell.moveX) / 1640 * 30;
      scaleY = 1 - Math.abs(cell.moveX) / 1640 * 30; break;
  }
  dom.animate(
    [
      { top: `calc(50% + ${cell.y * 112 - 223 + cell.moveY}px)`, left: `calc(50% + ${cell.x * 82 - 158 + cell.moveX}px)`, transform: `scale(${scaleX},${scaleY})` },
      { top: `calc(50% + ${cell.y * 112 - 223}px)`, left: `calc(50% + ${cell.x * 82 - 158}px)`, transform: `scale(1,1)` }
    ],
    {
      duration: 150,
    }
  );
  shadow.animate(
    [
      { top: `calc(50% + ${cell.y * 112 - 220 + cell.moveY}px)`, left: `calc(50% + ${cell.x * 82 - 158 + cell.moveX}px)`, transform: `scale(${scaleX},${scaleY})` },
      { top: `calc(50% + ${cell.y * 112 - 220}px)`, left: `calc(50% + ${cell.x * 82 - 158}px)`, transform: `scale(1,1)` }
    ],
    {
      duration: 150,
    }
  );
  setTimeout(() => { //归位,使得animation.js中复位时回到正确的位置
    cell.moveX = 0;
    cell.moveY = 0;
  }, 5);
}

function appearAnimate(dom, shadow, appearDir) {//appearDir表示朝哪里出现,与到达的位置相反,比如到达最下面一行,则从界面下方朝上变换
  let fromX = 0, fromY = 0;
  switch (appearDir) {
    case 'up': fromY = 200; break;
    case 'down': fromY = -200; break;
    case 'left': fromX = 200; break;
    case 'right': fromX = -200; break;
  }
  dom.animate(
    [
      { transform: ` translateX(${fromX}px) translateY(${fromY}px)`, opacity: 0.5 },
      { transform: ' translateX(0px) translateY(0px)', opacity: 1 },
    ],
    {
      duration: 150,
    }
  );
  shadow.animate(
    [
      { transform: ` translateX(${fromX}px) translateY(${fromY}px)`, opacity: 0.5 },
      { transform: ' translateX(0px) translateY(0px)', opacity: 1 },
    ],
    {
      duration: 150,
    }
  );
}

function nextAnimate(dom) {
  dom.animate(
    [
      { transform: `scale(1)`, opacity: 1 },
      { transform: `scale(1)`, opacity: 0.5 },
      { transform: `scale(1)`, opacity: 0.5 },
      { transform: `scale(1.25)`, opacity: 1 },
      { transform: `scale(1.3)`, opacity: 1 },
      { transform: `scale(1.25)`, opacity: 1 },
      { transform: `scale(1)`, opacity: 1 },
      { transform: `scale(1)`, opacity: 1 },
    ],
    {
      duration: 300,
    }
  );
}
import gsap from 'gsap';
function showScore(dom) {
  var tl = gsap.timeline();

  tl.to(dom, { y: 0, opacity: 0, duration: 0.1 });
  tl.to(dom, { y: -36, opacity: 1, duration: 0.4 });

}

function turnOverCard(dom, shadow, durationTime) {

  // var tl = gsap.timeline();

  // tl.to(dom, { y: 0, opacity: 0, duration: 0.1 });
  // tl.to(dom, { y: -30, opacity: 1, duration: 0.4 });

  dom.animate(
    [
      { transform: ' rotateY(0deg) ' },
      { transform: ' rotateY(45deg) ' },
      { transform: ' rotateY(90deg)' },
      { transform: ' rotateY(45deg)' },
      { transform: ' rotateY(0deg)', backgroundColor: '#dddddd' },
    ],
    {
      duration: durationTime,
      fill: 'forwards',
    }
  );
  shadow.animate(
    [
      { transform: ' rotateY(0deg) ' },
      { transform: ' rotateY(45deg) ' },
      { transform: ' rotateY(90deg)' },
      { transform: ' rotateY(45deg)' },
      { transform: ' rotateY(0deg)' },
    ],
    {
      duration: durationTime,
      fill: 'forwards',
    }
  );
}

export {
  mergeFromAnimate, mergeToAnimate, moveBackAnimate, moveToAnimate, moveStillAnimate, mergeMaxToAnimate, friendAnimate, appearAnimate, nextAnimate, showScore, turnOverCard
}