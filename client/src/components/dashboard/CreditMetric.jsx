import MetricCard from "./MetricCard";

const CreditMetric = () => {
  return (
    <MetricCard
      title="Credits"
      value="24 / 30"
      subtitle="Credits completed"
      icon="◈"
      trend="80%"
    />
  );
};

export default CreditMetric;