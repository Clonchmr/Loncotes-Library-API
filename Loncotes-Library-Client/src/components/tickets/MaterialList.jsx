import { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Table } from "reactstrap";
import { getMaterials, removeMaterial } from "../../data/materialsData";
import { Link } from "react-router-dom";
import { getGenres } from "../../data/genresData";
import { getMaterialTypes } from "../../data/materialTypesData";
import "../../../styles/materials.css";

export default function MaterialList() {
  const [materials, setMaterials] = useState([]);
  const [genres, setGenres] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [genreId, setGenreId] = useState("0");
  const [typeId, setTypeId] = useState("0");

  useEffect(() => {
    getGenres().then(setGenres);
    getMaterialTypes().then(setMaterialTypes);
  }, []);

  useEffect(() => {
    getMaterials(genreId, typeId).then(setMaterials);
  }, [genreId, typeId]);

  const handleRemoveMaterial = (materialId) => {
    removeMaterial(materialId)
      .then(() => getMaterials())
      .then(setMaterials);
  };

  return (
    <div className="container">
      <div className="sub-menu bg-light mt-4 mb-2">
        <h4>Materials</h4>
        <Link to="/materials/create">Add</Link>
      </div>
      <div className="materialSelects d-flex align-items-center justify-content-center gap-5 mb-4">
        <div className="d-flex flex-column materialSelect">
          <Label for="genreSelect">Genre</Label>
          <Input
            id="genreSelect"
            name="genreSelect"
            type="select"
            onChange={(e) => {
              setGenreId(e.target.value);
            }}
          >
            <option value={"0"}>Filter by genre</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Input>
        </div>
        <div className="d-flex flex-column materialSelect">
          <Label for="materialSelect">Material</Label>
          <Input
            id="materialSelect"
            name="materialSelect"
            type="select"
            onChange={(e) => {
              setTypeId(e.target.value);
            }}
          >
            <option value={0}>Filter by material type</option>
            {materialTypes.map((mt) => (
              <option key={mt.id} value={mt.id}>
                {mt.name}
              </option>
            ))}
          </Input>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Type</th>
            <th>Genre</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={`materials-${m.id}`}>
              <th scope="row">{m.id}</th>
              <td>{m.materialName}</td>
              <td>{m.materialType.name}</td>
              <td>{m.genre.name}</td>
              <td>
                <Link to={`${m.id}`}>Details</Link>
              </td>
              <td>
                <Button
                  className="btn btn-link p-0"
                  onClick={() => handleRemoveMaterial(m.id)}
                >
                  Remove
                </Button>
              </td>
              <td>
                <Link to={`/checkouts/${m.id}`}>Check Out</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
