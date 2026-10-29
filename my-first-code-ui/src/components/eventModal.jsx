const EventModal = () => {

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white w-[500px] p-8 rounded-2xl">

        <h1 className="text-3xl font-bold mb-6">

          Add Event

        </h1>

        <input
          type="text"
          placeholder="Event Title"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <select className="w-full border p-3 rounded-lg mb-4">

          <option>Lecture</option>

          <option>Assignment</option>

          <option>Quiz</option>

          <option>Live Class</option>

        </select>

        <input
          type="datetime-local"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="datetime-local"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <textarea
          placeholder="Description"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl">

          Save Event

        </button>

      </div>

    </div>
  );
};

export default EventModal;