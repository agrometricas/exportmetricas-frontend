import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/authOptions';

export default async function Home(): Promise<never> {
  const session = await getServerSession(authOptions);
  redirect(session ? '/dashboard' : '/auth/signin');
}
