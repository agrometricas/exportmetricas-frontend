import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from '@/lib/env';
import { needsRenewal } from '@/utils/sessionRenewal';

interface CustomUser {
  id: string;
  name: string;
  email: string;
  role: string;
  exporterId: string;
  onboardingStatus: string;
  accessToken: string;
  refreshToken: string;
}

interface SignedIn {
  user: CustomUser;
  accessToken: string;
  refreshToken: string;
}

function sessionUser(u: CustomUser): JWT['user'] {
  return {
    id: String(u.id),
    name: u.name ?? '',
    email: u.email ?? '',
    role: u.role ?? '',
    exporterId: String(u.exporterId ?? ''),
    onboardingStatus: u.onboardingStatus ?? '',
  };
}

async function renew(refreshToken: string): Promise<SignedIn | null> {
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/auth/exporter/refresh`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );
    return res.status === 201 ? ((await res.json()) as SignedIn) : null;
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Email',
          type: 'text',
          placeholder: 'test@test.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<import('next-auth').User | null> {
        if (!credentials?.username || !credentials?.password) return null;

        const res = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/auth/exporter/login`,
          {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.username,
              password: credentials.password,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (res.status === 201) {
          const user = (await res.json()) as CustomUser;
          return user;
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.onboardingStatus && token.user) {
        token.user.onboardingStatus = session.onboardingStatus;
      }

      if (user) {
        const raw = user as unknown as SignedIn;
        token.user = sessionUser(raw.user);
        token.accessToken = raw.accessToken ?? '';
        token.refreshToken = raw.refreshToken ?? '';
        return token;
      }

      // The refresh token is the Bearer of every request and the backend does
      // not extend it: renewed while the user is active, it never expires on
      // them mid-form. If renewing fails the next request answers 401, as before.
      if (token.refreshToken && needsRenewal(token.refreshToken, Date.now())) {
        const renewed = await renew(token.refreshToken);
        if (renewed) {
          token.user = {
            ...sessionUser(renewed.user),
            onboardingStatus: token.user.onboardingStatus,
          };
          token.accessToken = renewed.accessToken;
          token.refreshToken = renewed.refreshToken;
        }
      }
      return token;
    },
    async session({ token, session }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },

  secret: env.NEXTAUTH_SECRET,
};
