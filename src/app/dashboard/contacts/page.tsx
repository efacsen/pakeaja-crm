import { redirect } from 'next/navigation';

export default function ContactsPage() {
  // Redirect to customers page which handles contacts
  redirect('/dashboard/customers');
}