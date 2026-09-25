import { ALL_DISHES } from '@/data/dishes';
import HomeClient from './_components/HomeClient';

export default async function HomePage() {
  return <HomeClient initialDishes={ALL_DISHES} />;
}
