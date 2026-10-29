export default function EventsCard({ events }) {

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Upcoming Events
      </h2>

      <div className="space-y-4">

        {events.map((event) => (
          <div
            key={event.id}
            className="border-b pb-4"
          >

            <h3 className="font-semibold">
              {event.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(event.start_date)
                .toLocaleDateString()}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}