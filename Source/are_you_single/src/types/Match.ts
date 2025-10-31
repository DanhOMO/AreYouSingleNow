import type { Message } from "./Message";
export interface Match {
    _id: string;
    userIds: string[];
    lastMessageId: string | null;
    createdAt: string;
}