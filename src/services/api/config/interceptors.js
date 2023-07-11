const jsonToFormData = object => {
  const formData = new FormData();
  for (const key in object) {
    if (Array.isArray(object[key])) {
      for (const item of object[key]) {
        formData.append(key, item);
      }
    } else {
      formData.append(key, object[key]);
    }
  }

  return formData;
};

export const uploadRequest = (_api, config) => {
  if (config.formData === true) {
    config.headers['Content-Type'] = 'multipart/form-data';
    config.data = jsonToFormData(config.data);
  }

  return config;
};
