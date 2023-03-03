import { FiArrowUp } from 'react-icons/fi';
import { scrollToSmoothly } from '../../utils/utils';

const Footer = () => {
  return (
    <footer className="footer footer-center bg-base-content pt-10 pb-20 text-primary-content">
      <div className="container mx-auto flex justify-end px-16">
        <button
          className="btn gap-2"
          type="button"
          onClick={() => scrollToSmoothly(0, 250)}
        >
          <FiArrowUp />
          Back to top
        </button>
      </div>
      <div>
        <p className="font-bold">
          <span className="text-lg">allotr</span>
          <br />
          Making light work since 2023
        </p>
        <p>Copyright &copy; 2023 - All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
