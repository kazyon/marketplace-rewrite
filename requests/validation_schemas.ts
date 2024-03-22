import { z } from 'zod';

const ahListingItem = z.object({
    id: z.string(),
    hasSold: z.boolean(),
    price: z.number(),
    seller: z.string(),
    buyer: z.string().optional(),
    mintAddress: z.string(),
    soldAt: z.string().optional(),
    listedAt: z.string(),
    isCanceled: z.boolean().optional(),
    canceledAt: z.string().optional(),
});
export const ahListingsSchema = z.array(ahListingItem);

export const publicUserDataSchema = z.object({
    createdAt: z.string().min(1).nullish(),
    bio: z.string().nullish(),
    pubkey: z.string().min(1),
    uid: z.string().min(1),
    username: z.string().min(1).nullish(),
});

export type PublicUserData = z.infer<typeof publicUserDataSchema>;

export type AhListedItem = z.infer<typeof ahListingItem>;
