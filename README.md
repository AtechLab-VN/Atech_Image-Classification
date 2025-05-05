# Hướng Dẫn Hệ Thống AI Training

## Tổng Quan Hệ Thống
Đây là một hệ thống full-stack dành cho việc huấn luyện AI, bao gồm frontend React và backend FastAPI. Hệ thống được thiết kế để quản lý và huấn luyện các mô hình AI.

## Kiến Trúc Hệ Thống

### Frontend (React)
- Được xây dựng bằng Create React App
- Hỗ trợ TypeScript
- Giao diện người dùng hiện đại
- Nằm trong thư mục `frontend`

### Backend (FastAPI)
- Máy chủ API dựa trên Python
- SQLAlchemy để quản lý cơ sở dữ liệu
- Khả năng AI/ML với TensorFlow và scikit-learn
- Nằm trong thư mục `backend`

## Yêu Cầu Hệ Thống
- Node.js và npm (cho frontend)
- Python 3.x (cho backend)
- PostgreSQL (cơ sở dữ liệu)

## Hướng Dẫn Cài Đặt

### Cài Đặt Frontend
1. Di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
3. Khởi động máy chủ phát triển:
   ```bash
   npm start
   ```

### Cài Đặt Backend
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Tạo và kích hoạt môi trường ảo:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Trên Windows
   ```
3. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   ```
4. Khởi động máy chủ backend:
   ```bash
   uvicorn app.main:app --reload
   ```

## Tính Năng Hệ Thống
- Huấn luyện và quản lý mô hình AI
- Tải lên và xử lý file
- Tích hợp cơ sở dữ liệu
- Xác thực người dùng
- Theo dõi và quản lý phiên bản mô hình

## Cấu Trúc Thư Mục

### Frontend
- `src/` - Mã nguồn
- `public/` - Tài nguyên tĩnh
- `node_modules/` - Các thư viện
- Các file cấu hình (package.json, tsconfig.json)

### Backend
- `app/` - Mã nguồn chính
- `models/` - Các mô hình AI
- `features/` - Trích xuất đặc trưng
- `alembic/` - Quản lý cơ sở dữ liệu
- `uploads/` - Lưu trữ file
- `venv/` - Môi trường ảo Python

## Hướng Dẫn Phát Triển
1. Tuân thủ các quy tắc TypeScript trong phát triển frontend
2. Xử lý lỗi đúng cách ở cả frontend và backend
3. Cập nhật cơ sở dữ liệu thường xuyên
4. Tài liệu hóa các API endpoint và cách sử dụng
5. Kiểm tra kỹ lưỡng các thành phần và tính năng

## Triển Khai
- Frontend: Build và triển khai lên dịch vụ hosting tĩnh
- Backend: Triển khai lên dịch vụ hỗ trợ Python
- Cơ sở dữ liệu: Thiết lập PostgreSQL cho môi trường production

## Hỗ Trợ và Bảo Trì
- Cập nhật thư viện thường xuyên
- Các bản vá bảo mật
- Theo dõi hiệu suất
- Quy trình sao lưu

## Đóng Góp
1. Fork repository
2. Tạo nhánh tính năng
3. Commit các thay đổi
4. Push lên nhánh
5. Tạo Pull Request

## Giấy Phép
[Chỉ định giấy phép của bạn ở đây]
