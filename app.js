document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("signatureCanvas");
  const ctx = canvas.getContext("2d");

  // High-DPI canvas setup
  const setupCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  };

  setupCanvas();

  let drawing = false;

  const startDraw = (e) => {
    drawing = true;
    draw(e);
  };

  const endDraw = () => {
    drawing = false;
    ctx.beginPath();
  };

  const draw = (e) => {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#333";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Mouse & touch
  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mouseup", endDraw);
  canvas.addEventListener("mousemove", draw);

  canvas.addEventListener("touchstart", startDraw);
  canvas.addEventListener("touchend", endDraw);
  canvas.addEventListener("touchmove", draw);

  document.getElementById("clear").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  document.getElementById("export-png").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "signature.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  document.getElementById("export-pdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
    pdf.save("signature.pdf");
  });
});
