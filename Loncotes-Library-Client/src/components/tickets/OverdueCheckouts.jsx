import { useEffect, useState } from "react";
import { getOverdueCheckouts } from "../../data/checkoutsData";
import { Table } from "reactstrap";
import { getBalanceAsDollars } from "./PatronDetails";

export const OverdueCheckouts = () => {
  const [overdueCheckouts, setOverdueCheckouts] = useState([]);

  useEffect(() => {
    getOverdueCheckouts().then(setOverdueCheckouts);
  }, []);
  return (
    <div className="container">
      <div className="sub-menu bg-light">
        <h4 className="mt-4">Overdue Checkouts</h4>
      </div>
      {overdueCheckouts.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Material Name</th>
              <th>Patron Name</th>
              <th>Checkout Date</th>
              <th>Late Fee</th>
            </tr>
          </thead>
          <tbody>
            {overdueCheckouts.map((oc) => (
              <tr key={`checkouts-${oc.id}`}>
                <th scope="row">{oc.id}</th>
                <td>{oc.material.materialName}</td>
                <td>
                  {oc.patron.firstName} {oc.patron.lastName}
                </td>
                <td>{oc.checkoutDate}</td>
                <td>{getBalanceAsDollars(oc.lateFee)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No current overdue checkouts</p>
      )}
    </div>
  );
};
