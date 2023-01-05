import Footer from './Footer';
import Nav from './Nav';

interface IProps {
  children: React.ReactNode;
}

const Layout = (props: IProps) => {
  const { children } = props;
  return (
    <div className="container mx-auto flex h-screen flex-col justify-between px-16 font-poppins">
      <Nav />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
