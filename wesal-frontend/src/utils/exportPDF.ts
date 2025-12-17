import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportBagToPDF(bag: any[], totalCost: number) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Wesal - Ramadan Bag", 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  const rows = bag.map((item) => [
    item.name,
    `EGP ${Number(item.price).toLocaleString()}`,
    item.quantityInBag,
    `EGP ${(item.price * item.quantityInBag).toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Product", "Price", "Quantity", "Total"]],
    body: rows,
    theme: 'grid', 
    headStyles: { fillColor: [111, 78, 55] }, 
    styles: { fontSize: 10 },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 40;

  doc.setFontSize(12);
  doc.setTextColor(0); 
  doc.text(
    `Total Bag Cost: EGP ${totalCost.toLocaleString()}`,
    14,
    finalY + 15
  );

  doc.save("ramadan-bag.pdf");
}

export const exportProductsToPDF = (products: any[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text("Wesal - Products Inventory", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  const tableColumn = ["Product Name", "Category", "Price", "Stock", "Merchant"];
  const tableRows = products.map((p) => [
    p.name,
    p.category,
    `EGP ${p.price.toLocaleString()}`,
    `${p.quantity} kg`,
    p.merchant?.name || "-",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [111, 78, 55] }, 
  });

  doc.save("Products_Inventory.pdf");
};