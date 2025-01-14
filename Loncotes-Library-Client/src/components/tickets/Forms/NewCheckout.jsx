import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { GetPatrons } from "../../../data/patronData";
import { newCheckout } from "../../../data/checkoutsData";

export const NewCheckout = () => {
  const [patrons, setPatrons] = useState([]);

  const { id } = useParams();

  const [newCheckoutObj, setNewCheckoutObj] = useState({
    materialId: parseInt(id),
  });

  const navigate = useNavigate();

  useEffect(() => {
    GetPatrons().then(setPatrons);
  }, []);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!newCheckoutObj.patronId || newCheckoutObj.patronId > patrons.length) {
      window.alert("Please enter a valid patron Id");
      return;
    }
    newCheckout(newCheckoutObj).then(() => navigate("/checkouts"));
  };

  return (
    <div className="container">
      <form>
        <FormGroup>
          <Label className="mt-5" for="patronId">
            Patron Id
          </Label>
          <Input
            type="number"
            required
            placeholder="Enter patron Id"
            onChange={(e) => {
              const checkout = { ...newCheckoutObj };
              checkout.patronId = parseInt(e.target.value);
              setNewCheckoutObj(checkout);
            }}
          />
        </FormGroup>
        <Button
          className="btn"
          type="submit"
          onClick={(e) => handleCheckout(e)}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};
