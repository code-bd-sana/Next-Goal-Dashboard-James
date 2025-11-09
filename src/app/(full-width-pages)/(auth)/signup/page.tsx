import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";


export const metadata: Metadata = {
  title:
    "Next-Goal",
  description: "Next-Goal Dashboard",
};


export default function SignUp() {
  return <SignUpForm />;
}
