const API = "http://localhost:5000";

export const registerUser = (data) =>
  fetch(`${API}/register`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(data)
  });

export const loginUser = (data) =>
  fetch(`${API}/login`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(data)
  });

export const addCrop = (data) =>
  fetch(`${API}/crop`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(data)
  });

export const getCrops = () =>
  fetch(`${API}/crops`);