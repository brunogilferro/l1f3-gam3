export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoggedUser = {
  id: number;
  fullName: string;
  shortName: string;
  email: string;
  avatarUrl: string | null;
  sectorId: number | null;
  chronotypeId: number | null;
  firstAccess: boolean;
  onboardingComplete: boolean;
  active: boolean;
  isAi: boolean;
  lastLoginAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  initials: string;
};

export type LoginResponse = {
  token: string;
  user: LoggedUser;
};
