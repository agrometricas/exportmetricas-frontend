import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      exporterId: string;
      onboardingStatus: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      email: string;
      name: string;
      exporterId: string;
      onboardingStatus: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
    exp: number;
  }
}

export {};
