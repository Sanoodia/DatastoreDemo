// const axios = require('axios');
// const graphql = require('graphql');
// const { print } = graphql;

var axios = require("axios");

const { getPdBaseUrl } = require("/opt/envHelpers");

const api = axios.create({
  headers: {
    token: "622df847ab699",
    "X-API-KEY": "7b7aa78f506a40bc0320fa308efc19bf",
  },
  baseURL: getPdBaseUrl(process.env.ENV),
});

const getLoadDetail = async (_load_id) => {
  //implemeting only for single value (Otherwise use JSON.stringify on array)
  try {
    const response = await api.get(`/pch/pch_sync/load?load_id=[${_load_id}]`);
    return response?.data?.data ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const getRunningLoadDetail = async (_load_id) => {
  //implemeting only for single value (Otherwise use JSON.stringify on array)
  try {
    const response = await api.get(
      `/pch/pch_sync/load?load_id=[${_load_id}]&running_only=1`
    );
    return response?.data?.data ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCrewDetail = async (_crew_id) => {
  //implemeting only for single value (Otherwise use JSON.stringify on array)
  try {
    const response = await api.get(`/pch/pch_sync/crew?id=${_crew_id}`);
    if (response.data) {
      return response.data;
    } else return null;
  } catch (error) {
    console.log(error);
  }
};
const getDistrictDetail = async (_district_id) => {
  //implemeting only for single value (Otherwise use JSON.stringify on array)
  try {
    const response = await api.get(`/pch/pch_sync/district?id=${_district_id}`);
    if (response.data) {
      return response.data;
    } else return null;
  } catch (error) {
    console.log(error);
  }
};

const getJobDetail = async (_job_id) => {
  //implemeting only for single value (Otherwise use JSON.stringify on array)
  try {
    const response = await api.get(
      `/pch/pch_sync/job_detail?job_id=[${_job_id}]`
    );
    return response?.data?.data ?? null;
  } catch (error) {
    console.log(error);
  }
};

const getDriverDetail = async (_driver_id) => {
  try {
    const response = await api.get(
      `/pch/pch_sync/driver?driver_id=[${_driver_id}]`
    );
    return response?.data?.data ?? null;
  } catch (error) {
    console.log(error);
  }
};

const getAllCarrierDriver = async (_carrier_id) => {
  try {
    const response = await api.get(
      `/pch/pch_sync/driver?carrier_id=[${_carrier_id}]`
    );
    return response?.data?.data ?? null;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getLoadDetail,
  getJobDetail,
  getDriverDetail,
  getAllCarrierDriver,
  getCrewDetail,
  getDistrictDetail,
  getRunningLoadDetail,
};
