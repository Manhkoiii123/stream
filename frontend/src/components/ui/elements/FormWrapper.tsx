import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormWrapperProps {
  children?: React.ReactNode;
  heading: string;
}
const FormWrapper = ({ children, heading }: FormWrapperProps) => {
  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{heading}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
};

export default FormWrapper;
