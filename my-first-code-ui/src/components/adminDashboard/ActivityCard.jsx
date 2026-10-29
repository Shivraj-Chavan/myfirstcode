export default function ActivityCard({ activities }) {

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Recent Activities
      </h2>

      <div className="space-y-4">

        {activities.map((item) => (
          <div
            key={item.id}
            className="border-b pb-3"
          >
            <p className="font-medium">
              {item.message}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(item.created_at)
                .toLocaleString()}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}