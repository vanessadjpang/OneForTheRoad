// Export PDF function for planner page
document.getElementById('exportPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const content = document.querySelector("#content");
  
    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
  
      const ratio = imgWidth / pdfWidth;
      const adjustedHeight = imgHeight / ratio;
  
      let heightLeft = adjustedHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, adjustedHeight);
  
      heightLeft -= pdfHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - adjustedHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, adjustedHeight);
        heightLeft -= pdfHeight;
      }
  
      pdf.save("TripItinerary.pdf");
    });
  });

  