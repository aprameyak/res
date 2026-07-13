import { redirect } from "next/navigation";

export default function TailorRedirect() {
  redirect("/resume?step=tailor");
}
