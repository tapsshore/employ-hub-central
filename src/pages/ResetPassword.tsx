import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="mb-8">
        <img src="/placeholder.svg" alt="Logo" className="h-12" />
      </div>
      <ResetPasswordForm />
    </div>
  );
}
