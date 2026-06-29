const Loader = ({
  title = "Loading...",
  message = "Please wait while we load your data.",
}) => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>

      <h3>{title}</h3>

      <p>{message}</p>
    </div>
  );
};

export default Loader;