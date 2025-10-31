import useSWR from 'swr';
import { fetcher } from 'src/lib/api';
import type { User } from "src/types/User";
import type { Match } from "src/types/Match";
import type { Message } from "src/types/Message";
import type { Swipe } from "src/types/Swipe";
import { Profile } from 'src/types/Profile';

// === Gợi ý người dùng (suggestions) ===
export function useUserSuggestions() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    '/users/suggestions',
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    suggestions: data,
    isLoading,
    isError: error,
    mutateSuggestions: mutate,
  };
}

// === Danh sách Swipes ===
export function useSwipes() {
  const { data, error, isLoading, mutate } = useSWR<Swipe[]>(
    '/swipes',
    fetcher
  );

  return {
    swipes: data,
    isLoading,
    isError: error,
    mutateSwipes: mutate,
  };
}

// === Ai đã like tôi ===
export function useWhoLikedMe() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    '/users/who-like-me',
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    likedUsers: data,
    isLoading,
    isError: error,
    mutateLikedUsers: mutate,
  };
}

// === Danh sách Matches ===
export function useMatches() {
  const { data, error, isLoading, mutate } = useSWR<Match[]>(
    '/matches',
    fetcher
  );

  return {
    matches: data,
    isLoading,
    isError: error,
    mutateMatches: mutate,
  };
}
export function chatDetail(messageId: string){
  const {data,error, isLoading} = useSWR<Message>(
  `/messages/${messageId}`
  , fetcher
  )
  return {
    message: data,
    isLoading,
    isError: error,
  };
}

// === Lịch sử Chat ===
export function useChatHistoryByMatchId(matchId : string) {
  const { data, error, isLoading, mutate } = useSWR<Message[]>(
    matchId ? `/messages/${matchId}/match` : null,
    fetcher
  );

  return {
    messages: data,
    isLoading,
    isError: error,
    mutateMessages: mutate,
  };
}
// const ProfileSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   dob: { type: Date },
//   gender: { type: String, enum: ["male", "female", "other"] },
//   photos: [{ type: String }],
//   aboutMe: { type: String },
// });


export interface Partner {
  _id: string;
  profile: Profile;
}

export function usePartnerByMatchId(matchId: string) {
  const { data, error, isLoading, mutate } = useSWR<Partner>(
    matchId ? `/matches/${matchId}/partner` : null,
    fetcher
  );

  return {
    partner: data,
    isLoading,
    isError: error,
    mutatePartner: mutate,
  };
}
