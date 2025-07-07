import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Quote } from '@/types/quotes';
import { formatCurrency, formatArea, calculateTotalArea } from '@/lib/calculator-utils';

export class PDFService {
  generateQuotePDF(quote: Quote): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Colors
    const primaryColor = '#2563eb';
    const grayColor = '#6b7280';
    const darkColor = '#111827';
    
    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Company Logo/Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('PakeAja CRM', 20, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Solusi CRM Coating & Painting', 20, 32);
    
    // Quote Number and Date
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Quote: ${quote.quote_number}`, pageWidth - 20, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(quote.created_at).toLocaleDateString()}`, pageWidth - 20, 28, { align: 'right' });
    doc.text(`Expires: ${quote.expires_at ? new Date(quote.expires_at).toLocaleDateString() : 'N/A'}`, pageWidth - 20, 35, { align: 'right' });
    
    let yPos = 60;
    
    // Client Information
    doc.setTextColor(darkColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Informasi Klien', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${quote.client_name}`, 20, yPos);
    yPos += 6;
    doc.text(`Email: ${quote.client_email}`, 20, yPos);
    yPos += 6;
    doc.text(`Phone: ${quote.client_phone}`, 20, yPos);
    yPos += 6;
    doc.text(`Address: ${quote.project_address}`, 20, yPos);
    
    yPos += 20;
    
    // Project Information
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Informasi Proyek', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Project: ${quote.project_name}`, 20, yPos);
    yPos += 6;
    doc.text(`Date: ${new Date(quote.project_date).toLocaleDateString()}`, 20, yPos);
    yPos += 6;
    doc.text(`Total Area: ${formatArea(quote.total_area)}`, 20, yPos);
    
    yPos += 20;
    
    // Surface Details
    if (quote.calculator_data.surfaces && quote.calculator_data.surfaces.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Detail Permukaan', 20, yPos);
      yPos += 10;
      
      const surfaceData = quote.calculator_data.surfaces.map((surface, index) => [
        surface.name,
        surface.surfaceType,
        `${surface.length} × ${surface.width} ft`,
        surface.quantity.toString(),
        surface.condition,
        formatArea(surface.length * surface.width * surface.quantity)
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Surface', 'Type', 'Dimensions', 'Qty', 'Condition', 'Area']],
        body: surfaceData,
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: 255 },
        styles: { fontSize: 9 },
        margin: { left: 20, right: 20 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Coating System
    if (quote.calculator_data.selectedSystem) {
      const system = quote.calculator_data.selectedSystem;
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Sistem Coating', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(system.name, 20, yPos);
      yPos += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(system.description, 20, yPos);
      yPos += 8;
      
      doc.text(`Total Thickness: ${system.totalThickness} mils`, 20, yPos);
      yPos += 6;
      doc.text(`Warranty: ${system.warranty} years`, 20, yPos);
      yPos += 10;
      
      // System components
      const componentData = system.products.map(({ product, coats, thickness }) => [
        product.name,
        product.category,
        `${coats} coat${coats > 1 ? 's' : ''}`,
        `${thickness} mils`,
        formatCurrency(product.pricePerGallon)
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Product', 'Category', 'Coats', 'Thickness', 'Price/Gal']],
        body: componentData,
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: 255 },
        styles: { fontSize: 9 },
        margin: { left: 20, right: 20 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Cost Breakdown
    if (quote.calculator_data.costBreakdown) {
      const cost = quote.calculator_data.costBreakdown;
      
      // Check if we need a new page
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Rincian Biaya', 20, yPos);
      yPos += 15;
      
      // Cost summary table
      const costData = [
        ['Materials', formatCurrency(cost.materials.totalMaterialCost)],
        ['Labor', formatCurrency(cost.labor.totalLaborCost)],
        ['Equipment', formatCurrency(cost.equipment.totalEquipmentCost)],
        ['Additional Costs', formatCurrency(cost.additionalCosts.reduce((sum, c) => sum + c.cost, 0))],
        ['Subtotal', formatCurrency(cost.subtotal)],
        [`Overhead (${cost.overhead}%)`, formatCurrency(cost.subtotal * (cost.overhead / 100))],
        [`Profit (${cost.profit}%)`, formatCurrency(cost.subtotal * (cost.profit / 100))],
        [`PPN (${cost.tax || cost.ppn || 11}%)`, formatCurrency((cost.subtotal + cost.subtotal * (cost.overhead / 100) + cost.subtotal * (cost.profit / 100)) * ((cost.tax || cost.ppn || 11) / 100))],
      ];
      
      autoTable(doc, {
        startY: yPos,
        body: costData,
        theme: 'plain',
        styles: { 
          fontSize: 11,
          cellPadding: 4,
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 20, right: 20 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 10;
      
      // Total
      doc.setFillColor(primaryColor);
      doc.rect(20, yPos, pageWidth - 40, 15, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL BIAYA PROYEK', 25, yPos + 10);
      doc.text(formatCurrency(cost.totalCost), pageWidth - 25, yPos + 10, { align: 'right' });
      
      yPos += 20;
      
      // Cost per sq ft
      doc.setTextColor(grayColor);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Biaya per m²: ${formatCurrency(cost.totalCost / quote.total_area)}`, pageWidth - 25, yPos + 5, { align: 'right' });
    }
    
    // Footer
    const footerY = doc.internal.pageSize.height - 30;
    doc.setTextColor(grayColor);
    doc.setFontSize(8);
    doc.text('Terima kasih telah memilih PakeAja CRM untuk kebutuhan coating Anda.', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Penawaran ini berlaku selama 30 hari dari tanggal penerbitan.', pageWidth / 2, footerY + 6, { align: 'center' });
    
    if (quote.notes) {
      doc.text(`Notes: ${quote.notes}`, 20, footerY + 12);
    }
    
    // Save the PDF
    doc.save(`Quote_${quote.quote_number}_${quote.project_name.replace(/\s+/g, '_')}.pdf`);
  }
}

export const pdfService = new PDFService();