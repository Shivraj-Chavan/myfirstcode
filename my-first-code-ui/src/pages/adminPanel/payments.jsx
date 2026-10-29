import { useState } from "react";
import {
  Search,
  IndianRupee,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

export default function Payments() {
  const [search, setSearch] = useState("");

  const payments = [
    {
      id: 1,
      student_name: "Rahul Sharma",
      level_name: "Level 1 - Basics",
      amount: 999,
      status: "SUCCESS",
      payment_date: "18 Jun 2026",
      payment_time: "10:30 AM",
    },
    {
      id: 2,
      student_name: "Priya Patel",
      level_name: "Level 3 - Advanced",
      amount: 1499,
      status: "PENDING",
      payment_date: "18 Jun 2026",
      payment_time: "11:15 AM",
    },
    {
      id: 3,
      student_name: "Aman Verma",
      level_name: "Level 2 - Intermediate",
      amount: 1299,
      status: "FAILED",
      payment_date: "17 Jun 2026",
      payment_time: "08:45 PM",
    },
  ];

  const filteredPayments = payments.filter(
    (p) =>
      p.student_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      p.level_name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Payments
        </h1>

        <p className="text-gray-500 mt-1">
          Track all student level payments
        </p>
      </div>

            {/* Search */}

            <div className="bg-white   rounded-2xl p-4 mb-5">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search student or level..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-slate-300  rounded-xl pl-10 pr-4 py-2.5"
          />
        </div>
      </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white  rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <IndianRupee className="text-green-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold">
                ₹25,600
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Successful
              </p>
              <h3 className="text-2xl font-bold">
                54
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-500" />
            <div>
              <p className="text-gray-500 text-sm">
                Pending
              </p>
              <h3 className="text-2xl font-bold">
                7
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-500" />
            <div>
              <p className="text-gray-500 text-sm">
                Failed
              </p>
              <h3 className="text-2xl font-bold">
                3
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* Table */}

      <div className="bg-white  rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">

              <tr>
                <th className="px-4 py-3 text-left">
                  Student
                </th>

                <th className="px-4 py-3 text-left">
                  Level
                </th>

                <th className="px-4 py-3 text-left">
                  Amount
                </th>

                <th className="px-4 py-3 text-left">
                  Status
                </th>

                <th className="px-4 py-3 text-left">
                  Date
                </th>

                <th className="px-4 py-3 text-left">
                  Time
                </th>
              </tr>

            </thead>

            <tbody>

              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="-t hover:bg-gray-50"
                >
                  <td className="px-4 py-4 font-medium">
                    {payment.student_name}
                  </td>

                  <td className="px-4 py-4">
                    {payment.level_name}
                  </td>

                  <td className="px-4 py-4 font-semibold text-green-600">
                    ₹{payment.amount}
                  </td>

                  <td className="px-4 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          payment.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {payment.status}
                    </span>

                  </td>

                  <td className="px-4 py-4">
                    {payment.payment_date}
                  </td>

                  <td className="px-4 py-4">
                    {payment.payment_time}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}


