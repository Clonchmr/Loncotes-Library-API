import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetPatron, updatePatron } from "../../../data/patronData";
import { Button, FormGroup, Input, Label } from "reactstrap";

export const EditPatron = () => {
  const [selectedPatron, setSelectedPatron] = useState({
    address: "",
    email: "",
  });

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    GetPatron(id).then(setSelectedPatron);
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    updatePatron(id, selectedPatron).then(() => {
      navigate(`/patrons/${id}`);
    });
  };

  return (
    <div className="container">
      <h4 className="mt-4">Edit Patron</h4>
      <form>
        <FormGroup>
          <Label for="editPatronAddress">Address</Label>
          <Input
            id="editPatronAddress"
            name="address"
            type="text"
            value={selectedPatron.address}
            onChange={(e) => {
              const data = { ...selectedPatron };
              data.address = e.target.value;
              setSelectedPatron(data);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="editPatronEmail">Email</Label>
          <Input
            id="editPatronEmail"
            name="email"
            type="email"
            value={selectedPatron.email}
            onChange={(e) => {
              const data = { ...selectedPatron };
              data.email = e.target.value;
              setSelectedPatron(data);
            }}
          />
        </FormGroup>
        <Button className="btn" onClick={handleUpdate}>
          Submit
        </Button>
      </form>
    </div>
  );
};
