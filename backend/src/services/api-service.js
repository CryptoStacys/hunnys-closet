import fetch from "node-fetch";

const ApiService = {
  getDataById: function (tokenId) {
    return new Promise(function (resolve, reject) {
      fetch(
        `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/getCloneData?tokenIds[]=${tokenId}`,
        { method: "GET" }
      )
      .then(response => {
        if (response.ok) { // Check if the response was successful
          return response.json();
        } else { // If not successful, throw an error
          throw new Error(`Failed to fetch data for token ${tokenId}: Status ${response.status}`);
        }
      })
      .then(data => resolve(data)) // Resolve with the data if successful
      .catch(error => {
        console.error(`Error fetching data for token ${tokenId}:`, error.message);
        reject(error); // Reject the promise with the error
      });
    });
  },
  loadAllImages: function (layers) {
    return new Promise(async (resolve) => {
      let promises = [];

      for (let i = 0; i < layers.length; i++) {
        if (!layers[i].hasOwnProperty("pattern")) {
          promises.push(ApiService.loadImage(i, layers[i].src));
        } else {
          promises.push(ApiService.loadMaskLayers(i, layers[i]));
        }
      }

      let result = await Promise.all(promises);

      // filter empty images out
      let filteredLayers = [];
      for (let i = 0; i < result.length; i++) {
        if (result[i].hasOwnProperty("base64")) {
          if (result[i].base64 !== "") {
            filteredLayers.push(result[i]);
          }
        } else {
          if (result[i].srcImg !== "" && result[i].maskImg !== "") {
            filteredLayers.push(result[i]);
          }
        }
      }

      // resolve(result);
      resolve(filteredLayers);
    });
  },
  loadMaskLayers: function (id, obj) {
    return new Promise(async (resolve) => {
      let srcImg = await ApiService.loadImage(id, obj.pattern);
      let maskImg = await ApiService.loadImage(id, obj.src);
      resolve({ id: id, srcImg: srcImg.base64, maskImg: maskImg.base64 });
    });
  },
  loadImage: function (id, path) {
    return new Promise(async (resolve) => {
      let img = await ApiService.getImageData(path);

      resolve({ id: id, base64: img });
    });
  },
  getImageData: function (path) {
    return new Promise(function (resolve) {
      fetch(
        `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/getImage?path=${path}`,
        { method: "GET" }
      )
        .then((response) => resolve(response.json()))
        .catch((err) => console.error(err));
    });
  },
  getMetaData: function (path, tokenId) {
    return new Promise(function (resolve) {
      fetch(path, { method: "GET" })
        .then((response) => response.json())
        .then((json) => resolve({ id: tokenId, data: json }))
        .catch((err) => console.error(err));
    });
  },
  getMetaDataAsText: function (path, tokenId) {
    return new Promise(function (resolve) {
      // fetch(path, { signal: AbortSignal.timeout(2000) })
      fetch(path)
        .then((response) => response.text())
        .then((text) => resolve({ id: tokenId, data: text }))
        .catch((err) => console.error(err));
    });
  },
  saveChangedToken: function (newToken) {
    return new Promise(function (resolve) {
      let formData = new URLSearchParams();
      formData.append("key", "auSZ873hsa2kasOsD27u");
      formData.append("token_id", newToken.token_id.toString());
      formData.append(
        "data",
        JSON.stringify({
          token: newToken.attributes,
          name: "", // TODO naming the token
        })
      );

      fetch(
        `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/saveToken`,
        {
          method: "post",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((json) => resolve(json))
        .catch((err) => console.error(err));
    });
  },
};

export default ApiService;