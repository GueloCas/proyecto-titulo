import { Link } from "react-router-dom";

export function Card({ to, title, description }) {
  return (
    <div className="col-md-3">
      <Link to={to}>
        <div className="card card-info card-annoucement card-round">
          <div className="card-body text-center">
            <div className="card-opening">{title}</div>
            <div className="card-desc">{description}</div>
            <div className="card-detail">
              <div className="btn btn-light btn-rounded">View Detail</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
