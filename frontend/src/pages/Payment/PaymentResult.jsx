import { useLocation } from "react-router-dom";

export const PaymentResult = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const status = query.get("status"); 

  return (
    <div className="text-center mt-20">
      {status === "paid" ? (
        <h1 className="text-green-600 text-2xl">Thanh toán thành công!</h1>
      ) : (
        <h1 className="text-red-600 text-2xl">Thanh toán thất bại!</h1>
      )}
    </div>
  );
};
