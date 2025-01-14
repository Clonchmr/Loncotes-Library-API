const _apiUrl = "/api/patrons";

export const GetPatrons = () => {
  return fetch(_apiUrl).then((res) => res.json());
};

export const GetPatron = (id) => {
  return fetch(`${_apiUrl}/${id}`).then((res) => res.json());
};

export const updatePatron = (id, patronObj) => {
  return fetch(`${_apiUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patronObj),
  });
};

export const deactivatePatron = (id) => {
  return fetch(`${_apiUrl}/${id}/deactivate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const activatePatron = (id) => {
  return fetch(`${_apiUrl}/${id}/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
