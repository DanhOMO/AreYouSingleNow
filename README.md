# Dự án Ứng dụng Hẹn hò (AreYouSingleNow)

Đây là dự án ứng dụng hẹn hò đa nền tảng (React Native) trong khuôn khổ môn học Lập trình Di động.

## 🏛️ Kiến trúc Hệ thống

Hệ thống được xây dựng theo kiến trúc 3 lớp:
* **Frontend:** React Native (Expo)
* **Backend:** Node.js (Express.js)
* **Database:** MongoDB

## 📋 Yêu cầu Cài đặt (Prerequisites)

* [Node.js](https://nodejs.org/) (Phiên bản 18+)
* [Git](https://git-scm.com/)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Tài khoản miễn phí)
* [Ngrok](https://ngrok.com/) (Tùy chọn, để test deploy)
* Máy ảo Android (Android Studio) hoặc thiết bị thật (đã bật USB Debugging)
* Ứng dụng `Expo Go` (nếu chạy ở chế độ managed) hoặc App build tùy chỉnh (nếu chạy `run:android`).

---

## 🚀 1. Hướng dẫn Chạy Backend (Server)

1.  **Đi đến thư mục Backend:**
    ```bash
    cd Source/dating_server
    node src/index.js
    ```

2.  **Cài đặt thư viện:**
    ```bash
    npm install
    ```

3.  **Thiết lập Biến Môi trường (`.env`):**
    Tạo một file tên là `.env` trong thư mục `dating_server` và điền các giá trị sau (dựa trên các file chúng ta đã làm):

    ```env
    # MongoDB
    MONGO_URI=mongodb+srv://<user>:<password>@cluster...

    # JSON Web Token
    JWT_SECRET=CHUOI_BI_MAT_CUA_BAN

    # Google Drive API (cho Upload Ảnh)
    GOOGLE_CLIENT_ID=...
    GOOGLE_CLIENT_SECRET=...
    GOOGLE_REFRESH_TOKEN=...

    # Nodemailer (Cho Quên mật khẩu)
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASSWORD=your-16-letter-app-password
    ```

4.  **Mở Quyền truy cập IP (MongoDB Atlas):**
    * Đăng nhập MongoDB Atlas.
    * Vào mục "Network Access".
    * Thêm IP của bạn (hoặc chọn "ALLOW ACCESS FROM ANYWHERE" - `0.0.0.0/0`) để server Node.js có thể kết nối.

5.  **Chạy Server:**
    ```bash
    # (Khuyến khích dùng nodemon để tự khởi động lại)
    nodemon src/index.js
    
    # (Hoặc dùng node)
    node src/index.js
    ```
    Server sẽ chạy tại `http://localhost:3000`.

---

## 📱 2. Hướng dẫn Chạy Frontend (App)

1.  **Đi đến thư mục Frontend:**
    ```bash
    cd Source/are-you-single
    ```

2.  **Cài đặt thư viện:**
    ```bash
    npm install
    ```

3.  **Cấu hình Địa chỉ IP (Rất quan trọng):**
    Bạn cần cho app biết địa chỉ của backend đang chạy ở đâu. Mở các file sau và cập nhật IP:

    * `src/lib/api.ts`: Sửa `const IP = "192.168.1.XX"` (thay bằng địa chỉ IPv4 mạng LAN của máy tính bạn).
    * `src/hooks/useSocket.ts`: Sửa `const SOCKET_URL = "http://192.168.1.XX:3000"` (thay bằng IP tương tự).

4.  **Tạo thư mục `android`/`ios` (Nếu chưa có):**
    (Cần thiết vì chúng ta dùng ZegoCloud và các thư viện native khác)
    ```bash
    npx expo prebuild --platform android
    ```

5.  **Chạy ứng dụng:**
    * Đảm bảo máy ảo Android của bạn đang chạy (hoặc đã cắm điện thoại).
    * Chạy lệnh:
    ```bash
    npx expo run:android
    ```
    *(Ứng dụng sẽ tự động build và cài đặt lên máy ảo/thiết bị của bạn.)*
