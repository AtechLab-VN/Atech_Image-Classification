# Hệ Thống Huấn Luyện AI

## Tổng quan
Đây là hệ thống huấn luyện AI chuyên về xử lý hình ảnh và trích xuất đặc trưng. Hệ thống được xây dựng dựa trên các công nghệ hiện đại như TensorFlow và OpenCV, cho phép thực hiện các tác vụ xử lý hình ảnh và học máy một cách hiệu quả.

## Cấu trúc dự án
```
backend/
├── data/           # Thư mục lưu trữ dữ liệu hình ảnh
├── features/       # Thư mục lưu trữ các đặc trưng đã trích xuất
├── venv/          # Môi trường ảo Python
├── detect.py      # Script phát hiện đối tượng trong hình ảnh
├── search.py      # Chức năng tìm kiếm hình ảnh tương tự
├── extract_features.py  # Script trích xuất đặc trưng từ hình ảnh
└── requirements.txt     # Danh sách các thư viện cần thiết
```

## Yêu cầu hệ thống
- Python 3.7 trở lên
- Hệ điều hành: Windows/Linux/MacOS
- RAM tối thiểu: 8GB
- GPU (khuyến nghị) để tăng tốc độ xử lý

## Hướng dẫn cài đặt
1. Tạo môi trường ảo:
```bash
cd backend
python -m venv venv
```

2. Kích hoạt môi trường ảo:
- Windows:
```bash
venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. Cài đặt các thư viện cần thiết:
```bash
pip install -r requirements.txt
```

## Các thư viện chính
- tensorflow: Framework học máy
- tensorflow-hub: Thư viện mở rộng của TensorFlow
- opencv-python: Xử lý hình ảnh
- pillow: Thao tác với hình ảnh
- matplotlib: Hiển thị và vẽ đồ thị
- numpy: Tính toán số học
- scipy: Các công cụ khoa học
- scikit-learn: Các thuật toán học máy

## Hướng dẫn sử dụng

### 1. Trích xuất đặc trưng
Để trích xuất đặc trưng từ hình ảnh:
```bash
python extract_features.py
```
- Đặt hình ảnh cần xử lý trong thư mục `data/`
- Kết quả sẽ được lưu trong thư mục `features/`

### 2. Phát hiện đối tượng
Để chạy phát hiện đối tượng:
```bash
python detect.py
```
- Script sẽ phân tích hình ảnh và phát hiện các đối tượng
- Kết quả sẽ được hiển thị và lưu lại

### 3. Tìm kiếm hình ảnh
Để sử dụng chức năng tìm kiếm:
```bash
python search.py
```
- Nhập hình ảnh cần tìm kiếm
- Hệ thống sẽ trả về các hình ảnh tương tự

## Lưu ý
- Đảm bảo đã cài đặt đầy đủ các thư viện trước khi sử dụng
- Kiểm tra đường dẫn thư mục trước khi chạy các script
- Nên sử dụng GPU để tăng tốc độ xử lý
- Giữ cấu trúc thư mục như mô tả để đảm bảo hệ thống hoạt động đúng