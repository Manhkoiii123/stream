import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
interface CardContainerProps {
  heading: string;
  description?: string;
  rightContent?: React.ReactNode;
  children?: React.ReactNode;
  Icon?: IconType | LucideIcon;
  isRightContentFull?: boolean;
}

const CardContainer = ({
  heading,
  description,
  rightContent,
  children,
  Icon,
  isRightContentFull = false,
}: CardContainerProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-x-4">
          {Icon && (
            <div className="rounded-full bg-foreground p-2.5">
              <Icon className="size-7 text-secondary" />
            </div>
          )}
          <div className="space-y-1">
            <h2 className="font-semibold tracking-wide">{heading}</h2>
            {description && (
              <p className="max-w-4xl text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {rightContent && (
          <div className={cn(isRightContentFull && "w-full pl-4")}>
            {rightContent}
          </div>
        )}
      </div>
      {children && <div className="mt-4 ">{children}</div>}
    </Card>
  );
};

export default CardContainer;
