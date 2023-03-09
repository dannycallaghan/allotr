import { useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { scrollToSmoothly } from '../../utils/utils';

const Footer = () => {
  useEffect(() => {
    function scrollListener() {
      const btn = document.querySelector('footer button');
      if (window.pageYOffset && window.pageYOffset >= 100) {
        btn?.classList.remove('invisible');
      } else {
        btn?.classList.add('invisible');
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);

  return (
    <footer className="bg-base-content pb-10 text-primary-content">
      <div className="container mx-auto my-0 flex justify-end px-16 py-4">
        <button
          className="invisible btn-sm btn gap-2"
          type="button"
          onClick={() => scrollToSmoothly(0, 250)}
        >
          <FiArrowUp />
          Back to top
        </button>
      </div>
      <div className="text-center ">
        <p className="font-bold">
          <span className="text-lg">allotr</span>
          <br />
          Task management for everybody else.
        </p>
        <p>Copyright &copy; 2023 - All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
