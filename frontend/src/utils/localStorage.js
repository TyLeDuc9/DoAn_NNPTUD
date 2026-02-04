// utils/localStorage.js
export const saveAddresses = (addresses) => {
  try {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  } catch (err) {
    console.error("Không thể lưu địa chỉ vào localStorage", err);
  }
};

export const loadAddresses = () => {
  try {
    const addresses = localStorage.getItem("addresses");
    return addresses ? JSON.parse(addresses) : [];
  } catch (err) {
    console.error("Load địa chỉ thất bại", err);
    return [];
  }
};
