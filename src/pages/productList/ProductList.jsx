/**
 * trang danh sách sản phẩmn
 */
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { baseUrlApi, baseUrlImg } from "../../configs/configs";
import ProductItem from "./ProductItem";
import Pagination from "@mui/material/Pagination";
import ProductsHeader from "./ProductsHeader"
import {getOptionsv2, getOptions} from '../../axios/baseRequest';
import {loading, unLoading} from "../..//utils/utils";
const ProductList = () => {
    /**generate đường dẫn url */
    let generateUrlParams = (params) => {
        let result = "";
        let page, limit;
        page = params.page ? params.page : "1";
        limit = params.limit ? params.limit : "8";
        if (!params["category-name"] && !params["search"]) {
            result += `?page=${page}&limit=${limit}`;
        } else if (params["category-name"]) {
            result += `?category-name=${params["category-name"]}&page=${page}&limit=${limit}`;
        } else if (params["search"]) {
            result += `?search=${params.search}&page=${page}&limit=${limit}`;
        }
        return result;
    };
    /**generate param khi thay đổi số trang*/
    let generateParams = (params) => {
        let result = {};
        let page, limit;
        page = params.page ? params.page : "1";//trang thứ mấy
        limit = params.limit ? params.limit : "8";//mấy bản ghi trên 1 trang
        if (page !== "1") {
            result.page = page;
        }
        if (limit !== "8") {
            result.limit = limit;
        }
        if (!params["category-name"] && !params["search"]) {
            return result;
            // result = {"page":page,"category-name":null,"search":null, "limit":limit}
        } else if (params["category-name"]) {
            result["category-name"] = params["category-name"];
            return result;
            // result = {"page":page,"category-name":params['category-name'],"search":null, "limit":limit}
        } else if (params["search"]) {
            result.search = params.search;
            // result = {"page":page,"category-name":null,"search":params['search'], "limit":limit}
        }
        return result;
    };
    const [searchParams, setSearchParams] = useSearchParams();
    const [productsData, setProductsData] = useState({});
    const [productsColumns, setProductsColumns] = useState(4);//hiển thị bao nhiêu cột trên 1 dòng

    /**callback function để xét lại số column hiển thị*/
    const onChangeQuantityColumns = (quantity)=>{
        setProductsColumns(quantity);
    }
    //định nghĩa các tham số param cho tìm kiếm, phân trang
    let params = Object.fromEntries(searchParams.entries());
    let [page, setPage] = useState(params.page);
    let [limit, setLimit] = useState(params.limit);
    let [categoryName, setCategoryName] = useState(params["category-name"]);
    let [searchName, setSearchName] = useState(params["search"]);

    useEffect(() => {
        /**sau khi component render xong thì xét lại các param này */
        if (page !== params.page) {
            setPage(params.page);
        }
        if (limit !== params.limit) {
            setLimit(params.limit);
        }
        if (categoryName !== params["category-name"]) {
            setCategoryName(params["category-name"]);
        }
        if (searchName !== params["search"]) {
            setSearchName(params["search"]);
        }
    });
    useEffect(() => {
        loading();
        try {
            /**
             * gọi api để lấy danh sách product khi thay đổi số bản ghi / trang....
             */
            fetch(`${baseUrlApi}products.php${generateUrlParams(params)}`, getOptions('GET')).then((res) => {
                if (res.status === 200 || res.status === 201) {
                    res.json().then((res) => {
                        setProductsData(res);
                        unLoading();
                    });
                }
            });
        } catch (error) {
            unLoading();
        }
    }, [page, limit, categoryName, searchName]);
    useEffect(()=>{//cuộn lên đầu trang do thằng này nó không có slide hay navbar
        window.scrollTo(0,0)
    },[])
    const handleChangePagination = (event, value) => {
        if(categoryName||searchName){
            window.scrollTo(0,0)
        }else{
            if(document.documentElement.clientWidth<=768){
                window.scrollTo(0,(document.documentElement.clientWidth/2)+78)
            }else{
                window.scrollTo(0,((document.documentElement.clientWidth - 270) / 2))
            }
        }
        
        params.page = value+""
        setSearchParams(generateParams(params));
    };
    
    return (
        <>
            <ProductsHeader onChangeQuantityColumns={onChangeQuantityColumns} columns={productsColumns}/>
            <div className="productList__container row">
                {/* <ProductItem /> */}
                {productsData.data &&
                    productsData.data.map((product) => (
                        <ProductItem key={product.id} data={product} columns={productsColumns} />
                    ))}
            </div>
            <div className="productList__pagination">
                {productsData.data && Number(productsData.pagination.totalPage)>1 && (
                    <Pagination
                        count={Number(productsData.pagination.totalPage)}
                        color="primary"
                        size="large"
                        page={Number(productsData.pagination.currentPage)}
                        onChange={handleChangePagination}
                    />
                )}
            </div>
        </>
    );
};

export default ProductList;
