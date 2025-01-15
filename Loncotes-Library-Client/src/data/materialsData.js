const _apiUrl = "/api/materials";

export const getMaterials = (genreId, typeId) => {
  if (genreId === "0" && typeId === "0") {
    return fetch(_apiUrl).then((res) => res.json());
  }
  if (typeId === "0") {
    return fetch(`${_apiUrl}?genreId=${genreId}`).then((res) => res.json());
  }
  if (genreId === "0") {
    return fetch(`${_apiUrl}?materialTypeId=${typeId}`).then((res) =>
      res.json()
    );
  }

  return fetch(`${_apiUrl}?genreId=${genreId}&materialTypeId=${typeId}`).then(
    (r) => r.json()
  );
};

//export a function here that gets a ticket by id
export const getMaterial = (id) => {
  return fetch(`${_apiUrl}/${id}`).then((r) => r.json());
};

export const createMaterial = (material) => {
  return fetch(_apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(material),
  }).then((res) => res.json());
};

export const removeMaterial = (id) => {
  return fetch(`${_apiUrl}/${id}/remove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/jon",
    },
  });
};
