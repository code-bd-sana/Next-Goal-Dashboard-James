import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";


export const metadata: Metadata = {
  title:
    "Next-Goal",
  description: "Next-Goal Dashboard",
};


export default function SignIn() {
  return <SignInForm />;
}
