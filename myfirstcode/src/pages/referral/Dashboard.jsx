import { useEffect, useState } from "react";
import { Users, Clock3, CheckCircle2, XCircle } from "lucide-react";
import api from "../../api/axios.js";
import { REFERRAL_ENDPOINTS } from "../../api/referralEndpoints.js";

import StatCard from "../../components/ui/StatCard.jsx";
import Loader from "../../components/ui/Loader.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";

export default function ReferralDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(REFERRAL_ENDPOINTS.dashboardStats, { headers: { Authorization: `Bearer ${localStorage.getItem("refp_token")}` } })
      .then((res) => setStats(res.data?.stats))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard" />;

  return (
    <div>
      <PageHeader eyebrow="referral/dashboard" title="Dashboard" subtitle="Track every student you've referred." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={stats?.totalStudents ?? 0} tone="brand" />
        <StatCard icon={Clock3} label="Pending Leads" value={stats?.pendingLeads ?? 0} tone="amber" />
        <StatCard icon={CheckCircle2} label="Enrolled" value={stats?.enrolled ?? 0} tone="mint" />
        <StatCard icon={XCircle} label="Rejected" value={stats?.rejected ?? 0} tone="coral" />
      </div>
    </div>
  );
}