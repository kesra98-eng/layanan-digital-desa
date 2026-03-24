function renderTemplate(template, data) {
  let hasil = template;

  for (let key in data) {
    const regex = new RegExp(`{{${key}}}`, "g");
    hasil = hasil.replace(regex, data[key] || "");
  }

  return hasil;
}

module.exports = renderTemplate;