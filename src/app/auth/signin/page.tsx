import { SignInForm } from "@/components/signin-form";


export const revalidate = 0 // Disable caching for dynamic data
export default function SignInPage() {
  return <SignInForm />;
}
