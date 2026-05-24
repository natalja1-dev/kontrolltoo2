import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { ArrowDown, ArrowUp, Check, ShoppingBag } from "lucide-react"
import { Link } from 'react-router-dom'
import.meta.env.Backend_URL

function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sort, setSort] = useState("id,asc")
  const [size, setSize] = useState(2)
  const CATEGORIES_API_URL = "http://localhost:8081/categories"
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
      fetch(CATEGORIES_API_URL)
        .then((response) => response.json())
        .then((json) => {
          console.log(json)
          setCategories(json)
        })
    }, [])

  useEffect(() => {
  async function fetchProducts() {
    try {
      const data = await fetch(
        `http://localhost:8081/products?size=${size}&sort=${sort}&page=${page}&search=${search}&category=${selectedCategory}`
      );
      const fetchData = await data.json();
      setProducts(fetchData.content.slice());
    } catch (e) {
      console.error("Unable to fetch products", e);
    }
  }

  fetchProducts();
}, [page, size, sort, search, selectedCategory]);

  const sortAZ = () => {
    setSort("title,asc")
  }

  const sortZA = () => {
    setSort("title,desc")
  }

  const sortPriceIncreasing = () => {
     setSort("price,asc")
  }

  const sortPriceDecreasing = () => {
    setSort("price,desc")
  }

  const filterByCategory = (category) => {
    setSelectedCategory(category)
  }

  const addToCart = (product) => {
    const cartLS = JSON.parse(localStorage.getItem("cart")) || [];
    cartLS.push(product);
    localStorage.setItem("cart", JSON.stringify(cartLS));
  }

  return (
  <div className="flex flex-col gap-6 pt-4">
    <h1 className="text-xl font-semibold">React Storefront</h1>

    <div className="flex flex-wrap gap-2">
      <Button onClick={sortAZ} variant="outline">
        A-Z
      </Button>

      <Button onClick={sortZA} variant="outline">
        Z-A
      </Button>

      <Button onClick={sortPriceIncreasing} variant="outline">
        Price <ArrowUp />
      </Button>

      <Button onClick={sortPriceDecreasing} variant="outline">
        Price <ArrowDown />
      </Button>

      <Button
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
      >
        Eelmine
      </Button>

      <Button onClick={() => setPage(page + 1)}>
        Järgmine
      </Button>
    </div>

    <input
      className="border px-2 py-1 rounded"
      placeholder="Search product..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value)
        setPage(0)
      }}
    />

    <div className="flex items-center gap-2">
      <label htmlFor="category-filter">Choose category</label>

      <select
        value={selectedCategory}
        onChange={(e) => {
          filterByCategory(e.target.value)
          setPage(0)
        }}
      >
        <option value="all">All</option>

        {categories.map(category => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>

    <div className="flex items-center gap-2">
      <label htmlFor="size-filter">Choose size</label>

      <select
        value={size}
        onChange={(e) => {
          setSize(e.target.value)
          setPage(0)
        }}
      >
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>

    <div>{products.length} items currently in stock.</div>

    {products.map((product, index) => (
      <div
        key={product.id}
        className="grid w-full grid-cols-[2rem_100px_minmax(0,1fr)_auto] items-center gap-4 py-8"
      >
        <div className="text-right">{index + 1}.</div>

        <img
          className="w-[100px] h-[100px] object-cover"
          src={product.image}
          alt={product.description}
        />

        <div className="min-w-0">
          <div>{product.title}</div>
          <div>{product.price}€</div>
        </div>

        <div className="justify-self-end flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/product/${product.id}`}>
              View product
            </Link>
          </Button>

          <Button
            size="icon"
            onClick={() => {
              addToCart(product)

              toast("Product has been added to the cart.", {
                icon: <Check className="h-4 w-4" />,
              })
            }}
          >
            <ShoppingBag />
          </Button>
        </div>
      </div>
    ))}

    <Toaster position="top-center" />
  </div>
)
}


export default Home