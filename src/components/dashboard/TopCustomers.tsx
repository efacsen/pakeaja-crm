import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/calculator-utils';

interface TopCustomer {
  id: string;
  name: string;
  company?: string;
  totalRevenue: number;
  projectCount: number;
  avatarUrl?: string;
}

const mockCustomers: TopCustomer[] = [
  {
    id: '1',
    name: 'PT ABC Indonesia',
    company: 'Manufacturing',
    totalRevenue: 285000000,
    projectCount: 12,
  },
  {
    id: '2',
    name: 'CV XYZ Konstruksi',
    company: 'Construction',
    totalRevenue: 198000000,
    projectCount: 8,
  },
  {
    id: '3',
    name: 'PT Global Properti',
    company: 'Real Estate',
    totalRevenue: 167000000,
    projectCount: 6,
  },
  {
    id: '4',
    name: 'UD Maju Jaya',
    company: 'Retail',
    totalRevenue: 124000000,
    projectCount: 5,
  },
  {
    id: '5',
    name: 'PT Sentosa Abadi',
    company: 'Industrial',
    totalRevenue: 98000000,
    projectCount: 4,
  },
];

interface TopCustomersProps {
  customers?: TopCustomer[];
  limit?: number;
}

export function TopCustomers({ 
  customers = mockCustomers, 
  limit = 5 
}: TopCustomersProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Pelanggan Terbaik / Top Customers</CardTitle>
        <CardDescription>
          Berdasarkan total pendapatan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.slice(0, limit).map((customer, index) => (
            <div
              key={customer.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                  <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer.projectCount} proyek • {customer.company}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {formatCurrency(customer.totalRevenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}