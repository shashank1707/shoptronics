import { getFirestore, collection, getDocs, getDoc, updateDoc, doc, addDoc, query, where, orderBy } from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);

const getCategories = async () => {
    const categories = await getDocs(collection(db, 'categories'));
    const categoryList = [];
    categories.forEach((doc) => {
        
        const categoryData = {
            id: doc.id,
            ...doc.data()
        }
        categoryList.push(categoryData);
    });
    console.log(categoryList);
    return categoryList;
}



const getProducts = async (categoryID, brandList) => {

    if (brandList.length >= 1) {
        const q = query(collection(db, `categories/${categoryID}/products`), where('brand', 'in', brandList));
        var productList = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            productList.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return productList;
    }

    return [];
}
    

const getBestProducts = async (categoryID) => {
    const path = `categories/${categoryID}/products`;
    const q = query(collection(db, path), orderBy('sold', 'desc'));
    const querySnapshot = await getDocs(q);
    var dataList = [];
    querySnapshot.forEach((doc) => {

        if (doc.exists) {
            const data = {
                id: doc.id,
                ...doc.data()
            }
            dataList.push(data)
        }
    })
    return dataList.slice(0, 3);
}

const addProduct = async (categoryID, productDetails) => {
    await addDoc(collection(db, `categories/${categoryID}/products`), productDetails).then((e) => {
        console.log('SUCCESS')
    });
}

const getProduct = async (categoryID, productID) => {
   return (await getDoc(doc(db, `categories/${categoryID}/products`, productID))).data();
}

const updateSoldCount = async (categoryID, productID, quantity) => {
    let product = await getProduct(categoryID, productID);
    const sold = product.sold + quantity;

    await updateDoc(doc(db, `categories/${categoryID}/products`, productID), {
        sold: sold
    })
}


export { getCategories, getProducts, addProduct, getBestProducts, getProduct, updateSoldCount}