export interface Swipe {
    id: string;
    swiperId: string;
    swipedId: string;
    action: 'left' | 'right';
    createdAt: string;
}