type FeatureProps = {
  children: React.ReactNode;
};

const Feature = ({ children }: FeatureProps) => {
  return <div className="relative pl-9">{children}</div>;
};

type FeatureTitleProps = {
  children: React.ReactNode;
};

const FeatureTitle = ({ children }: FeatureTitleProps) => {
  return <dt className="inline font-semibold text-gray-900 mr-1">{children}</dt>;
};

type FeatureContentProps = {
  children: React.ReactNode;
};

const FeatureContent = ({ children }: FeatureContentProps) => {
  return <dd className="inline">{children}</dd>;
};

export { Feature, FeatureContent, FeatureTitle };
