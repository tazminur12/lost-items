import ItemCard from '@/components/ItemCard';

const MOCK_MATCHES = [
  { id: 1, title: 'Black Leather Wallet', location: 'Main Library', date: '2023-10-25', type: 'found' },
  { id: 2, title: 'AirPods Pro Case', location: 'Gym Locker Room', date: '2023-10-24', type: 'found' },
  { id: 3, title: 'Blue Hydroflask', location: 'Lecture Hall B', date: '2023-10-23', type: 'found' },
  { id: 4, title: 'Car Keys (Toyota)', location: 'Parking Lot A', date: '2023-10-22', type: 'found' },
  { id: 5, title: 'Calculus Textbook', location: 'Student Center', date: '2023-10-21', type: 'found' },
  { id: 6, title: 'Red Scarf', location: 'Bus Stop #4', date: '2023-10-20', type: 'found' },
];

export default function Matches() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Possible Matches</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Here are some items that match the description of items recently reported lost. 
        If you see your item, click "View Details" to start the claim process.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_MATCHES.map((item) => (
          <ItemCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
