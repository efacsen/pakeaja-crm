import { redirect } from 'next/navigation';

export default function LeadsPage() {
  // Redirect to sales pipeline which handles leads
  redirect('/dashboard/sales');
}