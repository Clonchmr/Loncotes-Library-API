import { useEffect, useState } from "react";
import { getCheckouts, returnCheckout } from "../../data/checkoutsData";
import { Button, Table } from "reactstrap";

export const CheckoutList = () => {
  const [checkouts, setCheckouts] = useState([]);

  useEffect(() => {
    getCheckouts().then(setCheckouts);
  }, []);

  const handleReturn = (checkoutId) => {
    returnCheckout(checkoutId)
      .then(() => getCheckouts())
      .then(setCheckouts);
  };

  return (
    <div className="container">
      <div className="sub-menu bg-light">
        <h4 className="mt-4">Checkouts</h4>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Type</th>
            <th>Patron</th>
            <th>Checkout Date</th>
            <th>Return Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {checkouts.map((c) => (
            <tr key={`checkouts-${c.id}`}>
              <th scope="row">{c.id}</th>
              <td>{c.material?.materialName}</td>
              <td>{c.material.genre?.name}</td>
              <td>{c.material.materialType?.name}</td>
              <td>
                {c.patron?.firstName} {c.patron.lastName}
              </td>
              <td>{c.checkoutDate?.split("T")[0]}</td>
              <td>{c.returnDate?.split("T")[0] || "Checked Out"}</td>
              {!c.returnDate ? (
                <td>
                  <Button
                    className="btn btn-link p-0"
                    onClick={() => handleReturn(c.id)}
                  >
                    Return
                  </Button>
                </td>
              ) : (
                ""
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
