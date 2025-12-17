export type User = {
  _id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Viewer";
};