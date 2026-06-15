import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm";
import { Suspense } from "react";


export default function ResetPasswordPage() {
  return <Suspense fallback={null}><ResetPasswordForm /></Suspense>
}
