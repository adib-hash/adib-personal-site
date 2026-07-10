import { Link } from "react-router-dom";

export default function ReturnPill() {
  return (
    <Link to="/research" className="return-pill" aria-label="Back to Research index">
      <span className="return-pill-monogram">AC</span>
      Index
    </Link>
  );
}
