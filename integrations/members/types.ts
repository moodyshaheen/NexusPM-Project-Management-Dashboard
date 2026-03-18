export type Member = {
  _id?: string;
  loginEmail?: string;
  loginEmailVerified?: boolean;
  status?: 'UNKNOWN' | 'PENDING' | 'APPROVED' | 'BLOCKED' | 'OFFLINE';
  contact?: {
    firstName?: string;
    lastName?: string;
    phones?: string[];
  };
  profile?: {
    nickname?: string;
    photo?: {
      url?: string;
      height?: number;
      width?: number;
    };
    title?: string;
  };
  _createdDate?: Date;
  _updatedDate?: Date;
  lastLoginDate?: Date;
};
