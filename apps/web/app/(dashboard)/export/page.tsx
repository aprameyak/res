import { redirect } from "next/navigation";

export default function ExportRedirect() {
  redirect("/resume?step=export");
}
