import React, { useEffect, useState } from "react";

function CartNow(props) {
    const noteInfo = props.noteInfo;
    const note_id = noteInfo.nid;
    
    const [cart, setCart] = useState([]);
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        const cart = localStorage.getItem("cart")
            ? JSON.parse(localStorage.getItem("cart"))
            : [];
        setCart(cart);
        // filter out the note_id from the cart
        const found = cart.find((item) => item.note_id === note_id);
        setIsInCart(found ? true : false);
    }, [note_id]);

    const addToCart = () => {
        const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
        cart.push({ note_id: note_id, note_name: noteInfo.nname, subtopic_name: noteInfo.stname, amount: noteInfo.amount });
        localStorage.setItem("cart", JSON.stringify(cart));
        setIsInCart(true);
    }

    const removeFromCart = () => {
        const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
        const newCart = cart.filter((item) => item.note_id !== note_id);
        localStorage.setItem("cart", JSON.stringify(newCart));
        setIsInCart(false);
    }
    
  return (
    <button
      id="close"
      className="cancel bg-[#f082ac] hover:bg-[#ec5f95]"
      onClick={isInCart ? removeFromCart : addToCart}
    >
        {isInCart ? "Remove from Cart" : "Add to Cart"}
    </button>
  );
}

export default CartNow;
