interface IProps {
  children: React.ReactNode;
  classes?: string;
  hero?: boolean;
}

const MainLayout = (props: IProps) => {
  const { children, classes, hero = true } = props;

  const heroClass = hero ? 'hero' : '';
  const heroContentClasses = hero ? 'hero-content text-center' : '';
  const heroWidthClass = hero ? 'max-w-md' : 'px-6 mx-auto';

  return (
    <main className={`flex h-full text-lg font-medium ${classes}`}>
      <div className={heroClass}>
        <div className={heroContentClasses}>
          <div className={heroWidthClass}>{children}</div>
        </div>
      </div>
    </main>
  );
};

export default MainLayout;
