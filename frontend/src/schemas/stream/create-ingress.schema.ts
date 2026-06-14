import z from "zod";

export enum IngressType {
  RTMP = 0,
  WHIP = 1,
}

export const CreateIngressSchema = z.object({
  ingressType: z.nativeEnum(IngressType),
});

export type TypeCreateIngressSchema = z.infer<typeof CreateIngressSchema>;
