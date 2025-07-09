import { CoatingCalculator } from '@/components/features/calculator/CoatingCalculator';

export default function CalculatorPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="rounded-xl bg-gradient-to-br from-white/5 to-white/10 dark:from-gray-900/20 dark:to-gray-900/30 backdrop-blur-sm p-1">
        <CoatingCalculator />
      </div>
    </div>
  );
}