
const Card = ({ title, description, quantity, expiry }) => {
  return (
    <div className="section" style={{ borderRadius: '30px', padding: '1rem' }}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>Qty: {quantity} | Expiry: {expiry}</p>
      <button>Claim</button>
    </div>
  );
};

export default Card;
