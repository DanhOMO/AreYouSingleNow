// src/types/user.ts

import { Profile } from "./Profile";
import { Location } from "./Location";
import { Detail } from "./Detail";

export interface User {
  _id?: string;
  email: string;
  password: string;
  phone: string;
  status: boolean;
  profile: Profile;
  location: Location;
  detail: Detail;
}
