interface IProps {
  children: React.ReactNode;
  classes?: string;
  hero?: boolean;
}

const MainLayout = (props: IProps) => {
  const { children, classes, hero = true } = props;

  const heroClass = hero ? 'hero' : 'w-full';
  const heroContentClasses = hero ? 'hero-content text-center' : '';
  const heroWidthClass = hero ? 'max-w-md' : 'mx-auto w-full';

  return (
    <main
      className={`container mx-auto flex px-16 text-lg font-medium ${classes}`}
    >
      <div className={heroClass}>
        <div className={heroContentClasses}>
          <div className={heroWidthClass}>{children}</div>
        </div>
      </div>
      <style jsx>{`
        .main {
          padding-bottom: 550px;
        }
      `}</style>
    </main>
  );
};

export default MainLayout;
