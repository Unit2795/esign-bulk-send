// Proxied API url
export const baseURL = "https://cors-anywhere.herokuapp.com/https://www.esigngenie.com/esign/api";

// eSign Genie REST endpoints used in this application
export const endpoint = {
  templates: {
    list: (baseURL + "/templates/list"),
    get: (baseURL + "/templates/mytemplate")
  }
};
