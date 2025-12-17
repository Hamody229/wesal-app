import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportBagToExcel(bag: any[], totalCost: number) {
  const rows = bag.map((item) => ({
    Product: item.name,
    Price: item.price,
    Quantity: item.quantityInBag,
    Total: item.price * item.quantityInBag,
  }));

  rows.push({
    Product: "TOTAL",
    Price: "",
    Quantity: "",
    Total: totalCost,
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Ramadan Bag"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "ramadan-bag.xlsx");
}

export const exportProductsToExcel = (products: any[]) => {
  const data = products.map((p) => ({
    "Product Name": p.name,
    "Category": p.category,
    "Price (EGP)": p.price,
    "Stock (kg)": p.quantity,
    "Merchant": p.merchant?.name || "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
  
  XLSX.writeFile(workbook, "Products_Inventory.xlsx");
};