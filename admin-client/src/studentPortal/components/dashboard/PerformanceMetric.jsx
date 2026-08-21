import MetricCard from "./MetricCard";

const PerformanceMetric = () => {
  return (
    <MetricCard
      title="Academic Performance"
      value="8.6 / 10"
      subtitle="Current CGPA"
      icon="↗"
      trend="+0.4"
    />
  );
};

export default PerformanceMetric;