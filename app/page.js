import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';

// OOP: Component composition - combines multiple components
export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <HowItWorks />
    </div>
  );
}
