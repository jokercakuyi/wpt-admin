import {request, METHOD} from '@/utils/request'
import {getPackets,EDIT_PACKETS,DELETE_PACKETS,CREATE_PACKETS,COMMIT_PACKETS,GET_PRODUCTS,DELETE_PRODUCTS,
    GET_PRODUCTS_INFO,INSERT_PRODUCTS,GET_ADDRESS,UPDATE_PRODUCTS,GET_ORDER,GET_ORDER_INFO,PICK_ORDER,GET_NEWS,
    REBACK_NEWS,RELEASE_NEWS,DELETE_NEWS,GET_COMPANY_ADDRESS,INSERT_COMPANY_ADDRESS,UPDATE_COMPANY_ADDRESS,
    GET_COMPANY_ADDRESS_INFO,DELETE_COMPANY_ADDRESS,GET_COMPANY_ADDRESS_PRODUCT,GET_COMPANY_INFO,UPDATE_COMPANY_INFO,
    GET_NEWS_INFO,INSERT_NEWS,UPDATE_NEWS,GET_HOME_INFO,GET_PRODUCT_INFO} from '@/services/api'
import {UPLOAD_FILE} from "./api";

export function listPackets(params) {
    return request(getPackets, METHOD.GET, params)
}
export function editPackets(params) {
    return request(EDIT_PACKETS,METHOD.POST,params)
}
export function deletePackets(params){
    return request(DELETE_PACKETS,METHOD.POST,params)
}
export function createPackets(params){
    return request(CREATE_PACKETS,METHOD.POST,params)
}
export function commitPackets(params){
    return request(COMMIT_PACKETS,METHOD.POST,params)
}
export function getProducts(params){
    return request(GET_PRODUCTS,METHOD.GET,params)
}
export function deleteProducts(params){
    return request(DELETE_PRODUCTS,METHOD.POST,params)
}
export function getProductsInfo(params){
    return request(GET_PRODUCTS_INFO,METHOD.GET,params)
}
export function insertProducts(params){
    return request(INSERT_PRODUCTS,METHOD.POST,params)
}
export function updateProducts(params){
    return request(UPDATE_PRODUCTS,METHOD.POST,params)
}
export function getAddress(params){
    return request(GET_ADDRESS,METHOD.GET,params)
}
export function getOrders(params){
    return request(GET_ORDER,METHOD.GET,params)
}
export function getOrdersDetail(params){
    return request(GET_ORDER_INFO,METHOD.GET,params)
}
export function pickOrder(params){
    return request(PICK_ORDER,METHOD.POST,params)
}
export function getNews(params){
    return request(GET_NEWS,METHOD.GET,params)
}
export function rebackNews(params){
    return request(REBACK_NEWS,METHOD.POST,params);
}
export function releaseNews(params){
    return request(RELEASE_NEWS,METHOD.POST,params);
}
export function deleteNews(params){
    return request(DELETE_NEWS,METHOD.POST,params);
}
export function getCompanyAddress(params){
    return request(GET_COMPANY_ADDRESS,METHOD.GET,params);
}
export function insertCompanyAddress(params){
    return request(INSERT_COMPANY_ADDRESS,METHOD.POST,params);
}
export function updateCompanyAddress(params){
    return request(UPDATE_COMPANY_ADDRESS,METHOD.POST,params);
}
export function getCompanyAddressInfo(params){
    return request(GET_COMPANY_ADDRESS_INFO,METHOD.GET,params);
}
export function deleteCompanyAddress(params){
    return request(DELETE_COMPANY_ADDRESS,METHOD.POST,params);
}
export function getProductAddress(params){
    return request(GET_COMPANY_ADDRESS_PRODUCT,METHOD.GET,params);
}
export function getCompanyInfo(params){
    return request(GET_COMPANY_INFO,METHOD.GET,params);
}
export function updateCompanyInfo(params){
    return request(UPDATE_COMPANY_INFO,METHOD.POST,params);
}
export function getNewsInfo(params){
    return request(GET_NEWS_INFO,METHOD.GET,params);
}
export function uploadFile(params){
    return request(UPLOAD_FILE,METHOD.POST,params);
}
export function insertNews(params){
    return request(INSERT_NEWS,METHOD.POST,params);
}
export function updateNews(params) {
    return request(UPDATE_NEWS,METHOD.POST,params);
}
export function getHomeInfo(params){
    return request(GET_HOME_INFO,METHOD.GET,params);
}
export function getProductInfo(params){
    return request(GET_PRODUCT_INFO,METHOD.GET,params);
}
export default {
    listPackets,
    editPackets,
    deletePackets,
    createPackets,
    commitPackets,
    getProducts,
    deleteProducts,
    getProductsInfo,
    insertProducts,
    updateProducts,
    getAddress,
    getOrders,
    getOrdersDetail,
    pickOrder,
    getNews,
    rebackNews,
    releaseNews,
    deleteNews,
    getCompanyAddress,
    insertCompanyAddress,
    updateCompanyAddress,
    getCompanyAddressInfo,
    deleteCompanyAddress,
    getProductAddress,
    getCompanyInfo,
    updateCompanyInfo,
    getNewsInfo,
    uploadFile,
    insertNews,
    updateNews,
    getHomeInfo,
    getProductInfo
}
