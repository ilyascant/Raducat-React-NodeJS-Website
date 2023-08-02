module.exports = (data) => data.replace(/[^\w\s-]/g, "")?.replace(/\s/g, "-");
