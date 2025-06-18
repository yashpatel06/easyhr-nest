import { User } from 'src/modules/user/user.schema';

export function extractRequestParams(req: any): {
  user: User | null;
  authToken: string | null;
} {
  const obj: { user: User | null; authToken: string | null } = {
    user: null,
    authToken: null,
  };
  try {
    obj.user = req?.user as User;
    obj.authToken = req?.authToken as string;
    return obj;
  } catch (error) {
    return obj;
  }
}
