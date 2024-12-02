const Error = ({ title, message }) => {
  return (
    <div className="error">
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
};

export default Error;
