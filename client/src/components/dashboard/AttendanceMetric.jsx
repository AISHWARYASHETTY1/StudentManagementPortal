import MetricCard from "./MetricCard";

const AttendanceMetric = () => {
  return (
    <MetricCard
      title="Attendance"
      value="87%"
      subtitle="Overall attendance"
      icon="◔"
      trend="↑ 2.4%"
    />
  );
};

export default AttendanceMetric;