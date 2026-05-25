import CreateAccountForm from "@/components/features/auth/forms/CreateAccountForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
};
const CreateAccountPage = () => {
  return <CreateAccountForm />;
};

export default CreateAccountPage;
