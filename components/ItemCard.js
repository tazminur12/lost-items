import Link from 'next/link';
import Button from './Button';

export default function ItemCard({ id, title, location, date, type, imageUrl }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
        {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
            <span className="text-4xl">📦</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {type === 'lost' ? 'Lost' : 'Found'}
            </span>
        </div>
        <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
          <span className="inline-block w-4 text-center">📍</span> {location}
        </p>
        <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
          <span className="inline-block w-4 text-center">📅</span> {date}
        </p>
        <Link href={`/claim?id=${id}`} className="block">
          <Button variant="outline" className="w-full text-sm py-2">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
