// =========================================================================
//  Axios client
//  -----------------------------------------------------------------------
//  Single configured axios instance used by every API module. The base URL
//  points at the Spring Boot backend. Override it without touching code by
//  setting VITE_API_URL in a .env file (e.g. VITE_API_URL=http://localhost:8080/api).
// =========================================================================
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const client = axios.create({
  baseURL,
  timeout: 8000,
});

export default client;
