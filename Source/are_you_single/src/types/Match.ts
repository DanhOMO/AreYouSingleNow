import type { Message } from "./Message";
export interface Match {
    id: string;
    userIds: string[];
    lastMessage: Message | null;
    createdAt: string;
}