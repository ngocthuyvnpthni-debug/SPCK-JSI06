const auth = firebase.auth();

// ── Hàm đăng ký bằng Email / Password ────────────────────────
//
// Được gọi khi người dùng bấm nút "Đăng ký"
// HTML gọi: onsubmit="handleSignup(event)"
//
function handleSignup(event) {
  // Ngăn trình duyệt tự động reload trang khi submit form
  event.preventDefault();

  // Lấy giá trị từ tất cả các ô input
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Lấy 2 thẻ thông báo
  const errorMsg = document.getElementById("errorMsg"); // thẻ hiển thị lỗi (màu đỏ)
  const successMsg = document.getElementById("successMsg"); // thẻ hiển thị thành công (màu xanh)

  // Xoá thông báo cũ từ lần nhập trước
  errorMsg.textContent = "";
  successMsg.textContent = "";

  if (name.length < 3) {
    errorMsg.textContent = "Ten nguoi dung qua ngan";
    return;
  }

  // Kiểm tra 2 ô mật khẩu có khớp nhau không
  // Bước này kiểm tra ở TRÌNH DUYỆT (client-side) trước khi gửi lên Firebase
  // Giúp tiết kiệm thời gian, không cần gọi API Firebase
  if (password !== confirmPassword) {
    errorMsg.textContent = "Mật khẩu xác nhận không khớp.";
    return; // dừng hàm lại, không chạy tiếp
  }

  // Gửi email + password lên Firebase để tạo tài khoản mới
  //
  // createUserWithEmailAndPassword() là hàm của Firebase
  // Firebase sẽ:
  //   1. Kiểm tra email đã tồn tại chưa
  //   2. Kiểm tra mật khẩu đủ mạnh không (tối thiểu 6 ký tự)
  //   3. Nếu OK → tạo tài khoản và lưu lên server
  //
  auth
    .createUserWithEmailAndPassword(email, password)

    // .then() đầu tiên: Firebase đã tạo tài khoản thành công
    // userCredential.user là object đại diện cho tài khoản vừa tạo
    .then(function (userCredential) {
      // updateProfile() cập nhật thêm thông tin cho tài khoản
      // Ở đây ta lưu tên hiển thị (displayName)
      // Dùng `return` để chờ updateProfile xong rồi mới chạy .then() tiếp theo
      return userCredential.user.updateProfile({ displayName: name });
    })

    // .then() thứ hai: đã lưu tên thành công
    .then(function () {
      // Hiển thị thông báo thành công lên màn hình
      successMsg.textContent =
        "Đăng ký thành công! Đang chuyển sang đăng nhập...";
      console.log("Đăng ký thành công");

      // Chờ 1.5 giây (1500ms) rồi chuyển sang trang đăng nhập
      // setTimeout(hàm, thời_gian_ms) → chạy hàm sau X mili giây
      setTimeout(function () {
        window.location.href = "login.html";
      }, 1500);
    })

    // .catch() chạy nếu có LỖI ở bất kỳ bước nào ở trên
    .catch(function (error) {
      console.log("Mã lỗi Firebase:", error.code);
      errorMsg.textContent = translateError(error.code);
    });
}

// ── Hàm đăng ký / đăng nhập bằng Google ──────────────────────
//
// Đặc biệt: Firebase tự phân biệt
//   - Lần đầu dùng Google → tự động TẠO tài khoản mới
//   - Đã dùng Google rồi  → tự động ĐĂNG NHẬP luôn
// Không cần phân biệt thủ công
//
function loginGoogle() {
  // Tạo Google provider
  const provider = new firebase.auth.GoogleAuthProvider();

  // Mở popup chọn tài khoản Google
  auth
    .signInWithPopup(provider)

    .then(function (result) {
      console.log("Google thành công:", result.user.displayName);
      // Đăng ký/đăng nhập Google xong → về trang chủ
      window.location.href = "index.html";
    })

    .catch(function (error) {
      console.log("Lỗi Google:", error.code);
      document.getElementById("errorMsg").textContent = translateError(
        error.code,
      );
    });
}

// ── Hàm dịch mã lỗi Firebase sang tiếng Việt ─────────────────
function translateError(code) {
  const errors = {
    "auth/email-already-in-use": "Email này đã được đăng ký.",
    "auth/invalid-email": "Email không hợp lệ.",
    "auth/weak-password": "Mật khẩu phải có ít nhất 6 ký tự.",
    "auth/network-request-failed": "Lỗi mạng. Kiểm tra kết nối internet.",
    "auth/popup-closed-by-user": "Bạn đã đóng cửa sổ đăng nhập Google.",
  };

  return errors[code] || "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
