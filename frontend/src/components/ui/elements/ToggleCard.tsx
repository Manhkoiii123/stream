import CardContainer from "@/components/ui/elements/CardContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

interface ToggleCardProps {
  heading: string;
  description: string;
  isDisabled?: boolean;
  value: boolean;
  onChange: (value: boolean) => void;
  children?: React.ReactNode;
}
const ToggleCard = ({
  heading,
  description,
  isDisabled,
  value,
  onChange,
  children,
}: ToggleCardProps) => {
  return (
    <CardContainer
      heading={heading}
      description={description}
      rightContent={
        <Switch
          checked={value}
          onCheckedChange={onChange}
          disabled={isDisabled}
        />
      }
    ></CardContainer>
  );
};

export default ToggleCard;

export function ToggleCardSkeleton() {
  return <Skeleton className="mt-6 h-20 w-full" />;
}
