import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FindProfileQuery } from "@/graphql/generated/output";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
const avatarSizes = cva("", {
  variants: {
    size: {
      sm: "size-7",
      default: "size-9",
      lg: "size-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
interface ChannelAvatarProps extends VariantProps<typeof avatarSizes> {
  channel: Pick<FindProfileQuery["findProfile"], "username" | "avatar">;
  isLive?: boolean;
}
const ChannelAvatar = ({ channel, isLive, size }: ChannelAvatarProps) => {
  return (
    <div className="relative">
      <Avatar
        className={cn(avatarSizes({ size }), isLive && "ring-2 ring-rose-500")}
      >
        <AvatarImage
          src={channel.avatar ?? undefined}
          className="object-cover"
        />
        <AvatarFallback>{channel.username?.[0] ?? "?"}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ChannelAvatar;
