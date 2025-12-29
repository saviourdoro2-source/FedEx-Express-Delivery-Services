import jsPDF from "jspdf";
import type { Shipment } from "@shared/schema";

export function generateShippingLabel(shipment: Shipment): void {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [100, 150]
  });

  const primaryColor = "#4B2E83";
  const accentColor = "#FF7A00";

  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 150, 18, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("FedExpress", 10, 12);
  
  doc.setTextColor(accentColor);
  doc.setFontSize(10);
  doc.text("SHIPPING LABEL", 120, 12);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("FROM:", 10, 28);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(shipment.senderName, 10, 34);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(shipment.origin, 10, 40);

  doc.setDrawColor(200, 200, 200);
  doc.line(10, 45, 140, 45);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("TO:", 10, 52);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(shipment.recipientName, 10, 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(shipment.destination, 10, 68);

  doc.setFillColor(primaryColor);
  doc.rect(85, 50, 55, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("TRACKING NUMBER", 90, 56);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(shipment.trackingId, 90, 64);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  
  const barcodeY = 75;
  const barcodeHeight = 12;
  const barWidth = 1.2;
  let xPos = 10;
  
  const trackingStr = shipment.trackingId;
  for (let i = 0; i < trackingStr.length; i++) {
    const charCode = trackingStr.charCodeAt(i);
    const pattern = charCode % 2 === 0 ? [1, 0, 1, 0] : [1, 1, 0, 1];
    
    pattern.forEach((bar) => {
      if (bar) {
        doc.setFillColor(0, 0, 0);
        doc.rect(xPos, barcodeY, barWidth, barcodeHeight, "F");
      }
      xPos += barWidth + 0.3;
    });
    xPos += 1;
  }

  doc.setFontSize(7);
  doc.text(shipment.trackingId, 10, barcodeY + barcodeHeight + 5);

  if (shipment.weightKg) {
    doc.text(`Weight: ${shipment.weightKg} kg`, 100, barcodeY + barcodeHeight + 5);
  }

  doc.setFontSize(6);
  doc.setTextColor(128, 128, 128);
  doc.text(`Created: ${new Date(shipment.createdAt).toLocaleDateString()}`, 10, 96);
  doc.text("This is a demo shipping label", 100, 96);

  doc.save(`shipping-label-${shipment.trackingId}.pdf`);
}
