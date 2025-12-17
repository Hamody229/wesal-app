export function getBagCount(): number {
  const bag = JSON.parse(
    localStorage.getItem("bag") || "[]"
  );

  const bagSeen = localStorage.getItem("bagSeen") === "true";

  if (bagSeen) return 0; 

  return bag.reduce(
    (sum: number, item: any) =>
      sum + item.quantityInBag,
    0
  );
}
