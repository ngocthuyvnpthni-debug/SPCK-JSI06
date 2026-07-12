// ============================================================
// login.js
// Nhiệm vụ: Xử lý đăng nhập bằng Email/Password và Google
//
// File này chạy trên trang login.html
// Được load sau firebase-config.js
// ============================================================

// Lấy đối tượng auth từ Firebase
// (firebase đã được khởi tạo trong firebase-config.js)
const auth = firebase.auth();

// ── Hàm đăng nhập bằng Email / Password ──────────────────────
//

// Được gọi khi người dùng bấm nút "Đăng nhập"
// HTML gọi: onsubmit="handleLogin(event)"
// event là thông tin về sự kiện submit của form
//
function handleLogin(event) {
  // Ngăn trình duyệt tự động reload trang khi submit form
  // Nếu không có dòng này, trang sẽ bị reload và mất hết dữ liệu
  event.preventDefault();

  // Lấy giá trị người dùng đã nhập vào các ô input
  // .value     → lấy nội dung ô input
  // .trim()    → xoá khoảng trắng thừa ở đầu và cuối
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Lấy thẻ <p id="errorMsg"> để hiển thị lỗi
  const errorMsg = document.getElementById("errorMsg");

  // Xoá thông báo lỗi cũ (nếu người dùng đã nhập sai lần trước)
  errorMsg.textContent = "";

  // Gửi email + password lên Firebase để xác thực
  //
  // signInWithEmailAndPassword() là hàm của Firebase
  // Nó trả về một Promise — nghĩa là tác vụ chạy bất đồng bộ
  // (không chờ kết quả ngay, chạy nền rồi báo lại sau)
  //
  auth
    .signInWithEmailAndPassword(email, password)

    // .then() chạy khi đăng nhập THÀNH CÔNG
    // Firebase trả về `userCredential` chứa thông tin tài khoản
    .then(function (userCredential) {
      // userCredential.user là object chứa info của người vừa đăng nhập
      // Ví dụ: userCredential.user.email → "an@gmail.com"
      console.log("Đăng nhập thành công:", userCredential.user.email);

      // Chuyển người dùng về trang chủ
      window.location.href = "index.html";
    })

    // .catch() chạy khi đăng nhập THẤT BẠI
    // Firebase trả về `error` chứa mã lỗi
    .catch(function (error) {
      // error.code là mã lỗi, ví dụ: "auth/wrong-password"
      console.log("Mã lỗi Firebase:", error.code);

      // Hiển thị lỗi bằng tiếng Việt lên màn hình
      errorMsg.textContent = translateError(error.code);
    });
}

// ── Hàm đăng nhập bằng Google ─────────────────────────────────
//
// Được gọi khi người dùng click nút "Đăng nhập với Google"
// HTML gọi: onclick="loginGoogle()"
//
function loginGoogle() {
  // Tạo Google provider — đối tượng đại diện cho phương thức đăng nhập Google
  const provider = new firebase.auth.GoogleAuthProvider();

  // Mở cửa sổ popup để người dùng chọn tài khoản Google
  auth
    .signInWithPopup(provider)

    // .then() chạy khi chọn tài khoản Google THÀNH CÔNG
    .then(function (result) {
      // result.user chứa thông tin tài khoản Google
      console.log("Google thành công:", result.user.displayName);

      // Chuyển về trang chủ
      window.location.href = "index.html";
    })

    // .catch() chạy nếu có lỗi
    // Ví dụ: người dùng tắt popup, mất mạng, domain chưa được phép
    .catch(function (error) {
      console.log("Lỗi Google:", error.code);
      document.getElementById("errorMsg").textContent = translateError(
        error.code,
      );
    });
}

// ── Hàm dịch mã lỗi Firebase sang tiếng Việt ─────────────────
//
// Firebase trả về mã lỗi dạng chuỗi như: 'auth/wrong-password'
// Hàm này tra cứu trong object `errors` và trả về câu tiếng Việt
// Giúp người dùng hiểu lỗi mà không cần đọc tiếng Anh
//
function translateError(code) {
  // Object chứa tất cả mã lỗi và bản dịch tiếng Việt
  const errors = {
    "auth/invalid-email": "Email không hợp lệ.",
    "auth/user-not-found": "Không tìm thấy tài khoản.",
    "auth/wrong-password": "Mật khẩu không đúng.",
    "auth/invalid-credential": "Email hoặc mật khẩu không đúng.",
    "auth/too-many-requests": "Thử lại quá nhiều lần. Vui lòng đợi.",
    "auth/network-request-failed": "Lỗi mạng. Kiểm tra kết nối internet.",
    "auth/popup-closed-by-user": "Bạn đã đóng cửa sổ đăng nhập Google.",
  };

  // Tra cứu mã lỗi trong object `errors`
  // Nếu tìm thấy → trả về câu tiếng Việt tương ứng
  // Nếu không tìm thấy (||) → trả về câu mặc định
  return errors[code] || "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
