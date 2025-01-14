const _apiUrl = "/api/patrons";

export const GetPatrons = () => {
  return fetch(_apiUrl).then((res) => res.json());
};

export const GetPatron = (id) => {
  return fetch(`${_apiUrl}/${id}`).then((res) => res.json());
};
