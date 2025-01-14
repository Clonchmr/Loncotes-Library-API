import { useEffect, useState } from "react";
import {
  activatePatron,
  deactivatePatron,
  GetPatrons,
} from "../../data/patronData";
import { Button, Table } from "reactstrap";
import { Link } from "react-router-dom";

export const PatronList = () => {
  const [patrons, setPatrons] = useState([]);

  useEffect(() => {
    GetPatrons().then(setPatrons);
  }, [patrons.length]);

  const handleUpdateStatus = (e, patronId) => {
    if (e.target.name === "deactivate") {
      deactivatePatron(patronId).then(() => GetPatrons().then(setPatrons));
    } else {
      activatePatron(patronId)
        .then(() => GetPatrons())
        .then(setPatrons);
    }
  };

  return (
    <div className="container">
      <div className="sub-menu bg-light">
        <h4>Patrons</h4>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Active Status</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patrons.map((p) => (
            <tr key={`patrons-${p.id}`}>
              <th scope="row">{p.id}</th>
              <td>{p.firstName}</td>
              <td>{p.lastName}</td>
              <td>{p.address}</td>
              <td>{p.email}</td>
              <td>{p.isActive ? "Yes" : "No"}</td>
              <td>
                <Link to={`${p.id}`}>Details</Link>
              </td>
              <td>
                <Link to={`/patrons/edit/${p.id}`}>Edit</Link>
              </td>
              {p.isActive ? (
                <td>
                  <Button
                    className="btn btn-link p-0"
                    name="deactivate"
                    onClick={(e) => handleUpdateStatus(e, p.id)}
                  >
                    Deactivate
                  </Button>
                </td>
              ) : (
                <td>
                  <Button
                    className="btn btn-link p-0"
                    name="activate"
                    onClick={(e) => handleUpdateStatus(e, p.id)}
                  >
                    {" "}
                    Reactivate{" "}
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
