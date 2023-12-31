import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Oemcard from "./Oemcard";
import Navbarr from "./Navbarr";
import {useNavigate} from "react-router-dom";

const OemSpecs = () => {
   const navigate = useNavigate();
   const [cards, setCards] = useState([]);
   const [filteredCards, setFilteredCards] = useState([]);
   const [priceFilter, setPriceFilter] = useState("");
   const [colorFilter, setColorFilter] = useState("");
   const [mileageFilter, setMileageFilter] = useState("");
   const [searchInput, setSearchInput] = useState("");
   const [loading, setLoading] = useState(false);

   const fetchData = async () => {
      try {
         var token = Cookies.get("token");
         // console.log("local", token);
         const response = await axios.get(`/oem/`, {
            headers: {
               Authorization: `Bearer ${token}`
            }
         });
         console.log("OEM card data", response.data);
         setFilteredCards(response.data);
         setCards(response.data);
      } catch (error) {
         console.log("ERROR OEMSPECS ", error);
      }
   };

   const applyFilters = async () => {
      let filtered = [...cards];

      if (priceFilter) {
         filtered = filtered.sort((a, b) => {
            if (priceFilter === "asc") {
               return a.listPrice - b.listPrice;
            } else {
               return b.listPrice - a.listPrice;
            }
         });
      }

      if (colorFilter) {
         filtered = filtered.filter(
            card =>
               colorFilter === card.availableColors[0] ||
               colorFilter === card.availableColors[1] ||
               colorFilter === card.availableColors[2]
         );
      }

      if (mileageFilter) {
         filtered = filtered.filter(card => {
            if (mileageFilter === "") {
               return true; // No filter selected, include all cards
            } else if (mileageFilter === "10") {
               return Number(card.mileage) <= 10;
            } else if (mileageFilter === "20") {
               return Number(card.mileage) >= 10 && Number(card.mileage) <= 20;
            } else if (mileageFilter === "30") {
               return Number(card.mileage) <= 30 && Number(card.mileage) >= 20;
            } else {
               return true; // Invalid filter value, include all cards
            }
         });
      }
      setFilteredCards(filtered);
   };

   useEffect(() => {
      // Fetch or set the cards array
      fetchData();
   }, []);

   useEffect(() => {
      applyFilters();
   }, [priceFilter, colorFilter, mileageFilter]);

   const handleclick = card => {
      navigate("/OemEdit", {state: card});
   };

   const searchItems = searchValue => {
      setSearchInput(searchValue);
      console.log(searchInput);
      if (searchInput !== "") {
         setLoading(true);
         const filteredData = cards.filter(item => {
            return Object.values(item).join("").toLowerCase().includes(searchInput.toLowerCase());
         });
         console.log(filteredData);
         setFilteredCards(filteredData);
         setLoading(false);
      } else {
         setFilteredCards(cards);
      }
   };

   return (
      <div className=" w-screen ">
         <div>
            <Navbarr />
         </div>

         <div className="py-20 ">
            <h1 className="text-center text-3xl text-gray-500"> OEM (Select Car) </h1>

            <div className="flex ml-10 mr-10  mb-4 mt-4 text-gray-600 text-sm justify-evenly">
               {/* Price Filter */}
               <select
                  className="pl-2 pb-0 border rounded-sm border-black hover:bg-gray-200"
                  value={priceFilter}
                  onChange={e => setPriceFilter(e.target.value)}>
                  <option value="">Prices</option>
                  <option value="asc">sort low to high</option>
                  <option value="des">sort high to low</option>
               </select>
               {/* Color Filter */}
               <select
                  className="pl-2 pr-7 border rounded-sm border-black hover:bg-gray-200"
                  value={colorFilter}
                  onChange={e => setColorFilter(e.target.value)}>
                  <option value="">Colors</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="White">White</option>
                  <option value="Black">Black</option>
               </select>

               {/* Mileage Filter */}
               <select
                  className="pl-2 pr-2 border rounded-sm border-black hover:bg-gray-200"
                  value={mileageFilter}
                  onChange={e => setMileageFilter(e.target.value)}>
                  <option value="">Mileages</option>
                  <option value="10">Up to 10 miles</option>
                  <option value="20">Up to 20 miles</option>
                  <option value="30">Up to 30 miles</option>
               </select>

               {/*sEaRCH FILTER*/}
               <div className="flex">
                  <label className="mr-2">🔎 </label>
                  <br />
                  <input
                     className="border border-black rounded-sm pl-1  hover:bg-gray-200"
                     type="text"
                     placeholder="Search by  model, or year "
                     onChange={e => searchItems(e.target.value)}
                  />
               </div>
            </div>

            {loading ? (
               <div className="text-center font-extrabold">Loading...</div>
            ) : (
               <div className=" ml-20 mr-20 flex flex-wrap ">
                  {filteredCards.map(card => (
                     <button
                        className="w-30 h-30 m-5 "
                        key={card._id}
                        onClick={() => handleclick(card)}>
                        <Oemcard card={card} key={card._id} />
                     </button>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};

export default OemSpecs;
