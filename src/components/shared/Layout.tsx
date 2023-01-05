import Nav from './Nav';

interface IProps {
  children: React.ReactNode;
}

const Layout = (props: IProps) => {
  const { children } = props;
  return (
    <div className="mx-6 font-poppins md:mx-auto md:max-w-2xl">
      <Nav />
      {children}
    </div>
  );
};

export default Layout;
