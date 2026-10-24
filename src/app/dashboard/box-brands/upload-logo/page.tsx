import { redirect } from 'next/navigation';

export default function UploadLogoPage(): never {
  redirect('/dashboard/logos?tab=alicuotas');
}
