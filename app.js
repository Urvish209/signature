document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    // Set up high-DPI scaling
    function setupCanvas(canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }

    setupCanvas(canvas);

    // Function to start drawing
    const startDrawing = (e) => {
        drawing = true;
        draw(e);
    };

    // Function to stop drawing
    const stopDrawing = () => {
        drawing = false;
        ctx.beginPath();
    };

    // Function to draw on the canvas
    const draw = (e) => {
        if (!drawing) return;
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const scaleX = canvas.width / (rect.width * dpr);
        const scaleY = canvas.height / (rect.height * dpr);

        let x, y;
        if (e.touches) {
            x = (e.touches[0].clientX - rect.left) * scaleX;
            y = (e.touches[0].clientY - rect.top) * scaleY;
        } else {
            x = (e.clientX - rect.left) * scaleX;
            y = (e.clientY - rect.top) * scaleY;
        }

        ctx.lineWidth = 2; // Thinner line width
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    // Event listeners for mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    // Event listeners for touch
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchmove', draw);

    // Export canvas as PNG
    document.getElementById('export-png').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'whiteboard.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Export canvas as PDF
    document.getElementById('export-pdf').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('landscape', 'pt', [canvas.width, canvas.height]);

        // Convert canvas to image data URL
        const imgData = canvas.toDataURL('image/png');

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

        // Save the PDF
        pdf.save('whiteboard.pdf');
    });
});
