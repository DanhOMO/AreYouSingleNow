import type { Message } from "./Message";
export interface Match {
    _id: string;
    userIds: string[];
    lastMessage: Message | null;
    createdAt: string;
}