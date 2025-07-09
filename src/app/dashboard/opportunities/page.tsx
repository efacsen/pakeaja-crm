import { redirect } from 'next/navigation';

export default function OpportunitiesPage() {
  // Redirect to sales pipeline which handles opportunities
  redirect('/dashboard/sales');
}