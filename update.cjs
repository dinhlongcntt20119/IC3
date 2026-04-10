const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/lop 3/level1_hk2-p1.2.html');
let content = fs.readFileSync(filePath, 'utf8');

const newQuestions = `    const questions = [
        {
            id: 16, type: "radio",
            q: "Thiết bị đầu vào (Input device) nào sau đây được tích hợp vào điện thoại thông minh?",
            opts: [
                {v: "a", t: "Màn hình cảm ứng (Touchscreen)"},
                {v: "b", t: "Bàn di chuột (Touchpad)"},
                {v: "c", t: "Tai nghe (Earbuds)"},
                {v: "d", t: "Bộ sạc pin (Charger)"}
            ],
            ans: "a",
            explain: "Màn hình cảm ứng là thiết bị đầu vào được tích hợp sẵn trên điện thoại thông minh."
        },
        {
            id: 17, type: "radio",
            q: "Phát biểu nào sau đây là đúng về một phần mềm ứng dụng trên máy tính để bàn?",
            opts: [
                {v: "a", t: "Phần mềm phải được cài đặt trên máy tính của bạn trước khi bạn có thể khởi chạy nó"},
                {v: "b", t: "Máy tính của bạn phải được kết nối với internet để chạy nó"},
                {v: "c", t: "Phần mềm không yêu cầu bất kỳ dung lượng lưu trữ nào trên máy tính của bạn"},
                {v: "d", t: "Bạn có thể đăng nhập vào nó từ bất kỳ thiết bị nào"}
            ],
            ans: "a",
            explain: "Phần mềm ứng dụng trên máy tính để bàn cần được cài đặt vào ổ cứng trước khi sử dụng."
        },
        {
            id: 18, type: "radio",
            q: "Bạn cần sử dụng máy tính bảng (Tablet) của mình trong giờ học để tham gia vào các bài học. Bạn nhận thấy rằng thời lượng pin của máy tính bảng đang trở nên yếu. Bộ sạc của bạn không hoạt động. Bạn nên làm gì để tiếp tục tham gia trên máy tính bảng của mình?",
            opts: [
                {v: "a", t: "Hãy cho giáo viên của bạn biết rằng bộ sạc của bạn không hoạt động"},
                {v: "b", t: "Buộc bộ sạc điện thoại vào máy tính bảng của bạn ngay cả khi chúng không tương thích"},
                {v: "c", t: "Hãy để máy tính bảng của bạn tắt nguồn và không tham gia vào bài học"},
                {v: "d", t: "Bí mật chuyển đổi bộ sạc với bạn bè trong giờ giải lao"}
            ],
            ans: "a",
            explain: "Báo cho giáo viên là cách giải quyết an toàn và đúng đắn nhất khi gặp sự cố thiết bị trong giờ học."
        },
        {
            id: 19, type: "radio",
            q: "Ví dụ về thiết bị đầu vào tích hợp sẵn là gì?",
            opts: [
                {v: "a", t: "Màn hình cảm ứng (Touchscreen)"},
                {v: "b", t: "Chuột (Mouse)"},
                {v: "c", t: "Tai nghe (Headphones)"}
            ],
            ans: "a",
            explain: "Màn hình cảm ứng thường được tích hợp sẵn trên các thiết bị di động như điện thoại, máy tính bảng."
        },
        {
            id: 20, type: "radio",
            q: "Tùy chọn nào sau đây là một tập tin (File)?",
            opts: [
                {v: "a", t: "Tài liệu chứa danh sách bài tập cần làm của bạn"},
                {v: "b", t: "Một thư mục ảnh từ một chuyến đi thực địa"},
                {v: "c", t: "Buổi phát trực tiếp sự kiện thể thao"},
                {v: "d", t: "Một liên kết đến trang web trường học của bạn"}
            ],
            ans: "a",
            explain: "Tài liệu (Document) là một dạng tập tin lưu trữ dữ liệu trên máy tính."
        },
        {
            id: 21, type: "radio",
            q: "Bạn sẽ tìm thấy lệnh đóng (Close) trên thẻ (Tab) nào sau đây? (Chọn thẻ trong khu vực trả lời)",
            img: "cd21.jpg",
            opts: [
                {v: "a", t: "File"},
                {v: "b", t: "Home"},
                {v: "c", t: "Insert"},
                {v: "d", t: "Design"}
            ],
            ans: "a",
            explain: "Lệnh đóng (Close) thường nằm trong menu File của các ứng dụng văn phòng."
        },
        {
            id: 22, type: "radio",
            q: "Máy tính để bàn có thể sử dụng loại thiết bị nào để kết nối internet?",
            opts: [
                {v: "a", t: "Một thiết bị wifi (A wifi device)"},
                {v: "b", t: "Một thiết bị hiển thị (A display device)"},
                {v: "c", t: "Một thiết bị đa phương tiện (A media device)"},
                {v: "d", t: "Một thiết bị lưu trữ (A storage device)"}
            ],
            ans: "a",
            explain: "Thiết bị wifi (như USB wifi hoặc card wifi) giúp máy tính để bàn kết nối mạng không dây."
        },
        {
            id: 23, type: "radio",
            q: "Thuật ngữ cho thời gian bạn dành để làm những việc như:<br>- Xem một chương trình truyền hình với gia đình của bạn<br>- Chơi trò chơi điện tử trên bảng điều khiển<br>- Gửi tin nhắn văn bản từ điện thoại thông minh<br>- Nghiên cứu một cái gì đó trên máy tính",
            opts: [
                {v: "a", t: "Thời gian sử dụng thiết bị (Screen time)"},
                {v: "b", t: "Thời gian tập trung (Focus time)"},
                {v: "c", t: "Tương tác trực tuyến (Online interaction)"},
                {v: "d", t: "Cân bằng truyền thông (Media balance)"}
            ],
            ans: "a",
            explain: "Thời gian sử dụng thiết bị (Screen time) là tổng thời gian bạn tiếp xúc với màn hình của các thiết bị điện tử."
        },
        {
            id: 24, type: "table_tf",
            q: "Đối với mỗi phát biểu về việc vận chuyển máy tính xách tay, hãy chọn Đúng hoặc Sai.",
            headers: ["Đúng", "Sai"],
            rows: [
                {t: "Máy tính xách tay có thể được giữ trong xe một cách an toàn", a: "no"},
                {t: "Máy tính xách tay được vận chuyển an toàn trong túi đựng máy tính xách tay", a: "yes"},
                {t: "Máy tính xách tay có thể bị hỏng nếu tiếp xúc với nhiệt độ khắc nghiệt", a: "yes"}
            ],
            explain: "Để máy tính xách tay trong xe hơi không an toàn do nhiệt độ có thể quá cao hoặc quá thấp, và có nguy cơ bị mất cắp."
        },
        {
            id: 25, type: "radio",
            q: "Sarus cần tạo một trang web với mật khẩu là orange mà trường học của bạn sử dụng để quản lý bài tập về nhà. Anh ấy yêu cầu bạn gợi ý các mẹo tạo mật khẩu. Bạn nên nói gì với Sarus?",
            opts: [
                {v: "a", t: "Sử dụng số và ký hiệu trong mật khẩu"},
                {v: "b", t: "Chia sẻ mật khẩu với bạn trong trường hợp họ quên nó"},
                {v: "c", t: "Sử dụng tên thú cưng của họ làm mật khẩu"},
                {v: "d", t: "Tạo mật khẩu ngắn để dễ nhớ"}
            ],
            ans: "a",
            explain: "Sử dụng số và ký hiệu giúp mật khẩu mạnh hơn và khó bị đoán."
        },
        {
            id: 26, type: "radio",
            q: "Phần thông tin nào là an toàn để chia sẻ trực tuyến?",
            opts: [
                {v: "a", t: "Màu sắc yêu thích của bạn"},
                {v: "b", t: "Địa điểm yêu thích của bạn"},
                {v: "c", t: "Tên trường của bạn"},
                {v: "d", t: "Công viên ưa thích của bạn"}
            ],
            ans: "a",
            explain: "Màu sắc yêu thích là thông tin chung, không thể dùng để nhận dạng cá nhân nên an toàn khi chia sẻ."
        },
        {
            id: 27, type: "table_tf",
            q: "Đối với mỗi mật khẩu, hãy chọn Mạnh nếu mật khẩu mạnh hoặc Yếu nếu mật khẩu yếu.",
            headers: ["Mạnh", "Yếu"],
            rows: [
                {t: "W3*ud28x", a: "yes"},
                {t: "1234567890", a: "no"},
                {t: "ILoveC@ndy2", a: "yes"}
            ],
            explain: "Mật khẩu mạnh cần có chữ hoa, chữ thường, số và ký tự đặc biệt. Mật khẩu chỉ có số hoặc quá dễ đoán là mật khẩu yếu."
        },
        {
            id: 28, type: "radio",
            q: "Bạn nhận được một email từ cửa hàng yêu thích của mình nói rằng bạn đã giành được 1000 đô la. Bạn có thể nhập thông tin của mình vào biểu mẫu trực tuyến để nhận tiền. Điều gì sẽ khiến bạn quan tâm về email này?",
            opts: [
                {v: "a", t: "Email có thể là từ một kẻ lừa đảo đang cố gắng thu thập thông tin cá nhân của bạn"},
                {v: "b", t: "Cửa hàng có thể đã nhầm lẫn vì bạn không nhớ đã tham gia cuộc thi"},
                {v: "c", t: "Tiền ở dạng thẻ quà tặng chỉ có thể được sử dụng tại một địa điểm"},
                {v: "d", t: "Cửa hàng có thể muốn bạn tham gia vào một chiến dịch quảng cáo"}
            ],
            ans: "a",
            explain: "Các email thông báo trúng thưởng yêu cầu nhập thông tin cá nhân thường là lừa đảo (phishing)."
        },
        {
            id: 29, type: "radio",
            q: "Bạn nên làm gì nếu bạn bị người lạ có hành vi trực tuyến tục tĩu không phù hợp?",
            opts: [
                {v: "a", t: "Nói với cha mẹ hoặc giáo viên của bạn"},
                {v: "b", t: "Nói với người lạ rằng bạn không thích hành vi của họ"},
                {v: "c", t: "Trò chuyện với người lạ để giữ họ trực tuyến"},
                {v: "d", t: "Yêu cầu người lạ dừng hành vi"}
            ],
            ans: "a",
            explain: "Khi gặp tình huống xấu trực tuyến, cách tốt nhất là báo ngay cho người lớn tin cậy (cha mẹ, giáo viên) để được giúp đỡ."
        },
        {
            id: 30, type: "radio",
            q: "Nhóm nào thích hợp cho bạn bè trực tuyến?",
            opts: [
                {v: "a", t: "Những người bạn biết trong cuộc sống thực"},
                {v: "b", t: "Những người bạn gặp khi chơi trò chơi trực tuyến"},
                {v: "c", t: "Những người thực hiện giao hàng đến nhà bạn"}
            ],
            ans: "a",
            explain: "Chỉ nên kết bạn trực tuyến với những người bạn đã biết rõ trong đời thực để đảm bảo an toàn."
        }
    ];`;

const startIndex = content.indexOf('    const questions = [');
const endIndex = content.indexOf('    function renderQuiz() {');

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + newQuestions + '\n\n' + content.substring(endIndex);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated successfully');
} else {
    console.log('Could not find start or end index');
}
