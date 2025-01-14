import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetPatron } from "../../data/patronData";
import { Table } from "reactstrap";

export const PatronDetails = () => {
  const [patronDetails, setPatronDetails] = useState({});
  const { id } = useParams();

  useEffect(() => {
    GetPatron(id).then(setPatronDetails);
  }, []);

  const getBalanceAsDollars = (balance) => {
    if (balance != null) {
      const formattedNumber = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balance);
      return formattedNumber;
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">
        {patronDetails.firstName} {patronDetails.lastName}
      </h2>
      <Table>
        <tbody>
          <tr>
            <th scope="row">Address</th>
            <td>{patronDetails.address}</td>
          </tr>
          <tr>
            <th scope="row">Email</th>
            <td>{patronDetails.email}</td>
          </tr>
          <tr>
            <th scope="row">Active Status</th>
            <td>{patronDetails.isActive ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <th>Balance</th>
            <td>{getBalanceAsDollars(patronDetails.balance)}</td>
          </tr>
        </tbody>
      </Table>
      <h5>Checkouts</h5>
      {patronDetails.checkout?.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Checkout Date</th>
              <th>Return Date</th>
              <th>Late Fee</th>
            </tr>
          </thead>
          <tbody>
            {patronDetails.checkout.map((co) => (
              <tr key={`checkout-${co.id}`}>
                <td>{co.material.materialName}</td>
                <td>{co.material.materialType.name}</td>
                <td>{co.checkoutDate?.split("T")[0]}</td>
                <td>{co.returnDate?.split("T")[0] || "Checked Out"}</td>
                <td>{getBalanceAsDollars(co.lateFee) || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No Checkouts for this patron</p>
      )}
    </div>
  );
};
