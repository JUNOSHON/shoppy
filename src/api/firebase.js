import {initializeApp} from "firebase/app";
import {getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged} from "firebase/auth";
import {getDatabase, ref, set, get,remove} from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

// 파이어베이스 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase(app);


export function login() { //로그인 시 팝업 창
  signInWithPopup(auth, provider)
    .catch(console.error);
}

export function logout() { //로그아웃 시 팝업 창
  signOut(auth).catch(console.error);
}

export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}

async function adminUser(user) {
  
  return get(ref(database, "admins"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const admins = snapshot.val();
        console.log(admins);
        const isAdmin = admins.includes(user.uid);
        return {...user, isAdmin};
      }
      return user;
    });
}

export async function addNewProduct(product, image) {
  const id = crypto.randomUUID();
  return set(ref(database, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image,
    options: product.options.split(","),
  });
}

export async function getProducts() {
  return get(ref(database, "products")).then(snapshot => {
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  });
}

export async function getCart(userId) { //해당 사용자의 ID 에 있는 장바구니 불러오기
  return get(ref(database, `carts/${userId}`))
    .then(snapshot => {
      const items = snapshot.val() || {};
      return Object.values(items);
    });
}

export async function addOrUpdateToCart(userId, product) { //장바구니 추가 및 수정
  return set(ref(database, `carts/${userId}/${product.id}`), product);
}

export async function removeFromCart(userId, productId) { //장바구니 삭제
  return remove(ref(database, `carts/${userId}/${productId}`))
}

provider.setCustomParameters({ //자동로그인 방지
  prompt: "select_account",
});
