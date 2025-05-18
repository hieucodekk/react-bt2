import React, { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchData();
  }, [page, limit, search, sort]);

  const fetchData = async () => {
    const skip = (page - 1) * limit;
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    const res = await fetch(url);
    const data = await res.json();

    let filteredProducts = data.products.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    setProducts(filteredProducts);
    setTotal(data.total);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container">
      <div className="toolbar">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          {[6, 12, 24, 48].map((option) => (
            <option key={option} value={option}>
              {option} sản phẩm/trang
            </option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Hủy sắp xếp</option>
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
        </select>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.thumbnail} alt={product.title} />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          ◀ Trước
        </button>
        <span>
          Trang {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= totalPages}
        >
          Sau ▶
        </button>
      </div>
    </div>
  );
};

export default ProductList;
