import React from "react";
import { Link } from "react-router-dom";

import {baseUrlImg} from "../../configs/configs"
import { numberWithComas} from "../../utils/utils"

const Cart = ({data,onDeleteCart,onChangeQuantities,onToggleStatus,cartsSelected}) => {
    let isCartChecked = cartsSelected.findIndex((cart)=>Number(cart.productId)===Number(data.productId)&&Number(cart.capacityId)===Number(data.capacityId))
    return (
        <div className="userCarts__item">
            <input type="checkbox" checked={isCartChecked===-1?false:true} onChange={()=>onToggleStatus(data.productId, data.capacityId)} className="userCarts__item-checkbox userCarts__checkbox"  />
            <Link to={"/product-detail/"+data.productId} className="userCarts__item-img">
                <img src={baseUrlImg+data.detail.background} alt="" />
            </Link>
            <Link to={"/product-detail/"+data.productId} className="userCarts__item-name">
                {data.detail.model}
            </Link>
            <div className="userCarts__item-category">{data.detail.capacityName}</div>
            <div className="userCarts__item__price">
                <div className="userCarts__item__price-old">{Number(data.detail.oldPrice)!==Number(data.detail.newPrice)?numberWithComas(data.detail.oldPrice)+" đ":""}</div>
                <div className="userCarts__item__price-new">{numberWithComas(data.detail.newPrice)} đ</div>
            </div>
            <div className="userCarts__item__quantities">
                <div className={Number(data.quantity)===1?"userCarts__item__quantities-decrease disable":"userCarts__item__quantities-decrease"}>
                    <i className="bx bx-minus" onClick={()=>onChangeQuantities(data.productId, data.capacityId, false)}></i>
                </div>
                <div className="userCarts__item__quantities-quantities">{data.quantity}</div>
                <div className={Number(data.detail.quantityRemain)<=Number(data.quantity)?"userCarts__item__quantities-crease disable":"userCarts__item__quantities-crease"}>
                    <i className="bx bx-plus" onClick={()=>onChangeQuantities(data.productId, data.capacityId)}></i>
                </div>
            </div>
            <div className="userCarts__item-delete">
                <i className="bx bx-trash" onClick={()=>onDeleteCart(data.productId, data.capacityId)}></i>
            </div>
        </div>
    );
};

export default Cart;
