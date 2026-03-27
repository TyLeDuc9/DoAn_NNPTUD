import { useEffect, useState } from "react";
import { getAllUser } from "../services/userApi";

export const useAllUser = (page = 1, limit = 20, search = "", sort = "newest", role = "") => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUser({ page, limit, search, sort, role });
      setUsers(res.users || []);
      setPagination(res.pagination || {});
    } catch (err) {
      setError(err.message || "Lỗi lấy dữ liệu user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search, sort, role]);

  return { users, pagination, loading, error, refetch: fetchUsers };
};
