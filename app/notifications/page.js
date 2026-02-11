export default function Notifications() {
  const notifications = [
    { id: 1, title: 'Possible Match Found', message: 'A "Black Leather Wallet" matching your description was reported found at Main Library.', time: '2 hours ago', read: false },
    { id: 2, title: 'Claim Status Update', message: 'Your claim for "Blue Hydroflask" has been approved. You can pick it up at the Student Center.', time: '1 day ago', read: true },
    { id: 3, title: 'System Update', message: 'We have updated our terms of service regarding lost item claims.', time: '3 days ago', read: true },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <button className="text-sm text-blue-600 hover:underline">Mark all as read</button>
      </div>
      
      <div className="space-y-4">
        {notifications.map((note) => (
          <div key={note.id} className={`p-4 rounded-xl border transition-colors ${note.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'}`}>
            <div className="flex justify-between items-start mb-1">
              <h3 className={`font-semibold ${note.read ? 'text-gray-900' : 'text-blue-900'}`}>{note.title}</h3>
              <span className="text-xs text-gray-500">{note.time}</span>
            </div>
            <p className={`text-sm ${note.read ? 'text-gray-600' : 'text-blue-800'}`}>{note.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
