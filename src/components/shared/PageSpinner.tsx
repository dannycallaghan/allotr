const PageSpinner = () => {
  return (
    <div className="flex w-full justify-center text-center">
      <div
        className="h-12 w-12 animate-spin rounded-full border-8
                    border-solid border-info border-t-transparent duration-75"
      ></div>
    </div>
  );
};

export default PageSpinner;
