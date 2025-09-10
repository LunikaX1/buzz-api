import { SignUpForm } from "@/components/signup-form";
import React from "react";


export const revalidate = 0 // Disable caching for dynamic data
export default function SignUp() {
  return <SignUpForm />;
}
