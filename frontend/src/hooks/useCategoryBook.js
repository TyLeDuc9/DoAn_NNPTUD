import { getCategoryBook } from "../services/bookDetailApi";
import React, { useState, useEffect } from "react";

export const useCategoryBook = (id, slug) => {
  
  const [categoryBook, setCategoryBook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  useEffect(() => {
    if (!id || !slug) return; 
    const fetchCategory = async () => {
      try {
        const data = await getCategoryBook(id, slug);
        setCategoryBook(data);
      } catch (error) {
        setErr(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, slug]);
  return { categoryBook, loading, err };
};
