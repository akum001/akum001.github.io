window.addEventListener('load', () => {
  const canvas = document.getElementById('signature-pad');
  const context = canvas.getContext('2d');
  let isDrawing = false;
  let previousX = 0;
  let previousY = 0;

  context.lineCap = 'round'; // Set lineCap to 'round' for smoother lines
  context.lineWidth = 2; // Increase line width for better visibility

  function startDrawing(e) {
    isDrawing = true;
    [previousX, previousY] = getCoordinates(e);
    drawDot(previousX, previousY);
  }

  function draw(e) {
    if (!isDrawing) return;
    const [currentX, currentY] = getCoordinates(e);

    drawDot(currentX, currentY);
    drawLine(previousX, previousY, currentX, currentY);

    [previousX, previousY] = [currentX, currentY];
  }

  function drawDot(x, y) {
    context.beginPath();
    context.arc(x, y, context.lineWidth / 2, 0, 2 * Math.PI);
    context.fill();
  }

  function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function getCoordinates(e) {
    let clientX, clientY;

    if (e.type.startsWith('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const { top, left } = canvas.getBoundingClientRect();
    return [clientX - left, clientY - top];
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function saveCanvas() {
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempContext.fillStyle = 'white';
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempContext.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    link.download = 'signature.png';
    link.click();
  }

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);

  const clearButton = document.getElementById('clear-button');
  clearButton.addEventListener('click', clearCanvas);

  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', saveCanvas);
});
