export interface Role {
  id: number;
  roleType: string;
}

export interface iUser {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  roles?: Role[];
  createdAt?: string;
}
