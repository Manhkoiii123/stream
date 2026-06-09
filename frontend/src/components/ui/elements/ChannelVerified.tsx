/* eslint-disable @typescript-eslint/no-empty-object-type */
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
const channelVerifiedSizes = cva("", {
  variants: {
    size: {
      sm: "size-5",
      default: "size-7",
      lg: "size-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
interface ChannelVerifiedProps extends VariantProps<
  typeof channelVerifiedSizes
> {}
const ChannelVerified = ({ size }: ChannelVerifiedProps) => {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full bg-primary p-[1px]",
        channelVerifiedSizes({ size }),
      )}
    >
      <Check
        className={cn(
          "stroke-[4px] text-white",
          size === "sm" ? "size-[2px]" : "size-[11px]",
        )}
      />
    </span>
  );
};

export default ChannelVerified;
