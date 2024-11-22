import { Link } from "react-router-dom";

export function Card({ to, title, description, button }) {
  return (
    <div className="col-md-6">
      <Link to={to}>
        <div className="card card-info card-annoucement card-round">
          <div className="card-body text-center">
            <div className="card-opening">{title}</div>
            <div className="card-desc">{description}</div>
            <div className="card-detail">
              <div className="btn btn-light btn-rounded">{button}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
